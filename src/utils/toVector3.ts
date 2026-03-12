import * as BABYLON from "babylonjs";
import type { Vec3 } from "@/entities/Vec3.ts";

export function toVector3([x, y, z]: Vec3): BABYLON.Vector3 {
  return new BABYLON.Vector3(x, y, z);
}
