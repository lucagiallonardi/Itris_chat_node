import dotenv from "dotenv";
dotenv.config();

import { createServerApp } from "./server";

const PORT = process.env.PORT || 3000;

const { httpServer } = createServerApp();

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
