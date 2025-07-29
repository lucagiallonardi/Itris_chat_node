import { Server, Socket } from "socket.io";
import { askGPTWithManuales } from "./services/gptService";
import fs from "fs/promises";
import path from "path";

const clientsFilePath = path.resolve(__dirname, "./storage/clients.json");

interface Client {
  id: string;
  messages: { role: string; content: string }[];
  connected: boolean;
}

let clients: Client[] = [];

async function loadClients() {
  try {
    const data = await fs.readFile(clientsFilePath, "utf-8");
    clients = JSON.parse(data);
  } catch {
    clients = [];
  }
}

async function saveClients() {
  await fs.writeFile(clientsFilePath, JSON.stringify(clients, null, 2));
}

export function setupSocket(io: Server) {
  io.on("connection", async (socket: Socket) => {
    console.log("Cliente conectado:", socket.id);

    // Cargar clientes (ideal hacerlo una vez al iniciar la app, no cada conexión)
    await loadClients();

    // Buscar cliente o crear uno nuevo
    let client = clients.find(c => c.id === socket.id);
    if (!client) {
      client = { id: socket.id, messages: [], connected: true };
      clients.push(client);
    } else {
      client.connected = true;
    }

    await saveClients();

    socket.on("mensaje_cliente", async (texto: string) => {
      console.log(`Mensaje de ${socket.id}:`, texto);

      // Agregar mensaje del usuario al historial del cliente
      client!.messages.push({ role: "user", content: texto });

      // Consultar a GPT
      const respuesta = await askGPTWithManuales(texto, client!.messages);
      console.log(`Respuesta generada para ${socket.id}:`, respuesta);

      // Agregar respuesta de GPT al historial
      client!.messages.push({ role: "assistant", content: respuesta });

      // Guardar historial actualizado
      await saveClients();

      // Enviar respuesta al cliente
      socket.emit("mensaje_servidor", respuesta);
    });

    socket.on("disconnect", async () => {
      console.log("Cliente desconectado:", socket.id);
      client!.connected = false;
      await saveClients();
    });
  });
}
