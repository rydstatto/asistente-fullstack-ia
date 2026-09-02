from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CoreIntellect API Backend")

# CONFIGURACIÓN DE CORS: Permite que tu frontend de Vercel se conecte de forma segura
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # El comodín "*" permite peticiones desde cualquier origen (ideal para portafolios)
    allow_credentials=True,
    allow_methods=["*"],  # Permite GET, POST, OPTIONS, etc.
    allow_headers=["*"],  # Permite todos los encabezados HTTP estándar
)

# Base de datos simulada en memoria RAM para evitar los bloqueos de lectura de SQLite en Vercel
BD_INTERACCIONES_MEMORIA = []

class MensajeClase(BaseModel):
    message: str

@app.get("/")
async def ruta_raiz():
    return {"status": "Servidor funcionando correctamente", "engine": "FastAPI en Vercel"}

@app.post("/api/chat")
async def chat_endpoint(datos: MensajeClase):
    try:
        # Aquí puedes integrar tu clave de IA o API real. Por ahora configuramos una respuesta de prueba sólida.
        respuesta_ia = f"¡Conexión Fullstack Exitosa! Tu backend en FastAPI recibió el mensaje: '{datos.message}' y lo procesó de forma segura en la nube de Vercel."
        
        # Guardar registro de la consulta en el arreglo global de memoria
        registro_log = {
            "id": len(BD_INTERACCIONES_MEMORIA) + 1,
            "usuario": datos.message,
            "ia": respuesta_ia
        }
        BD_INTERACCIONES_MEMORIA.append(registro_log)
        
        return {"response": respuesta_ia}
        
    except Exception as e:
        return {"response": f"Error interno en el procesamiento del servidor: {str(e)}"}

@app.get("/api/metrics")
async def obtener_metricas():
    # Devuelve en tiempo real cuántas consultas han pasado por la memoria RAM del servidor
    return {
        "total_consultas": len(BD_INTERACCIONES_MEMORIA),
        "historial": BD_INTERACCIONES_MEMORIA
    }
