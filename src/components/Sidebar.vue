<script setup lang="ts">
import { useAppStore } from "../stores/app.store";
import ThemeSwitcher from "./ThemeSwitcher.vue";
let state = useAppStore();
</script>

<template>
  <section class="w-full h-full flex flex-col justify-between bg-base-300">
    <div
      class="flex flex-col justify-center items-center w-full h-28 font-mono"
    >
      <h1 class="text-3xl text-primary">ChitChat</h1>
      <p class="text-xs">
        A ChatGPT UI by
        <a href="https://github.com/emkelley" target="_blank">@emkelley</a>
      </p>
    </div>
    <div class="flex flex-col items-start justify-start h-full p-4 gap-4">
      <button class="btn w-full btn-primary" @click="state.startNewChat()">
        New Chat
      </button>
      <h2 class="text-lg font-bold">Chat History</h2>
      <section v-if="state.history" class="flex flex-col gap-4">
        <div
          v-for="chat in state.history"
          :key="chat.id"
          class="flex flex-col gap-4 text-xs border border-primary rounded-lg p-2"
        >
          <div class="flex gap-4 items-center">
            <div class="flex flex-col gap-2">
              <p class="text-sm">Chat ID: {{ chat.id }}</p>
              <p class="text-sm">Tokens Used: {{ chat.usage!.total_tokens }}</p>
            </div>
            <button
              class="btn btn-primary btn-xs"
              @click="state.loadChat(chat.id)"
            >
              Load
            </button>
            <button
              class="btn btn-primary btn-xs"
              @click="state.deleteChat(chat.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </section>
    </div>
    <div class="p-4 flex flex-col gap-4 text-center">
      <div class="text-sm">choose a theme:</div>
      <ThemeSwitcher />
      <button class="btn w-full">Export Chats</button>
    </div>
  </section>
</template>
