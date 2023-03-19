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

  const resetCurrentConversation = () => {
    current_conversation.value = undefined;
  };

  return {
    openai_key,
    history,
    resetCurrentConversation,
    current_conversation,
    updateConversationName,
  };
});
