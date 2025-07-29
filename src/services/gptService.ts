import OpenAI from "openai";
import { readFile } from "fs/promises";
import path from "path";
import type { Manual } from "../types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let manualesData: Manual[] = [];
let manualesEmbeddings: number[][] = []; // matriz de embeddings precomputados
const MAX_DOCS = 3; // cantidad máxima de manuales a usar para contexto

async function loadManuales(filePath: string) {
  const raw = await readFile(filePath, "utf-8");
  manualesData = JSON.parse(raw) as Manual[];
  console.log(`Cargados ${manualesData.length} manuales.`);
}

async function computeEmbeddings() {
  if (!manualesData.length) {
    console.warn("No hay manuales cargados para calcular embeddings");
    return;
  }
  // Sacamos los textos a embedding
  const textos = manualesData.map(m => m.contenido);

  // Pedimos los embeddings a OpenAI (en batch)
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: textos,
  });

  // Guardamos los embeddings en la variable global
  manualesEmbeddings = response.data.map(e => e.embedding);
  console.log(`Embeddings calculados para ${manualesEmbeddings.length} manuales.`);
}

// Función para producto punto entre vectores
function dotProduct(a: number[], b: number[]) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

/**
 * Recupera manuales más relevantes usando embeddings y similitud coseno (aproximada por dot product)
 * @param pregunta texto de la consulta
 * @param maxDocs máximo documentos a devolver
 */
export async function recuperarManualesPorEmbedding(pregunta: string, maxDocs = MAX_DOCS): Promise<Manual[]> {
  if (!manualesEmbeddings.length) {
    console.warn("Embeddings no calculados aún, calculando ahora...");
    await computeEmbeddings();
  }

  // Obtener embedding de la pregunta
  const embeddingPreguntaResponse = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: pregunta,
  });
  const embeddingPregunta = embeddingPreguntaResponse.data[0].embedding;

  // Calcular similitud con cada manual
  const similitudes = manualesEmbeddings.map((embedding, i) => ({
    index: i,
    score: dotProduct(embedding, embeddingPregunta),
  }));

  // Ordenar descendente por score
  similitudes.sort((a, b) => b.score - a.score);

  // Obtener top manuales
  const topManuales = similitudes.slice(0, maxDocs).map(s => manualesData[s.index]);

  return topManuales;
}

// Cambiar esta función para usar embeddings y mejorar la búsqueda contextual
export async function askGPTWithManuales(
  pregunta: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const relacionados = await recuperarManualesPorEmbedding(pregunta);

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
      model: "gpt-3.5-turbo",
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

// Carga inicial de manuales + embeddings
export async function carga() {
  const manualesPath = path.resolve(__dirname, "../storage/manuales.json");
  await loadManuales(manualesPath);
  await computeEmbeddings();
}
