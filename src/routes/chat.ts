import express from "express";
import { askGPTWithManuales } from "../services/gptService";

const router = express.Router();

router.post("/", async (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ error: "Texto requerido" });

  const respuesta = await askGPTWithManuales(texto, []);
  return res.json({ respuesta });
});

export default router;
