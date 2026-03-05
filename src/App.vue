<script setup lang="ts">
import { ref } from "vue";
import { useBabylonScene } from "@/composables/useBabylonScene";

const renderCanvas = ref<HTMLCanvasElement | null>(null);
useBabylonScene(renderCanvas);
</script>

<template>
  <main class="app-root">
    <canvas ref="renderCanvas" class="render-canvas"></canvas>
  </main>
</template>
