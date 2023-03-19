<script setup lang="ts">
import { ref } from "vue";
import { useAppStore } from "../stores/app.store";

let state = useAppStore();
const emits = defineEmits(["submit"]);

let prompt = ref("");
</script>
<template>
  <div ref="input-box" class="bg-base-200 p-8 border-t border-primary">
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Enter query below</span>
        <div class="flex gap-4 items-center">
          <span
            @click="() => state.resetCurrentChat()"
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
          rows="1"
          placeholder="Type here"
          class="textarea textarea-bordered w-full max-h-24"
          @keydown.enter="() => emits('submit', prompt)"
        />
        <button class="btn btn-primary" @click="() => emits('submit', prompt)">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
