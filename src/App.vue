<script setup lang="ts">
import { onMounted, ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import { useAppStore } from "./stores/app.store";
import { initOpenAI, sendPrompt, estimateCost } from "./utils/openai";
import { marked } from "marked";
import InputContainer from "./components/InputContainer.vue";
import hljs from "highlight.js";
import { useToast } from "vue-toastification";

// TODO - display prompt token and cost estimate?
// TODO - display error message if prompt is too long

const toast = useToast();
let state = useAppStore();
let error = ref("");
let loading = ref(false);
let chat = ref<HTMLElement>();

const handleSubmit = async (prompt: string) => {
  if (prompt.length < 5) return;
  loading.value = true;
  let res = await sendPrompt(prompt);
  loading.value = false;
  if (chat.value) {
    chat.value.scrollIntoView({ behavior: "smooth", block: "end" });
  }
  if (typeof res === "string") {
    error.value = res;
    return;
  }
};

const addCopyButtons = () => {
  setTimeout(() => {
    const codeBlocks = document.querySelectorAll("pre code");
    codeBlocks.forEach((block: any) => {
      const button = document.createElement("button");
      button.classList.add(
        "absolute",
        "top-14",
        "right-6",
        "bg-primary/70",
        "text-slate-900",
        "font-bold",
        "rounded-md",
        "hover:bg-primary",
        "px-2",
        "py-1",
        "m-2"
      );
      button.innerText = "Copy";
      button.addEventListener("click", () => {
        navigator.clipboard.writeText(block.innerText);
        toast.success("Copied to clipboard!");
      });
      block.appendChild(button);
    });
  }, 1000);
};

const parseMd = (markdown: string) => {
  const md = marked.setOptions({
    gfm: true,
    breaks: true,
    xhtml: true,
    highlight: function (code, lang) {
      return hljs.highlight(lang, code).value;
    },
  });
  addCopyButtons();
  return md(markdown);
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
          class="p-4 flex gap-4 items-center justify-between shadow-sm border-b border-primary"
        >
          <p>
            {{ state.current_chat.name || "Untitled Chat" }}
          </p>
          <div class="flex gap-2 items-center">
            <p class="mr-4">This Chat:</p>
            <p
              class="bg-primary p-2 text-slate-900 font-bold rounded-full px-4"
            >
              Chat tokens:
              {{ state.current_chat.usage.total_tokens }}
            </p>
            <p
              class="bg-emerald-400 p-2 text-slate-900 font-bold rounded-full px-4"
            >
              ~{{ estimateCost(state.current_chat.usage) }}
            </p>
          </div>
        </div>
      </section>
      <section
        ref="chat"
        v-if="state.current_chat"
        class="h-full px-36 pt-12 pb-36 overflow-y-scroll flex flex-col gap-3 relative"
      >
        <article v-for="message in state.current_chat!.messages">
          <div v-if="message.role === 'assistant'" class="chat chat-start">
            <div class="chat-header">gpt-3.5-turbo</div>
            <div class="chat-bubble" v-html="parseMd(message.content)"></div>
          </div>
          <div v-if="message.role === 'user'" class="chat chat-end">
            <div class="chat-header">me</div>
            <div class="chat-bubble chat-bubble-primary">
              {{ message.content }}
            </div>
          </div>
        </article>
        <div v-show="error" class="chat chat-start">
          <div class="chat-header">gpt-3.5-turbo</div>
          <div class="chat-bubble chat-bubble-error">
            API Error: {{ error }}.
          </div>
        </div>
        <div v-show="loading" class="chat chat-start">
          <div class="chat-header">gpt-3.5-turbo</div>
          <div class="chat-bubble">thinking...</div>
        </div>
      </section>
      <div class="flex flex-col items-center justify-center w-full relative">
        <section
          class="bg-gradient-to-b from-transparent via-[#0a0e0f] to-[#0a0e0f] h-24 w-full absolute -top-24"
        />
        <InputContainer @submit="handleSubmit" />
      </div>
    </main>
  </div>
</template>

<style lang="scss">
.chat-bubble {
  p {
    @apply mb-4;
  }
  pre {
    @apply rounded-lg overflow-hidden bg-[#0a0e0f] p-4 mb-4;
  }
}
.chat-header {
  @apply mb-2 pl-4;
}
</style>
