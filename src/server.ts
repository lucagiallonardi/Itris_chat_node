import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { setupSocket } from "./socket";
import path from "path";
import chatRouter from "./routes/chat";
import cors from "cors";




export function createServerApp() {
  const app = express();
  const httpServer = createServer(app);
  app.use("/docs", express.static(path.join(__dirname, "static")));
  app.use("/api/chat", chatRouter);
  app.use(cors()); 

  // Configuración de Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });


  // Ruta simple para testear
  app.get("/", (_req, res) => {
    res.send("Servidor Itris_Chat corriendo en Node.js + TypeScript 🚀");
  });

  // Configuramos la lógica de WebSocket
  setupSocket(io);

  return { app, httpServer };
}
