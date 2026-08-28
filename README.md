# 🤖 CoreIntellect - Sistema Full-Stack de Soporte con IA Local

Este es un proyecto completo diseñado para el portafolio profesional que simula un agente inteligente de atención al cliente y soporte técnico para una empresa de tecnología, integrando un panel de analíticas en tiempo real.

## 🚀 Tecnologías Utilizadas

- **Frontend:** React.js, Vite, Javascript, CSS Estructurado In-Code.
- **Backend:** Python, FastAPI, Uvicorn (Arquitectura REST de alto rendimiento).
- **Base de Datos:** SQLite (Base de datos relacional nativa para persistencia de logs).

## 🛠️ Características del Sistema

1. **Agente de Chat Autónomo:** Utiliza un algoritmo local de coincidencia difusa (Procesamiento de Lenguaje Natural Básico) para responder al instante dudas complejas sobre horarios, garantías y productos defectuosos sin depender de APIs externas.
2. **Persistencia SQL:** Cada mensaje enviado por el usuario y procesado por la IA se almacena en tiempo real dentro de una base de datos local `interacciones.db`.
3. **Panel de Métricas Integrado:** El frontend consume un endpoint del backend para calcular el total de interacciones acumuladas e historial de logs.
4. **Seguridad Local:** Configurado para saltar restricciones locales de Windows mediante políticas CORS universales (`0.0.0.0`).
