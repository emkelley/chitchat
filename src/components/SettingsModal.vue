<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAppStore } from "../stores/app.store";
import { onMounted, ref } from "vue";
import { initOpenAI } from "../utils/openai";

const appStore = useAppStore();
const { openai_key } = storeToRefs(appStore);

let api_key = ref<string>("");

const setOpenAiApiKey = async (key: string) => {
  if (key.startsWith("sk-")) {
    openai_key.value = key;
    await initOpenAI();
  } else {
    alert("Invalid OpenAI API Key");
  }
};

const resetApiKey = () => {
  openai_key.value = "";
  api_key.value = "";
};

onMounted(() => {
  if (openai_key.value) api_key.value = openai_key.value;
});
</script>

<template>
  <input type="checkbox" id="my-modal" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box bg-[#080a0a]">
      <h3 class="font-bold text-3xl mb-2">Settings</h3>
      <hr class="border-primary mb-4 mt-2" />
      <div class="flex flex-col gap-3">
        <h4 class="font-bold text-xl">Welcome to ChitChat!</h4>
        <p class="text-sm">
          ChitChat is a web based user-interface for OpenAI's GPT 3.5-turbo
          language model, similar to the official chat.openai.com interface.
        </p>
        <p class="text-sm">
          Please note, usage of the OpenAI API are billed per message to your
          OpenAI account. The app will display a current total of estimated
          costs for a chat conversation at the top of the screen. As of the
          creation of this app, the cost is
          <a
            href="https://openai.com/pricing"
            target="_blank"
            class="underline text-primary"
            >$0.002 / 1K tokens</a
          >.
        </p>
        <p class="text-sm">
          Your API key is stored in your browser's local storage, and is not
          stored on any servers. The source code for this app is available on
          <a
            href="https://github.com/emkelley/chitchat"
            target="_blank"
            class="underline text-primary"
            >GitHub</a
          >.
        </p>
      </div>

      <h3 class="font-bold text-lg mb-2 mt-8">OpenAI API Key</h3>
      <div class="flex gap-2">
        <input
          v-model="api_key"
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
        />
        <button
          class="btn btn-primary"
          @click="setOpenAiApiKey(api_key)"
          type="button"
        >
          Set
        </button>
        <button class="btn btn-warning" @click="resetApiKey()" type="button">
          Reset
        </button>
      </div>
      <p class="my-4 text-sm">
        You can find your OpenAI API Key in your OpenAI account's
        <a
          target="_blank"
          href="https://platform.openai.com/account/api-keys"
          class="underline text-primary"
          >settings page</a
        >.
      </p>
      <div class="modal-action">
        <label for="my-modal" class="btn">Save and Close</label>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
