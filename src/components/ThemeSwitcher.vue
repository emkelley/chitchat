<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

let theme = ref("light");

const availableThemes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];
const setTheme = (theme: string) => {
  document.documentElement.setAttribute("data-theme", theme);
};
onMounted(() => {
  theme.value = document.documentElement.getAttribute("data-theme") || "light";
});
watch(theme, (newTheme) => {
  setTheme(newTheme);
});
</script>

<template>
  <select v-model="theme" class="select w-full max-w-xs bg-[#202426]">
    <option v-for="t in availableThemes" :value="t">{{ t }}</option>
  </select>
</template>

<style scoped></style>
