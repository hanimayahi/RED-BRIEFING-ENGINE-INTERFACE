import * as BABYLON from "babylonjs";

class Scene {
  private readonly canvas: HTMLCanvasElement;
  private readonly engine: BABYLON.Engine;
  private readonly scene: BABYLON.Scene;
  private readonly camera: BABYLON.FreeCamera;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.camera = new BABYLON.FreeCamera(
      "camera1",
      new BABYLON.Vector3(0, 5, -10),
      this.scene,
    );
    this.camera.setTarget(BABYLON.Vector3.Zero());
    // this.camera.attachControl(canvas, true);
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      this.scene,
    );
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    // Our built-in 'sphere' shape.
    const sphere = BABYLON.MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      this.scene,
    );

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      this.scene,
    );

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  handleResize() {
    this.engine.resize();
  }

  disposeEngine() {
    this.engine.dispose();
  }
}

export default Scene;
