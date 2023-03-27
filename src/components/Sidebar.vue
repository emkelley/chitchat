<script setup lang="ts">
import { useAppStore } from "../stores/app.store";
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
      <button
        class="btn btn-sm w-full text-base-content"
        @click="state.saveCurrentChat()"
      >
        Save Chat Snapshot
      </button>
      <h2 class="text-lg font-bold">Chat Snapshots</h2>
      <section v-if="state.history" class="flex flex-col gap-4 w-full">
        <div
          v-for="chat in state.history"
          :key="chat.id"
          class="flex flex-col gap-4 text-xs border border-primary/50 hover:border-primary transition-all rounded-md bg-black/20 p-3"
        >
          <div class="flex gap-4 items-center">
            <div class="flex flex-col gap-2">
              <p class="text-lg">{{ chat.name }}</p>
              <div class="flex gap-2 items-center justify-between">
                <p class="font-bold rounded-sm">
                  Chat tokens:
                  {{ chat.usage!.total_tokens }}
                </p>
                <p
                  class="bg-emerald-400/30 p-1 text-white/70 font-bold rounded-full px-2.5"
                >
                  ~{{ estimateCost(chat.usage!) }}
                </p>
              </div>
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
      <div class="flex gap-4 items-center justify-center">
        <label for="my-modal" class="btn btn-primary">Settings</label>
        <a
          href="https://github.com/emkelley/chitchat"
          class="btn text-lg"
          target="_blank"
        >
          <i class="fa-brands fa-github" />
        </a>
        <a
          href="https://twitter.com/0NEGUYY"
          class="btn text-lg"
          target="_blank"
        >
          <i class="fa-brands fa-twitter" />
        </a>
      </div>
      <button @click="state.exportChats()" class="btn w-full">
        Export Chats
      </button>
    </div>
  </section>
  <SettingsModal />
</template>
