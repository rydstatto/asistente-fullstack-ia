from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import requests

app = FastAPI()

# Definimos el formato de los datos que envía React
class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    user_message = request.message
    if not user_message:
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")

    try:
        # Pasarela de IA real ejecutada de forma segura desde el servidor
        IA_URL = "https://huggingface.co"
        
        # Leemos el token seguro guardado en las variables de entorno de Vercel
        token_ia = os.environ.get("VITE_HF_TOKEN") or os.environ.get("HF_TOKEN")
        
        headers = {
            "Authorization": f"Bearer {token_ia}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": f"Eres CoreIntellect AI, un asistente fullstack experto. Responde siempre con ejemplos de código estructurado y de forma clara en español a la siguiente consulta: {user_message}",
            "parameters": {"max_new_tokens": 700, "temperature": 0.7}
        }

        # Hacemos la llamada real a la IA
        response = requests.post(IA_URL, headers=headers, json=payload)
        data = response.json()

        # Extraemos el texto limpio devuelto por la IA
        if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
            respuesta_ia = data[0]["generated_text"]
        elif isinstance(data, dict) and "generated_text" in data:
            respuesta_ia = data["generated_text"]
        else:
            respuesta_ia = "El servidor de IA no devolvió un formato de texto válido."

        # Limpiamos el prompt inicial para dejar solo la respuesta útil
        prompt_decorador = f"Eres CoreIntellect AI, un asistente fullstack experto. Responde siempre con ejemplos de código estructurado y de forma clara en español a la siguiente consulta: {user_message}"
        respuesta_limpia = respuesta_ia.replace(prompt_decorador, "").strip()

        return {"response": respuesta_limpia}

    except Exception as e:
        print(f"Error interno: {str(e)}")
        return {"response": f"Error del backend al procesar la IA: {str(e)}"}
