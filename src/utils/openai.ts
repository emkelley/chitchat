import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { Conversation, useAppStore } from "../stores/app.store";
import { nanoid } from "nanoid";
import { OpenAIResponse, Usage } from "../types/openai";
import { storeToRefs } from "pinia";

const config = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const SYSTEM_PROMPT: ChatCompletionRequestMessage = {
  role: "system",
  content: "You are a senior software engineer and full-stack web developer.",
};

export const sendPrompt = async (prompt: string) => {
  let appstore = useAppStore();
  let { current_conversation, history } = storeToRefs(appstore);
  const model = "gpt-3.5-turbo";
  let conversation: Conversation;
  if (!current_conversation.value) {
    conversation = {
      id: nanoid(),
      name: nanoid(),
      model: "gpt-3.5-turbo",
      messages: [SYSTEM_PROMPT, createUserPrompt(prompt)],
    };
  } else {
    conversation = {
      ...current_conversation.value,
      messages: [
        ...current_conversation.value.messages,
        createUserPrompt(prompt),
      ],
    };
  }
  current_conversation.value = conversation;
  try {
    const { data } = await openai.createChatCompletion({
      model,
      messages: conversation.messages,
    });
    // update the current_conversation with the completion - message and usage
    current_conversation.value.usage = data.usage;
    current_conversation.value.messages = [
      ...current_conversation.value.messages,
      data.choices[0].message as ChatCompletionRequestMessage,
    ];
    return data;
  } catch (error: any) {
    return error.error.message;
  }
};

const createUserPrompt = (prompt: string): ChatCompletionRequestMessage => {
  return {
    role: "user",
    content: prompt,
  };
};
export const sendTestPrompt = async (): Promise<OpenAIResponse> => {
  const model = "gpt-3.5-turbo";
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content:
        "You are a senior software engineer and full-stack web developer.",
    },
    {
      role: "user",
      content: "You are looking for a new job.",
    },
  ];

  const { data } = await openai.createChatCompletion({
    model,
    messages,
  });
  console.log(data);
  return data as OpenAIResponse;
};
export const estimateCost = (usage: Usage) => {
  const { total_tokens } = usage;
  const cost = (total_tokens / 1000) * 0.002;
  return cost;
};