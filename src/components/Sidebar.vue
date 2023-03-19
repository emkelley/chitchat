<script setup lang="ts">
import ThemeSwitcher from "./ThemeSwitcher.vue";
</script>

<template>
  <section class="w-full h-full flex flex-col justify-between bg-base-300">
    <div
      class="flex flex-col justify-center items-center w-full h-20 font-mono"
    >
      <h1 class="text-2xl text-blue-500">ChitChat</h1>
      <p class="text-xs">
        A ChatGPT UI by
        <a href="https://github.com/emkelley" target="_blank">@emkelley</a>
      </p>
    </div>
    <div class="p-4 flex flex-col gap-4">
      Theme:
      <ThemeSwitcher />
      <button class="btn w-full">Export Chats</button>
    </div>
  </section>
</template>
