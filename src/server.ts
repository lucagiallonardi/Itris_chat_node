import express from "express";
import cors from "cors";
import path from "path";
// Importa la función para el chat REST
import chatRouter from "./routes/chat"; // (o define directamente aquí la ruta)

export function createServerApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/docs", express.static(path.join(__dirname, "static")));

  // API REST para chat
  app.use("/api/chat", chatRouter);

  app.get("/", (_req, res) => {
    res.send("Servidor Itris_Chat corriendo en Node.js + TypeScript 🚀");
  });

  return { app, httpServer: null }; // Ya no usás createServer ni httpServer
}
