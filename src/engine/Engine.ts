import * as BABYLON from "babylonjs";
import { CameraMode } from "@/engine/CameraMode";
import type Entity from "@/entities/Entity.ts";
import type { Vec3 } from "@/entities/Vec3.ts";
import type { HasModel } from "@/entities/WithModel.ts";
import { WithModel } from "@/entities/WithModel.ts";
import { toVector3 } from "@/utils/toVector3.ts";

class Engine {
  private static readonly ORBIT_MIN_BETA = 0.1;
  private static readonly ORBIT_MAX_BETA = Math.PI / 2 - 0.05;
  private static readonly ORBIT_MIN_RADIUS = 4;
  private static readonly ORBIT_MAX_RADIUS = 300;
  private static readonly DEFAULT_ORBIT_ANGULAR_SPEED_RADIANS = 0.12;

  private readonly _canvas: HTMLCanvasElement;
  private readonly _engine: BABYLON.Engine;
  private readonly _scene: BABYLON.Scene;
  private readonly _camera: BABYLON.ArcRotateCamera;
  private readonly _orbitTarget = BABYLON.Vector3.Zero();
  private _cameraMode: CameraMode = CameraMode.Fixed;
  private _orbitAngularSpeedRadians =
    Engine.DEFAULT_ORBIT_ANGULAR_SPEED_RADIANS;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._engine = new BABYLON.Engine(this._canvas, true);
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.useRightHandedSystem = true;
    this._scene.clearColor = new BABYLON.Color4(0, 0, 0);
    this._camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 3,
      24,
      BABYLON.Vector3.Zero(),
      this._scene,
    );
    this._camera.upVector = new BABYLON.Vector3(0, 0, 1);
    this._camera.wheelDeltaPercentage = 0.01;
    this._camera.lowerBetaLimit = Engine.ORBIT_MIN_BETA;
    this._camera.upperBetaLimit = Engine.ORBIT_MAX_BETA;
    this._camera.lowerRadiusLimit = Engine.ORBIT_MIN_RADIUS;
    this._camera.upperRadiusLimit = Engine.ORBIT_MAX_RADIUS;
    this._camera.setTarget(this._orbitTarget);
    this._scene.activeCamera = this._camera;

    this._engine.runRenderLoop(() => {
      if (
        this._cameraMode === CameraMode.Orbit &&
        this._orbitAngularSpeedRadians !== 0
      ) {
        const deltaSeconds = this._engine.getDeltaTime() / 1000;
        this._camera.alpha += this._orbitAngularSpeedRadians * deltaSeconds;
      }
      this._scene.render();
    });
  }

  setCameraMode(mode: CameraMode) {
    this._cameraMode = mode;
  }

  setFixedView(position: Vec3, target: Vec3 = [0, 0, 0]) {
    this._orbitTarget.copyFrom(toVector3(target));
    this._camera.setTarget(this._orbitTarget);
    this._camera.setPosition(toVector3(position));
    this.normalizeOrbitCamera();
  }

  private normalizeOrbitCamera() {
    const safeAlpha = Number.isFinite(this._camera.alpha)
      ? this._camera.alpha
      : -Math.PI / 2;
    const safeBeta = Number.isFinite(this._camera.beta)
      ? this._camera.beta
      : Math.PI / 3;
    const safeRadius = Number.isFinite(this._camera.radius)
      ? this._camera.radius
      : 24;

    this._camera.alpha = safeAlpha;
    this._camera.beta = BABYLON.Scalar.Clamp(
      safeBeta,
      Engine.ORBIT_MIN_BETA,
      Engine.ORBIT_MAX_BETA,
    );
    this._camera.radius = BABYLON.Scalar.Clamp(
      safeRadius,
      Engine.ORBIT_MIN_RADIUS,
      Engine.ORBIT_MAX_RADIUS,
    );
    this._camera.setTarget(this._orbitTarget);
  }

  async loadEntityModels(
    entities: Array<Entity & HasModel>,
  ): Promise<BABYLON.AbstractMesh[]> {
    if (entities.length === 0) {
      return [];
    }

    const loadResults = await Promise.all(
      entities.map(async (entity) => {
        const loadResult = await BABYLON.ImportMeshAsync(
          entity.modelUrl,
          this._scene,
        );
        this.setLoadedModelPosition(loadResult, entity.pos);
        return loadResult;
      }),
    );

    return loadResults.flatMap((loadResult) => loadResult.meshes);
  }

  loadEntities(entities: Entity[]): Promise<BABYLON.AbstractMesh[]> {
    const modelEntities = entities.filter(
      (entity): entity is Entity & HasModel => entity instanceof WithModel,
    );

    return this.loadEntityModels(modelEntities);
  }

  private setLoadedModelPosition(
    loadResult: BABYLON.ISceneLoaderAsyncResult,
    pos: Vec3,
  ) {
    const rootNodes = [...loadResult.transformNodes, ...loadResult.meshes].filter(
      (node) => !node.parent,
    );

    if (rootNodes.length === 0) {
      return;
    }

    const container = new BABYLON.TransformNode("entityModelRoot", this._scene);

    rootNodes.forEach((node) => {
      node.setParent(container);
    });

    container.rotation.x = Math.PI / 2;
    container.position.copyFrom(toVector3(pos));
  }

  handleResize() {
    this._engine.resize();
  }

  disposeEngine() {
    this._engine.dispose();
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  get engine(): BABYLON.Engine {
    return this._engine;
  }

  get scene(): BABYLON.Scene {
    return this._scene;
  }

  get camera(): BABYLON.Camera {
    return this._scene.activeCamera ?? this._camera;
  }

  get orbitCamera(): BABYLON.ArcRotateCamera {
    return this._camera;
  }

  get cameraMode(): CameraMode {
    return this._cameraMode;
  }
}

export default Engine;
