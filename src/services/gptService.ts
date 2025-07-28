// gptService.ts
import OpenAI from "openai";
import { readFile } from "fs/promises";
import path from "path";
import type { Manual } from "../types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let manualesData: Manual[] = [];

/**
 * Carga los manuales desde un archivo JSON
 * @param filePath ruta al archivo manuales.json
 */
async function loadManuales(filePath: string) {
  const raw = await readFile(filePath, "utf-8");
  manualesData = JSON.parse(raw) as Manual[];
  console.log(`Cargados ${manualesData.length} manuales.`);
}

/**
 * Busca manuales cuyo título o contenido contengan alguna palabra clave de la pregunta
 * @param pregunta texto con la consulta del usuario
 * @returns array de manuales relacionados
 */
function buscarManuales(pregunta: string): Manual[] {
  const keywords = pregunta.toLowerCase().split(/\s+/).filter(k => k.length > 2);
  return manualesData.filter(manual =>
    keywords.some(kw =>
      manual.titulo.toLowerCase().includes(kw) ||
      manual.contenido.toLowerCase().includes(kw)
    )
  );
}

/**
 * Consulta a OpenAI incluyendo manuales relacionados como contexto adicional
 * @param pregunta texto de la pregunta del usuario
 * @param messages historial previo de mensajes (chat)
 * @returns respuesta generada por GPT
 */
export async function askGPTWithManuales(
  pregunta: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const relacionados = buscarManuales(pregunta);

  const ayudaTexto = relacionados
    .map(m => `${m.titulo}\n${m.contenido}`)
    .join("\n\n");

      const promptMessages = [
        { role: "system", content: "Eres un asistente experto en manuales Itris." },
        ...messages,
      ];

      if (ayudaTexto.trim()) {
        promptMessages.push({
          role: "system",
          content: "Documentación relevante:\n" + ayudaTexto,
        });
      }

      promptMessages.push({
        role: "user",
        content: pregunta,
      });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: promptMessages as any,
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0].message?.content ?? "Sin respuesta";
  } catch (error) {
    console.error("Error al consultar GPT:", error);
    return "Lo siento, ocurrió un error al procesar tu consulta.";
  }
}

// Carga inicial de manuales (usar en server.ts o index.ts)
export async function carga() {
  const manualesPath = path.resolve(__dirname, "../storage/manuales.json");
  await loadManuales(manualesPath);
}
