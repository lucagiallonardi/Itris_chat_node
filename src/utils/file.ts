import fs from "fs/promises";
import path from "path";

export async function guardarConversacion(
  chatId: string,
  usuario: string,
  mensajes: { role: "user" | "assistant"; content: string }[],
  error?: string
) {
  const filePath = path.join(__dirname, "..", "storage", "clients.json");

  // Leemos el archivo actual
  let data: any[] = [];
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    data = JSON.parse(raw);
  } catch {
    // Si no existe, empezamos con array vacío
    data = [];
  }

  // Buscamos si ya existe un chat con ese chatId
  const index = data.findIndex((entry) => entry.id === chatId);

  const nuevoRegistro = {
    id: chatId,
    usuario,
    messages: mensajes,
    connected: true,
    lastError: error || null,
    lastUpdate: new Date().toISOString(),
  };

  if (index >= 0) {
    data[index] = nuevoRegistro;
  } else {
    data.push(nuevoRegistro);
  }

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
