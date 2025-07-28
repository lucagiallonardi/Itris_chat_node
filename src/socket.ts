import { Server, Socket } from "socket.io";
import path from "path";
import OpenAI from "openai";
import type { ChatMessage, ClientData } from "./types";
import { readJsonFile, writeJsonFile } from "./utils/file";
import { askGPTWithManuales } from "./services/gptService"; 

const CLIENTS_FILE = path.resolve(__dirname, "./storage/clients.json");

const clientsMap: Map<string, ClientData> = new Map();

async function loadClients() {
  const clients = await readJsonFile<ClientData[]>(CLIENTS_FILE);
  if (clients) clients.forEach(c => clientsMap.set(c.id, c));
}

async function saveClients() {
  await writeJsonFile(CLIENTS_FILE, Array.from(clientsMap.values()));
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function setupSocket(io: Server) {
  loadClients();

  io.on("connection", (socket: Socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    let currentClient = clientsMap.get(socket.id);
    if (!currentClient) {
      currentClient = { id: socket.id, messages: [], connected: true };
      clientsMap.set(socket.id, currentClient);
    } else {
      currentClient.connected = true;
    }

    saveClients();

    socket.on("message", async (msg: string) => {
    console.log(`Mensaje recibido de ${socket.id}: ${msg}`);

    if (!currentClient) return;

    currentClient.messages.push({ role: "user", content: msg });

    // Usamos la función con manuales, pasamos la pregunta y todo el historial
    const responseText = await askGPTWithManuales(msg, currentClient.messages);

    currentClient.messages.push({ role: "assistant", content: responseText });

    socket.emit("response", responseText);

    await saveClients();
  });

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
      if (currentClient) {
        currentClient.connected = false;
        saveClients();
      }
    });
  });
}
