import { defineStore } from "pinia";
import { markRaw, shallowRef } from "vue";
import type Engine from "@/engine/Engine.ts";

export const useBabylonStore = defineStore("babylon", () => {
  const Engine = shallowRef<Engine | null>(null);

  function setEngine(sm: Engine | null) {
    Engine.value = sm ? markRaw(sm) : null;
  }

  return {
    engine: Engine,
    setEngine,
  };
});
