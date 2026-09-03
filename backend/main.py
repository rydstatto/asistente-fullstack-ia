from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from google import genai

app = FastAPI(title="CoreIntellect API Backend")

# Mantener CORS activo para la comunicación segura con el frontend
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
            return {"response": "Error interno: Falta la clave de API en el servidor."}
            
        # Conexión directa y rápida con el nuevo cliente oficial
        client = genai.Client(api_key=api_key)
        
        # Consulta síncrona directa para evitar que Vercel cierre la conexión antes de tiempo
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=datos.message,
        )
        
        # Extraemos el texto crudo devuelto por la Inteligencia Artificial
        respuesta_real_ia = response.text
        
        if not respuesta_real_ia:
            respuesta_real_ia = "La IA procesó la solicitud pero devolvió un resultado en blanco. Intenta replantear la pregunta."

        # Guardar en la lista global para el panel de métricas lateral
        registro_log = {
            "id": len(BD_INTERACCIONES_MEMORIA) + 1,
            "usuario": datos.message,
            "ia": respuesta_real_ia
        }
        BD_INTERACCIONES_MEMORIA.append(registro_log)
        
        return {"response": respuesta_real_ia}
        
    except Exception as e:
        # En caso de cualquier error real con Google, lo imprime en la pantalla para saber qué pasó
        return {"response": f"Error de conexión con los servidores de Gemini: {str(e)}"}

@app.get("/api/metrics")
def obtener_metricas():
    return {
        "total_consultas": len(BD_INTERACCIONES_MEMORIA),
        "historial": BD_INTERACCIONES_MEMORIA
    }
