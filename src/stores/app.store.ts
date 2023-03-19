import { nanoid } from "nanoid";
import { defineStore } from "pinia";
import { ChatCompletionRequestMessage } from "openai";
import { SYSTEM_PROMPT } from "../utils/openai";
import { Usage } from "../types/openai";

interface AppState {
  openai_key: string | null;
  current_chat: Chat | null;
  history: Chat[] | [];
}

export interface Chat {
  id: string;
  name: string;
  model: "gpt-3.5-turbo";
  usage?: Usage;
  messages: ChatCompletionRequestMessage[] | any[];
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    openai_key: null,
    current_chat: null,
    history: [],
  }),
  actions: {
    updateChatName(name: string) {
      if (this.current_chat) {
        this.current_chat.name = name;
      }
    },

    resetCurrentChat() {
      this.current_chat = null;
    },

    startNewChat() {
      this.saveCurrentChat();
      this.seedNewChat();
    },

    loadChat(id: string) {
      const chat = this.history.find((c) => c.id === id);
      if (chat) {
        this.current_chat = chat;
      }
    },

    deleteChat(id: string) {
      const index = this.history.findIndex((c) => c.id === id);
      if (index > -1) {
        this.history.splice(index, 1);
      }
    },

    seedNewChat() {
      this.current_chat = {
        id: nanoid(),
        name: nanoid(),
        model: "gpt-3.5-turbo",
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
        messages: [SYSTEM_PROMPT],
      };
    },

    saveCurrentChat() {
      if (!this.current_chat) return;
      const id = this.current_chat.id;
      const index = this.history.findIndex((c) => c.id === id);
      if (index === -1) {
        this.history = [...this.history, this.current_chat];
      }
    },
  },
  persist: true,
});
