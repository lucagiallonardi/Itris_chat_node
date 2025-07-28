# Itris_chat_node

Repositorio del backend en Node.js para el sistema de chat automático de Itris Software.  
Este proyecto sirve para gestionar consultas y brindar respuestas automáticas utilizando GPT, integrándose con la plataforma de chat de los clientes.

---

## Descripción

Este proyecto implementa un servidor Node.js que recibe consultas, las procesa y responde usando modelos de lenguaje (GPT). Está pensado para ser usado junto con el chatbot de atención al cliente de Itris, facilitando soporte técnico y respuestas rápidas sobre el software de gestión.

---

## Tecnologías utilizadas

- Node.js
- Express
- OpenAI API (GPT)
- Otros módulos: `node-fetch`, `cheerio`, etc. (según funcionalidades específicas)

---

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/lucagiallonardi/Itris_chat_node.git
   cd Itris_chat_node
Instalar dependencias:

bash
Copiar
Editar
npm install
Configurar variables de entorno en un archivo .env en la raíz:

ini
Copiar
Editar
OPENAI_API_KEY=tu_api_key_de_openai
PORT=3000
(Asegúrate de reemplazar tu_api_key_de_openai por tu clave real.)

Uso
Para iniciar el servidor:

bash
Copiar
Editar
npm start
El servidor escuchará en el puerto configurado (por defecto 3000).

Endpoints principales
/chat (POST):
Recibe una consulta en formato JSON, procesa la pregunta con GPT y devuelve la respuesta generada.

Ejemplo de cuerpo JSON para /chat:

json
Copiar
Editar
{
  "pregunta": "¿Cómo autorizo bonificaciones por artículo?"
}
Respuesta:

json
Copiar
Editar
{
  "respuesta": "Para autorizar bonificaciones mayores a la máxima indicada, debe pedir autorización al vendedor..."
}
Estructura del proyecto
index.js o server.js: Archivo principal que inicia el servidor y define rutas.

controllers/: Controladores para manejar la lógica del chat y la integración con OpenAI.

services/: Servicios auxiliares, como llamadas a la API de OpenAI o procesamiento de datos.

utils/: Utilidades para manejo de datos, limpieza, etc.

Personalización y mejoras
Puedes adaptar el prompt para GPT según las necesidades específicas de los manuales o preguntas frecuentes.

Se pueden agregar más endpoints para integración con otras fuentes de datos.

Integrar autenticación o logs para controlar el uso y mejorar la trazabilidad.

Contribuciones
Pull requests y sugerencias son bienvenidas. Para cambios importantes, por favor abre un issue primero para discutir lo que quieres modificar.