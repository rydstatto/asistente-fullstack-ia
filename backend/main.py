from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
# Importamos la librería oficial de Google para usar Gemini
from google import genai

app = FastAPI(title="CoreIntellect API Backend con IA Real")

# Mantener CORS activo para que el frontend no se bloquee
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BD_INTERACCIONES_MEMORIA = []

class MensajeClase(BaseModel):
    message: str

@app.get("/")
async def ruta_raiz():
    return {"status": "Servidor con IA Activo"}

@app.post("/api/chat")
async def chat_endpoint(datos: MensajeClase):
    try:
        # Inicializa el cliente de Gemini leyendo la variable de entorno
        # Vercel buscará automáticamente 'GEMINI_API_KEY'
        client = genai.Client()
        
        # Le pedimos a Gemini 2.5 Flash que procese el mensaje del usuario
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=datos.message,
        )
        
        respuesta_ia = response.text
        
        # Guardamos en la memoria del panel lateral
        registro_log = {
            "id": len(BD_INTERACCIONES_MEMORIA) + 1,
            "usuario": datos.message,
            "ia": respuesta_ia
        }
        BD_INTERACCIONES_MEMORIA.append(registro_log)
        
        return {"response": respuesta_ia}
        
    except Exception as e:
        return {"response": f"Error al consultar la IA: Asegúrate de configurar tu token de API. Detalle: {str(e)}"}

@app.get("/api/metrics")
async def obtener_metricas():
    return {
        "total_consultas": len(BD_INTERACCIONES_MEMORIA),
        "historial": BD_INTERACCIONES_MEMORIA
    }
