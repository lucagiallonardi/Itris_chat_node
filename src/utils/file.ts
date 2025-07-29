import fs from "fs/promises";
import path from "path";

const CLIENTS_PATH = path.resolve(__dirname, "../storage/clients.json");

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatLog {
  id: string;
  messages: ChatMessage[];
  connected: boolean;
}

/**
 * Carga todos los logs actuales.
 */
export async function leerLogs(): Promise<ChatLog[]> {
  try {
    const data = await fs.readFile(CLIENTS_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Guarda todos los logs.
 */
async function guardarLogs(logs: ChatLog[]) {
  await fs.writeFile(CLIENTS_PATH, JSON.stringify(logs, null, 2), "utf-8");
}

/**
 * Agrega o actualiza el historial de un chatId
 */
export async function guardarConversacion(
  chatId: string,
  usuario: string,
  mensajes: { role: "user" | "assistant"; content: string }[]
) {
  const filePath = path.join(__dirname, "..", "conversaciones", `${chatId}.json`);
  const data = {
    chatId,
    usuario,
    mensajes,
    fecha: new Date().toISOString(),
  };

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
