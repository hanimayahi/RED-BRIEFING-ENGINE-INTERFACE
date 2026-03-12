import type { Vec3 } from "@/entities/Vec3.ts";

abstract class Entity {
  pos: Vec3;

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(pos: Vec3) {
    this.pos = pos;
  }
}

export default Entity;
