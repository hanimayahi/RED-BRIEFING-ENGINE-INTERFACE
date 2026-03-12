import * as BABYLON from "babylonjs";

class GroundGrid {
  private readonly cellSizeMeters = 2;
  private lines: BABYLON.Vector3[][] = [];

  constructor(x: number, y: number) {
    if (x <= 0 || y <= 0) {
      throw new Error("Grid dimensions must be greater than 0.");
    }

    const width = this.cellSizeMeters * x;
    const height = this.cellSizeMeters * y;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    for (let i = -halfWidth; i <= halfWidth; i += this.cellSizeMeters) {
      this.lines.push([
        new BABYLON.Vector3(i, -halfHeight, 0),
        new BABYLON.Vector3(i, halfHeight, 0),
      ]);
    }

    for (let i = -halfHeight; i <= halfHeight; i += this.cellSizeMeters) {
      this.lines.push([
        new BABYLON.Vector3(-halfWidth, i, 0),
        new BABYLON.Vector3(halfWidth, i, 0),
      ]);
    }
  }

  public drawOn = (scene: BABYLON.Scene) => {
    const grid = BABYLON.MeshBuilder.CreateLineSystem(
      "groundGrid",
      { lines: this.lines },
      scene,
    );
    grid.color = new BABYLON.Color3(0, 1, 1);
  };
}

export default GroundGrid;
