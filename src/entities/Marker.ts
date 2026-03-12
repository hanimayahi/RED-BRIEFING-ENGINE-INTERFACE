import Entity from "@/entities/Entity.ts";
import { WithModel } from "@/entities/WithModel.ts";
import markerModelUrl from "@/assets/marker.glb?url";

class Marker extends WithModel(Entity) {
  static readonly MODEL_URL = markerModelUrl;
}

export default Marker;
