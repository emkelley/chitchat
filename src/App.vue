<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import { useAppStore } from "./stores/app.store";
import { sendPrompt } from "./utils/openai";
import { estimateCost } from "./utils/openai";
import Markdown from "vue3-markdown-it";

// TODO - display total conversation cost estimate
// TODO - display prompt token and cost estimate?
// TODO - display error message if prompt is too long
// TODO - format message response from openai

let appstore = useAppStore();

let prompt = ref("typescript function to calculate x digits of pi");
let error = ref("");
let loading = ref(false);

const handleSubmit = async () => {
  const p = prompt.value;
  if (p.length < 5) return;
  loading.value = true;
  prompt.value = "";
  let res = await sendPrompt(p);
  loading.value = false;
  if (typeof res === "string") {
    error.value = res;
    return;
  }
};
</script>

<template>
  <div class="flex h-screen">
    <aside class="w-96">
      <Sidebar />
    </aside>
    <main class="w-full flex flex-col justify-between bg-base-100">
      <section>
        <nav class="p-2 flex justify-between items-center bg-base-200">
          <p>navbar start</p>
          <p>navbar end</p>
        </nav>
        <div
          v-if="appstore.current_conversation"
          class="p-2 flex gap-4 items-center text-sm bg-base-300"
        >
          <p>
            Tokens this chat:
            {{ appstore.current_conversation.usage?.total_tokens }}
          </p>
          <p v-if="appstore.current_conversation.usage">
            ~{{
              estimateCost(appstore.current_conversation.usage).toLocaleString(
                "en-US",
                { style: "currency", currency: "USD", minimumFractionDigits: 5 }
              )
            }}
          </p>
        </div>
      </section>
      <section
        v-if="appstore.current_conversation"
        class="h-full px-36 py-12 overflow-y-scroll"
      >
        <article v-for="message in appstore.current_conversation!.messages">
          <div v-if="message.role === 'assistant'" class="chat chat-start">
            <div class="chat-header">ChatGPT - gpt-3.5-turbo</div>
            <div
              class="chat-bubble chat-bubble-success"
              style="white-space: pre-line"
            >
              <Markdown :source="message.content" class="rounded-md" />
              <!-- {{ message.content }} -->
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
      <div ref="input-box" class="bg-base-200 p-8">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Enter query below</span>
            <div class="flex gap-4 items-center">
              <span
                @click="appstore.current_conversation = undefined"
                class="label-text-alt cursor-pointer underline"
              >
                Reset Conversation
              </span>
              <span class="label-text-alt"> 000 tokens estimated </span>
            </div>
          </label>
          <div class="flex items-center gap-4">
            <textarea
              v-model="prompt"
              type="text"
              placeholder="Type here"
              class="textarea textarea-bordered w-full"
              @keydown.enter="handleSubmit"
            />
            <button class="btn btn-primary" @click="handleSubmit">
              Submit
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
pre {
  @apply rounded-lg overflow-hidden;
}
</style>
