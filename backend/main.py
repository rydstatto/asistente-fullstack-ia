from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from google import genai

app = FastAPI(title="CoreIntellect API Backend")

# Habilitar CORS para permitir que tu frontend morado se conecte de forma segura
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
def ruta_raiz():
    return {"status": "Servidor con Gemini Activo"}

@app.post("/api/chat")
def chat_endpoint(datos: MensajeClase):
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return {"response": "Error: La clave GEMINI_API_KEY no está configurada en Vercel."}
            
        # Inicialización del cliente con el SDK síncrono ultra veloz
        client = genai.Client(api_key=api_key)
        
        # Consulta síncrona directa a Gemini 3.6-Flash
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=datos.message,
        )
        
        respuesta_real = response.text
        
        if not respuesta_real:
            respuesta_real = "El motor de IA no devolvió texto. Por favor, reintenta tu pregunta."

        # Registrar la interacción en memoria para el contador de consultas lateral
        registro = {
            "id": len(BD_INTERACCIONES_MEMORIA) + 1,
            "usuario": datos.message,
            "ia": respuesta_real
        }
        BD_INTERACCIONES_MEMORIA.append(registro)
        
        return {"response": respuesta_real}
        
    except Exception as e:
        return {"response": f"Error de comunicación con Gemini: {str(e)}"}

@app.get("/api/metrics")
def obtener_metricas():
    return {
        "total_consultas": len(BD_INTERACCIONES_MEMORIA),
        "historial": BD_INTERACCIONES_MEMORIA
    }
