import type { Ref } from "vue";
import { onBeforeUnmount, onMounted } from "vue";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { CameraMode } from "@/engine/CameraMode";
import Engine from "@/engine/Engine.ts";
import GroundGrid from "@/engine/GroundGrid";
import { useBabylonStore } from "@/stores/babylonStore";
import type Entity from "@/entities/Entity.ts";
import Vehicle from "@/entities/Vehicle.ts";
import Marker from "@/entities/Marker.ts";

function styleEntityMeshes(
  scene: BABYLON.Scene,
  meshes: BABYLON.AbstractMesh[],
) {
  const invisibleMaterial = new BABYLON.StandardMaterial(
    "entityInvisibleMaterial",
    scene,
  );
  invisibleMaterial.alpha = 0;
  meshes.forEach((mesh) => {
    mesh.material = invisibleMaterial;
    mesh.enableEdgesRendering(0.85);
    mesh.edgesWidth = 1;
    mesh.edgesColor = new BABYLON.Color4(0.99, 0.93, 0.04, 1);
  });
}

export function useBabylonScene(canvas: Ref<HTMLCanvasElement | null>) {
  const babylonStore = useBabylonStore();
  let engine: Engine | null = null;
  let resizeHandler: (() => void) | null = null;

  onMounted(() => {
    if (!canvas.value) {
      return;
    }

    // TODO: Make a world loader from a json config file
    engine = new Engine(canvas.value);
    babylonStore.setEngine(engine);
    // engine.setFixedView([0, -24, 12], [0, 0, 0]);
    engine.setCameraMode(CameraMode.Orbit);
    const groundGrid = new GroundGrid(201, 300);
    groundGrid.drawOn(engine.scene);
    const entities: Entity[] = [new Vehicle([0, 0, 0]), new Marker([4, 2, 0])];
    engine
      .loadEntities(entities)
      .then((meshes) => {
        if (!engine) {
          return;
        }
        styleEntityMeshes(engine.scene, meshes);
      })
      .catch((error: unknown) => {
        queueMicrotask(() => {
          throw error;
        });
      });
    resizeHandler = () => engine?.handleResize();
    window.addEventListener("resize", resizeHandler);
  });

  onBeforeUnmount(() => {
    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
      resizeHandler = null;
    }

    engine?.disposeEngine();
    engine = null;
    babylonStore.setEngine(null);
  });
}
