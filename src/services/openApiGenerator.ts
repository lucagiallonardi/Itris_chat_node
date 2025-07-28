import yaml from "js-yaml";
import fs from "fs/promises";
import path from "path";

const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "GAIA API",
    version: "1.0.0",
  },
  paths: {
    "/consultar": {
      post: {
        summary: "Consulta a GAIA",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ConsultaRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Respuesta generada",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ConsultaResponse",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ConsultaRequest: {
        type: "object",
        properties: {
          pregunta: { type: "string" },
          empresa: {
            type: "string",
            description: "Nombre de la empresa o instancia del cliente",
          },
          usuario: {
            type: "string",
            description: "Correo electrónico o nombre del visitante",
          },
          chatId: {
            type: "string",
            description: "ID de sesión del chat, provisto por Tawk.to automáticamente",
          },
        },
        required: ["pregunta"],
      },
      ConsultaResponse: {
        type: "object",
        properties: {
          respuesta: { type: "string" },
          razonamiento: { type: "string" },
          fuentes: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
  },
};

export async function generateOpenApiYaml() {
  const yamlStr = yaml.dump(openapiSpec, { noRefs: true });
  const outputPath = path.resolve(__dirname, "../static/openapi.yaml");
  await fs.writeFile(outputPath, yamlStr, "utf-8");
  console.log("Archivo OpenAPI YAML generado en:", outputPath);
}
