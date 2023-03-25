<script setup lang="ts">
import { computed, ref } from "vue";
import { useAppStore } from "../stores/app.store";
import { estimateTokensCost } from "../utils/openai";
import GPT3Tokenizer from "gpt3-tokenizer";

let state = useAppStore();
const emits = defineEmits(["submit"]);
const tokenizer = new GPT3Tokenizer({ type: "gpt3" });

let rows = ref(1);
let prompt = ref("");

let tokenized_prompt = computed(() => {
  const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(
    prompt.value
  );
  return encoded.bpe.length;
});

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
          :rows="rows"
          placeholder="Type here"
          single-line
          dense
          hide-details
          auto-grow
          class="textarea textarea-bordered w-full max-h-24 bg-[#202426]"
          @keydown.enter.exact.prevent="submit()"
          @keydown.enter.shift.exact.prevent="
            prompt += '\n';
            rows++;
          "
        />
        <button class="btn btn-primary" @click="() => submit()">Submit</button>
      </div>
    </div>
    <label class="label mt-6">
      <span
        @click="() => state.resetCurrentChat()"
        class="label-text cursor-pointer underline"
      >
        Reset Conversation
      </span>
      <div class="flex gap-4 items-center">
        <span class="label-text">
          {{ tokenized_prompt }} Tokens - ~{{
            estimateTokensCost(tokenized_prompt)
          }}
        </span>
      </div>
    </label>
  </div>
</template>

<style scoped></style>
