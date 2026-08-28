import sqlite3
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CONFIGURACIÓN DE LA BASE DE DATOS REAL (SQLite)
def inicializar_db():
    conn = sqlite3.connect("interacciones.db")
    cursor = conn.cursor()
    # Creamos la tabla de datos si no existe en la computadora
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT,
            ia TEXT
        )
    """)
    conn.commit()
    conn.close()

# Llamamos a la base de datos al encender el servidor
inicializar_db()

CONOCIMIENTO_IA = {
    "horario": "El horario de atención telefónica de ElectroTech es de lunes a viernes, de 9:00 AM a 6:00 PM, a través del teléfono 555-1234.",
    "telefono": "Puedes comunicarte con nuestro equipo de soporte técnico llamando al número telefónico 555-1234.",
    "devolucion": "Nuestra política permite devoluciones y cambios dentro de los primeros 30 días posteriores a tu compra, siempre que presentes tu recibo original.",
    "garantia": "Todos los productos adquiridos en ElectroTech cuentan con una garantía limitada de 1 año que cubre cualquier tipo de falla de fábrica.",
    "roto": "Si tu producto vino roto o defectuoso de fábrica, la garantía de 1 año cubre el cambio total sin costo. Comunícate al 555-1234 para gestionar el reemplazo inmediato.",
    "defectuoso": "Para productos defectuosos de fábrica, aplicamos la garantía de 1 año. Te enviaremos un producto nuevo sin costo adicional.",
    "hola": "¡Hola! Soy CoreIntellect, el asistente inteligente de ElectroTech. ¿En qué puedo ayudarte hoy?",
    "nombre": "Mi nombre es CoreIntellect, un asistente virtual diseñado para resolver tus dudas de soporte técnico.",
    "gracias": "¡De nada! Es un placer ayudarte. Si tienes otra duda sobre ElectroTech, aquí estaré.",
}

@app.post("/api/chat")
async def chat_endpoint(request: Request):
    body = await request.json()
    msg = body.get("message", "")
    msg_low = msg.lower()
    
    respuesta_ia = ""
    for clave, respuesta in CONOCIMIENTO_IA.items():
        if clave in msg_low:
            respuesta_ia = respuesta
            break
            
    if not respuesta_ia:
        respuesta_ia = (
            f"Entiendo tu duda sobre '{msg}'. Actualmente estoy entrenado para dar soporte sobre: "
            "Horarios de atención, Teléfonos de contacto (555-1234), Políticas de devolución (30 días) y Garantías por productos rotos o defectuosos."
        )
        
    # GUARDAR EN LA BASE DE DATOS REAL
    conn = sqlite3.connect("interacciones.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO chats (usuario, ia) VALUES (?, ?)", (msg, respuesta_ia))
    conn.commit()
    conn.close()
    
    return {"response": respuesta_ia}

@app.get("/api/dashboard")
async def dashboard_endpoint():
    # LEER DE LA BASE DE DATOS REAL PARA EL PANEL DE MÉTRICAS
    conn = sqlite3.connect("interacciones.db")
    cursor = conn.cursor()
    cursor.execute("SELECT usuario, ia FROM chats")
    filas = cursor.fetchall()
    conn.close()
    
    # Transformamos los datos en una lista para el Frontend
    historial = [{"usuario": f[0], "ia": f[1]} for f in filas]
    
    return {"total_chats": len(historial), "interacciones": historial}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
