from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import requests

app = FastAPI()

# Formato de datos unificado para React
class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    user_message = request.message
    if not user_message:
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")

    try:
        # Usamos la API Key de los Secrets de Vercel o la de respaldo regional
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("VITE_HF_TOKEN")
        
        # Dirección oficial de la API de Google Gemini (Flash 2.5) para peticiones directas HTTP sin bloqueos de IP
        GEMINI_URL = f"https://googleapis.com{api_key}"
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"Eres CoreIntellect AI, un asistente fullstack experto. Responde siempre con ejemplos de código estructurado y de forma clara en español a la siguiente consulta: {user_message}"
                }]
            }]
        }

        # Ejecutamos la llamada segura desde el servidor
        response = requests.post(GEMINI_URL, json=payload, headers={"Content-Type": "application/json"})
        data = response.json()

        # Extraemos de forma robusta la respuesta de texto generada por Gemini
        if "candidates" in data and len(data["candidates"]) > 0:
            respuesta_ia = data["candidates"][0]["content"]["parts"][0]["text"]
        elif "error" in data:
            respuesta_ia = f"Error del servidor de Google: {data['error']['message']}"
        else:
            respuesta_ia = "No se pudo extraer la respuesta del modelo de lenguaje."

        return {"response": respuesta_ia}

    except Exception as e:
        return {"response": f"Error del backend al procesar la IA: {str(e)}"}
