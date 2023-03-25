<script setup lang="ts">
import { useAppStore } from "../stores/app.store";
import ThemeSwitcher from "./ThemeSwitcher.vue";
import { estimateCost } from "../utils/openai";
import SettingsModal from "./SettingsModal.vue";
let state = useAppStore();
</script>

<template>
  <section class="w-full h-full flex flex-col justify-between bg-[#171b1d]">
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
      <button
        class="btn w-full btn-primary bg-primary/30 text-base-content"
        @click="state.startNewChat()"
      >
        New Chat
      </button>
      <h2 class="text-lg font-bold">Chat History</h2>
      <section v-if="state.history" class="flex flex-col gap-4 w-full">
        <div
          v-for="chat in state.history"
          :key="chat.id"
          class="flex flex-col gap-4 text-xs border border-primary rounded-lg p-3"
        >
          <div class="flex gap-4 items-center">
            <div class="flex flex-col gap-2">
              <p class="text-sm">{{ chat.name }}</p>
              <p class="text-sm">{{ chat.usage!.total_tokens }} tokens</p>
              <p class="text-sm">{{ estimateCost(chat.usage!) }} est. cost</p>
            </div>
          </div>
          <div class="flex gap-4">
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
    <div class="p-4 flex flex-col gap-4">
      <label for="my-modal" class="btn w-full btn-primary">Settings</label>
      <button @click="state.exportChats()" class="btn w-full">
        Export Chats
      </button>
    </div>
  </section>
  <SettingsModal />
</template>
