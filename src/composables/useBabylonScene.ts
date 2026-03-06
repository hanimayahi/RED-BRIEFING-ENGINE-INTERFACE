import type { Ref } from "vue";
import { onBeforeUnmount, onMounted } from "vue";
import Engine from "@/engine/Engine.ts";
import GroundGrid from "@/engine/GroundGrid";
import { useBabylonStore } from "@/stores/babylonStore";

export function useBabylonScene(canvas: Ref<HTMLCanvasElement | null>) {
  const babylonStore = useBabylonStore();
  let engine: Engine | null = null;
  let resizeHandler: (() => void) | null = null;

  onMounted(() => {
    if (!canvas.value) {
      return;
    }

    engine = new Engine(canvas.value);
    babylonStore.setEngine(engine);
    const groundGrid = new GroundGrid(20, 30);
    groundGrid.drawOn(engine.scene); // Put inside engine?
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
