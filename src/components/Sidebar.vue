<template>
  <section class="w-full h-full flex flex-col justify-between bg-base-300">
    <div
      class="flex flex-col justify-center items-center w-full h-20 bg-base-200 font-mono"
    >
      <h1 class="text-2xl text-blue-500">ChitChat</h1>
      <p class="text-xs">A ChatGPT UI</p>
    </div>
    <div class="p-4">
      <button class="btn btn-primary w-full" @click="sendTestPrompt">
        test submit
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { sendTestPrompt } from "../utils/openai";
</script>

<style scoped></style>
