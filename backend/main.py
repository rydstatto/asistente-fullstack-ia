from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
# Importación oficial del SDK moderno para evitar el crash 500
from google import genai

app = FastAPI(title="CoreIntellect API Backend")

# Habilitar CORS para permitir la entrada segura desde tu interfaz morada
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
            return {"response": "Error de configuración: La clave GEMINI_API_KEY no se encuentra en Vercel."}
            
        # El nuevo cliente síncrono oficial procesa tu clave AQ sin demoras
        client = genai.Client(api_key=api_key)
        
        # EL MODELO CORRECTO: Invocación directa usando gemini-3.6-flash
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=datos.message,
        )
        
        respuesta_real = response.text
        if not respuesta_real:
            respuesta_real = "La IA procesó tu solicitud pero no retornó texto. Intenta de nuevo."

        # Registrar la interacción para actualizar tu panel lateral
        registro = {
            "id": len(BD_INTERACCIONES_MEMORIA) + 1,
            "usuario": datos.message,
            "ia": respuesta_real
        }
        BD_INTERACCIONES_MEMORIA.append(registro)
        
        return {"response": respuesta_real}
        
    except Exception as e:
        return {"response": f"Fallo al invocar la API de Gemini: {str(e)}"}

@app.get("/api/metrics")
def obtener_metricas():
    return {
        "total_consultas": len(BD_INTERACCIONES_MEMORIA),
        "historial": BD_INTERACCIONES_MEMORIA
    }
