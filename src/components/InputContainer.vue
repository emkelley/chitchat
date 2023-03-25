<script setup lang="ts">
import { ref } from "vue";
import { useAppStore } from "../stores/app.store";

let state = useAppStore();
const emits = defineEmits(["submit"]);

let prompt = ref("");

const submit = () => {
  emits("submit", prompt.value);
  prompt.value = "";
};
</script>
<template>
  <div ref="input-box" class="pb-24 w-[40vw]">
    <div class="form-control w-full">
      <div class="flex items-center gap-4">
        <textarea
          v-model="prompt"
          type="text"
          rows="1"
          placeholder="Type here"
          single-line
          dense
          hide-details
          auto-grow
          @keydown.enter.exact.prevent="submit()"
          @keydown.enter.shift.exact.prevent="prompt += '\n'"
          class="textarea textarea-bordered w-full max-h-24 bg-[#202426]"
        />
        <button class="btn btn-primary" @click="() => submit()">Submit</button>
      </div>
    </div>
    <label class="label mt-6">
      <span class="label-text">Enter query above</span>
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
  </div>
</template>

<style scoped></style>
