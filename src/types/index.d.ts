export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ClientData {
  id: string;
  messages: ChatMessage[];
  connected: boolean;
}

export interface ChatCompletionRequestMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface Manual {
  id: string;
  titulo: string;
  contenido: string;
  url?: string;
  embedding?: number[]; // nuevo
}