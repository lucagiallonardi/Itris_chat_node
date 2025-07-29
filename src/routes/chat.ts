import { Router } from "express";
import { askGPTWithManuales } from "../services/gptService";
import { guardarConversacion } from "../utils/file";

const router = Router();

const historiales: Record<
  string,
  { role: "user" | "assistant"; content: string }[]
> = {};

router.post("/", async (req, res) => {
  const { texto, usuario, chatId } = req.body;

  if (!texto || typeof texto !== "string") {
    return res.status(400).json({ error: "Campo 'texto' es requerido y debe ser string" });
  }
  if (!chatId || typeof chatId !== "string") {
    return res.status(400).json({ error: "Campo 'chatId' es requerido y debe ser string" });
  }

  if (!historiales[chatId]) {
    historiales[chatId] = [];
  }

  historiales[chatId].push({ role: "user", content: texto });

  try {
    const respuesta = await askGPTWithManuales(texto, historiales[chatId]);
    historiales[chatId].push({ role: "assistant", content: respuesta });

    await guardarConversacion(chatId, usuario, historiales[chatId]);

    res.json({ chatId, usuario, respuesta, historial: historiales[chatId] });
  } catch (error) {
    console.error("Error procesando chat:", error);

    // Guardar error en archivo
    await guardarConversacion(chatId, usuario, historiales[chatId], String(error));

    res.status(500).json({ error: "Error interno al procesar la consulta" });
  }
});



export default router;
