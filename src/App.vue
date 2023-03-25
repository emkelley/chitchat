<script setup lang="ts">
import { onMounted, ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import { useAppStore } from "./stores/app.store";
import { initOpenAI, sendPrompt, estimateCost } from "./utils/openai";
import Markdown from "vue3-markdown-it";
import InputContainer from "./components/InputContainer.vue";

// TODO - display prompt token and cost estimate?
// TODO - display error message if prompt is too long

let state = useAppStore();
let error = ref("");
let loading = ref(false);

const handleSubmit = async (prompt: string) => {
  if (prompt.length < 5) return;
  loading.value = true;
  let res = await sendPrompt(prompt);
  loading.value = false;
  if (typeof res === "string") {
    error.value = res;
    return;
  }
};

onMounted(() => {
  initOpenAI();
  if (!state.current_chat) state.seedNewChat();
});
</script>

<template>
  <div class="flex h-screen">
    <aside class="w-96 border-r-2 border-[#202228]">
      <Sidebar />
    </aside>
    <main class="w-full flex flex-col justify-between bg-[#0a0e0f]">
      <section>
        <section
          v-if="!state.openai_key"
          class="bg-red-900 text-white font-black flex justify-center p-4"
        >
          <p>No API key found. Save a new one before beginning.</p>
        </section>
        <div
          v-if="state.current_chat && state.current_chat.usage"
          class="p-2 flex gap-4 items-center text-sm shadow-sm"
        >
          <p>
            Tokens this chat:
            {{ state.current_chat.usage.total_tokens }}
          </p>
          <p>~{{ estimateCost(state.current_chat.usage) }}</p>
        </div>
      </section>
      <section
        v-if="state.current_chat"
        class="h-full px-36 py-12 overflow-y-scroll flex flex-col gap-3"
      >
        <article v-for="message in state.current_chat!.messages">
          <div v-if="message.role === 'assistant'" class="chat chat-start">
            <div class="chat-header">ChatGPT - gpt-3.5-turbo</div>
            <div class="chat-bubble chat-bubble-success">
              <Markdown :source="message.content" class="rounded-md" />
            </div>
          </div>
          <div v-if="message.role === 'user'" class="chat chat-end">
            <div class="chat-header">me</div>
            <div class="chat-bubble chat-bubble-primary">
              {{ message.content }}
            </div>
          </div>
        </article>
        <div v-show="error" class="chat chat-start">
          <div class="chat-header">ChatGPT - gpt-3.5-turbo</div>
          <div class="chat-bubble chat-bubble-error">
            API Error: {{ error }}.
          </div>
        </div>
        <div v-show="loading" class="chat chat-start">
          <div class="chat-header">ChatGPT - gpt-3.5-turbo</div>
          <div class="chat-bubble">thinking...</div>
        </div>
      </section>
      <div class="flex items-center justify-center w-full">
        <InputContainer @submit="handleSubmit" />
      </div>
    </main>
  </div>
</template>

<style>
pre {
  @apply rounded-lg overflow-hidden;
}
</style>
