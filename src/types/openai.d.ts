export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: Usage;
  choices?: ChoicesEntity[] | null;
}
export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
export interface ChoicesEntity {
  message: Message;
  finish_reason: string;
  index: number;
}
export interface Message {
  role: string;
  content: string;
}
