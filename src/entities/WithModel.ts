import type Entity from "@/entities/Entity.ts";
import type { Vec3 } from "@/entities/Vec3.ts";

type ModelConfiguredClass = {
  MODEL_URL?: string;
};

type GConstructor<T = object> = abstract new (pos: Vec3) => T;
const WITH_MODEL_MARKER = Symbol("WithModel");

export interface HasModel {
  readonly modelUrl: string;
}

const withModelFactory = function WithModel<TBase extends GConstructor<Entity>>(
  Base: TBase,
) {
  const EntityBase = Base as unknown as GConstructor<Entity>;

  abstract class ModelEntity extends EntityBase {
    readonly [WITH_MODEL_MARKER] = true;

    get modelUrl(): string {
      const ctor = this.constructor as ModelConfiguredClass;
      if (!ctor.MODEL_URL) {
        throw new Error(`${this} is missing static MODEL_URL`);
      }
      return ctor.MODEL_URL;
    }
  }

  return ModelEntity as unknown as abstract new (
    pos: Vec3,
  ) => InstanceType<TBase> & HasModel;
};

Object.defineProperty(withModelFactory, Symbol.hasInstance, {
  value(value: unknown): boolean {
    return (
      typeof value === "object" &&
      value !== null &&
      WITH_MODEL_MARKER in value
    );
  },
});

export const WithModel = withModelFactory as {
  <TBase extends GConstructor<Entity>>(
    Base: TBase,
  ): abstract new (pos: Vec3) => InstanceType<TBase> & HasModel;
  [Symbol.hasInstance](value: unknown): boolean;
};
