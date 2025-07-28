import dotenv from "dotenv";
dotenv.config();

import { createServerApp } from "./server";
import { carga } from "./services/gptService";

const PORT = process.env.PORT || 3000;

async function main() {
  await carga(); // <-- Carga los manuales aquí

  const { httpServer } = createServerApp();
  httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

main();
