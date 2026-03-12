import type { Vec3 } from "@/entities/Vec3.ts";
import type Entity from "@/entities/Entity.ts";
import type { HasModel } from "@/entities/WithModel.ts";

type GConstructor<T = object> = abstract new (pos: Vec3) => T;
const WITH_ROUTE_MARKER = Symbol("WithRoute");

export interface HasRoute {
  readonly route: Vec3[];
}

const withRouteFactory = function WithRoute<
  TBase extends GConstructor<Entity & HasModel>,
>(
  Base: TBase,
) {
  const ModelBase = Base as unknown as GConstructor<Entity & HasModel>;

  abstract class RouteEntity extends ModelBase {
    readonly [WITH_ROUTE_MARKER] = true;
    protected readonly _route: Vec3[] = [];

    get route(): Vec3[] {
      return this._route;
    }
  }

  return RouteEntity as unknown as abstract new (
    pos: Vec3,
  ) => InstanceType<TBase> & HasRoute;
};

Object.defineProperty(withRouteFactory, Symbol.hasInstance, {
  value(value: unknown): boolean {
    return (
      typeof value === "object" &&
      value !== null &&
      WITH_ROUTE_MARKER in value
    );
  },
});

export const WithRoute = withRouteFactory as {
  <TBase extends GConstructor<Entity & HasModel>>(
    Base: TBase,
  ): abstract new (pos: Vec3) => InstanceType<TBase> & HasRoute;
  [Symbol.hasInstance](value: unknown): boolean;
};
