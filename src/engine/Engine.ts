import * as BABYLON from "babylonjs";

class Engine {
  private readonly _canvas: HTMLCanvasElement;
  private readonly _engine: BABYLON.Engine;
  private readonly _scene: BABYLON.Scene;
  private readonly _camera: BABYLON.FreeCamera;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._engine = new BABYLON.Engine(this._canvas, true);
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.clearColor = new BABYLON.Color4(0, 0, 0);
    this._camera = new BABYLON.FreeCamera(
      "camera1",
      new BABYLON.Vector3(0, 5, -10),
      this._scene,
    );
    this._camera.setTarget(BABYLON.Vector3.Zero());

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
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

  get camera(): BABYLON.FreeCamera {
    return this._camera;
  }
}

export default Engine;
