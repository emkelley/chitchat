<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import { useAppStore } from "./stores/app.store";
import { sendPrompt } from "./utils/openai";
import { sendTestPrompt } from "./utils/openai";

let appstore = useAppStore();

let prompt = ref("");
let error = ref("");
let loading = ref(false);

const handleSubmit = async () => {
  const p = prompt.value;
  if (p.length < 5) return;
  loading.value = true;
  try {
    prompt.value = "";
    await sendPrompt(p);
    loading.value = false;
  } catch (error: any) {
    console.log(error);
    loading.value = false;
    error.value = error;
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
        <nav class="p-2 flex justify-between items-center">
          <p>navbar start</p>
          <p>navbar end</p>
        </nav>
        <div class="p-2 flex gap-4 items-center">
          <p>metadata 1</p>
          <p>metadata 2</p>
        </div>
      </section>
      <section v-if="appstore.current_conversation" class="h-full px-36">
        <article v-for="message in appstore.current_conversation!.messages">
          <div v-if="message.role === 'assistant'" class="chat chat-start">
            <div class="chat-header">ChatGPT - gpt-3.5-turbo</div>
            <div class="chat-bubble chat-bubble-success">
              {{ message.content }}
            </div>
          </div>
          <div v-if="message.role === 'user'" class="chat chat-end">
            <div class="chat-header">me</div>
            <div class="chat-bubble chat-bubble-info">
              {{ message.content }}
            </div>
          </div>
        </article>
        <div v-show="loading" class="chat chat-start">
          <div class="chat-header">ChatGPT - gpt-3.5-turbo</div>
          <div class="chat-bubble">thinking...</div>
        </div>
        <div v-show="error" class="chat chat-start">
          <div class="chat-header">ChatGPT - gpt-3.5-turbo</div>
          <div class="chat-bubble chat-bubble-error">{{ error }}.</div>
        </div>
      </section>
      <div ref="input-box" class="bg-base-200 p-8">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Enter query below</span>
            <span class="label-text-alt">000 tokens estimated</span>
          </label>
          <div class="flex gap-4">
            <input
              v-model="prompt"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
              @keydown.enter="handleSubmit"
            />
            <button class="btn btn-primary" @click="sendTestPrompt">
              Submit
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style></style>
