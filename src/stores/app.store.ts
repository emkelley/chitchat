import { ChatCompletionRequestMessage } from "openai";
import { defineStore } from "pinia";
import { ref } from "vue";
import { Usage } from "../types/openai";

export interface Conversation {
  id: string;
  name: string;
  model: "gpt-3.5-turbo";
  usage?: Usage;
  messages: ChatCompletionRequestMessage[] | any[];
}

export const useAppStore = defineStore("app", () => {
  const openai_key = ref("sk-xxxxxxxxxxxxxxxxxxxxx");
  const current_conversation = ref<Conversation>();
  const history = ref([]);

  const updateConversationName = (name: string) => {
    if (current_conversation.value) {
      current_conversation.value.name = name;
    }
  };

  return { openai_key, history, current_conversation, updateConversationName };
});
