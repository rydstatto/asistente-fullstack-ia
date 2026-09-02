from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from google import genai

app = FastAPI(title="CoreIntellect API Backend con Gemini Real")

# Mantener CORS activo para la comunicación con el frontend
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
    return {"status": "Servidor con Gemini Activo"}

@app.post("/api/chat")
async def chat_endpoint(datos: MensajeClase):
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        
        if not api_key:
            return {"response": "Error: La variable 'GEMINI_API_KEY' no está configurada en Vercel."}
            
        client = genai.Client(api_key=api_key)
        
        # Cambio clave: Usamos 'gemini-2.5-flash', el cual está mapeado en la arquitectura global 
        # y es el más compatible con autenticaciones de proyectos híbridos
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=datos.message,
        )
        
        respuesta_ia = response.text
        
        registro_log = {
            "id": len(BD_INTERACCIONES_MEMORIA) + 1,
            "usuario": datos.message,
            "ia": respuesta_ia
        }
        BD_INTERACCIONES_MEMORIA.append(registro_log)
        
        return {"response": respuesta_ia}
        
    except Exception as e:
        return {"response": f"Error de comunicación con la IA: {str(e)}"}

@app.get("/api/metrics")
async def obtener_metricas():
    return {
        "total_consultas": len(BD_INTERACCIONES_MEMORIA),
        "historial": BD_INTERACCIONES_MEMORIA
    }
