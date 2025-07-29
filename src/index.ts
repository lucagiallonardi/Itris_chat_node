import dotenv from "dotenv";
dotenv.config();
import { generateOpenApiYaml } from "./services/openApiGenerator";

import { createServerApp } from "./server";
import { carga } from "./services/gptService";

const PORT = process.env.PORT || 3000;

async function main() {
  //await generateOpenApiYaml();
  await carga(); 

  const { httpServer } = createServerApp();
  httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

main();
