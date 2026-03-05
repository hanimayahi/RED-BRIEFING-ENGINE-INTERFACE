import type { Ref } from "vue";
import { onBeforeUnmount, onMounted } from "vue";
import Scene from "@/engine/Scene";

export function useBabylonScene(canvas: Ref<HTMLCanvasElement | null>) {
  let scene: Scene | null = null;

  onMounted(() => {
    if (canvas.value === null) {
      return;
    }

    scene = new Scene(canvas.value);
    window.addEventListener("resize", () => scene?.handleResize());
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", () => scene?.handleResize());
    scene?.disposeEngine();
    scene = null;
  });
}
