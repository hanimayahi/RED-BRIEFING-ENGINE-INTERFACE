import Entity from "@/entities/Entity.ts";
import { WithModel } from "@/entities/WithModel.ts";
import { WithRoute } from "@/entities/WithRoute.ts";
import vehicleModelUrl from "@/assets/vehicle.glb?url";

class Vehicle extends WithRoute(WithModel(Entity)) {
  static readonly MODEL_URL = vehicleModelUrl;
}

export default Vehicle;
