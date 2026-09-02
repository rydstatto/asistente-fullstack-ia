from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys

# Inicialización estándar requerida por Vercel
app = FastAPI(title="CoreIntellect API Backend")

# Habilitar CORS para permitir peticiones del frontend
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
    return {"status": "Servidor activo", "engine": "FastAPI en Vercel"}

@app.post("/api/chat")
async def chat_endpoint(datos: MensajeClase):
    try:
        # Texto de respuesta de prueba para validar el enlace completo
        respuesta_ia = f"¡Servidor en línea con éxito! Procesado mensaje: '{datos.message}'"
        
        registro_log = {
            "id": len(BD_INTERACCIONES_MEMORIA) + 1,
            "usuario": datos.message,
            "ia": respuesta_ia
        }
        BD_INTERACCIONES_MEMORIA.append(registro_log)
        
        return {"response": respuesta_ia}
        
    except Exception as e:
        # Esto enviará el error directamente a la pantalla del frontend para que sepamos exactamente qué falló
        return {"response": f"Error interno en código Python: {str(e)}"}

@app.get("/api/metrics")
async def obtener_metricas():
    return {
        "total_consultas": len(BD_INTERACCIONES_MEMORIA),
        "historial": BD_INTERACCIONES_MEMORIA
    }
