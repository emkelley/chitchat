import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { Chat, useAppStore } from "../stores/app.store";
import { Usage } from "../types/openai";

let openai: OpenAIApi;
const model = "gpt-3.5-turbo";

export const SYSTEM_PROMPT: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a senior software engineer and full-stack web developer. Provide responses in github flavored markdown format using 4 new lines between paragraphs.",
};

export const initOpenAI = async () => {
  console.log("Initializing OpenAI...");

  let appstore = useAppStore();
  let { openai_key } = storeToRefs(appstore);
  let apiKey = openai_key.value;
  if (typeof apiKey === "undefined" || apiKey === null) {
    console.log("OpenAI API key not found.");
    return;
  }
  const config = new Configuration({ apiKey });
  openai = new OpenAIApi(config);
  console.log(`OpenAI successfully initialized with key: ${apiKey}.`);
};

export const sendPrompt = async (prompt: string) => {
  let appstore = useAppStore();
  let { current_chat, history } = storeToRefs(appstore);
  let conversation: Chat;
  if (!current_chat.value) {
    const id = nanoid();
    conversation = {
      id: id,
      name: undefined,
      model: model,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
      messages: [SYSTEM_PROMPT, createUserPrompt(prompt)],
    };
  } else {
    conversation = {
      ...current_chat.value,
      messages: [...current_chat.value.messages, createUserPrompt(prompt)],
    };
  }
  current_chat.value = conversation;

  try {
    const { data } = await openai.createChatCompletion({
      model,
      messages: conversation.messages,
    });

    // Generate a new chat name if it's the first message
    const chat_name = await generateChatName(prompt);
    if (current_chat.value.messages.length === 2) {
      current_chat.value.name = chat_name.choices[0].message?.content as string;
    }

    // Update the token usage
    current_chat.value.usage!.prompt_tokens += data.usage!.prompt_tokens;
    current_chat.value.usage!.completion_tokens +=
      data.usage!.completion_tokens;
    current_chat.value.usage!.total_tokens += data.usage!.total_tokens;

    // Update the chat messages
    current_chat.value.messages = [
      ...current_chat.value.messages,
      data.choices[0].message as ChatCompletionRequestMessage,
    ];

    return data;
  } catch (error: any) {
    console.log(error);

    return error.error.message;
  }
};

const generateChatName = async (prompt: string) => {
  const { data } = await openai.createChatCompletion({
    model,
    messages: [
      {
        role: "system",
        content:
          "The user will provide a prompt for a chat. Provide a title for the chat using 20 characters or less. Do not use punctuation. Do not add quotes.",
      },
      {
        role: "user",
        content: `Given the following prompt, provide a title: \`${prompt}\``,
      },
    ],
  });
  return data;
};

const createUserPrompt = (prompt: string): ChatCompletionRequestMessage => {
  return {
    role: "user",
    content: prompt,
  };
};

export const estimateCost = (usage: Usage) => {
  const { total_tokens } = usage;
  const cost = (total_tokens / 1000) * 0.002;
  return cost.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 5,
  });
};
export const estimateTokensCost = (tokens: number) => {
  const cost = (tokens / 1000) * 0.002;
  return cost.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 5,
  });
};
