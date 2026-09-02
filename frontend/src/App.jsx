import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ia', text: '¡Hola! Soy CoreIntellect AI, tu asistente fullstack de ejecución directa. ¿Qué código o arquitectura deseas estructurar hoy?' }
  ]);
  const [metrics, setMetrics] = useState({ total_chats: 1 });
  const [loading, setLoading] = useState(false);

  const enviarMensaje = async () => {
    const texto = input.trim();
    if (!texto) return;

    // 1. Añadir el mensaje del usuario a la pantalla
    setMessages(prev => [...prev, { sender: 'user', text: texto }]);
    setInput('');
    setLoading(true);

    try {
      const IA_URL = "https://huggingface.co";
      
      // Token incrustado y variable de respaldo combinadas para evitar caídas de red en producción
      const tokenIA = import.meta.env.VITE_HF_TOKEN || "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";

      // 2. Petición directa al servidor global de Meta Llama
      const response = await fetch(IA_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${tokenIA}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Eres CoreIntellect AI, un asistente fullstack experto. Responde de forma clara, con ejemplos de código estructurado y en español a la siguiente solicitud: ${texto}`,
          parameters: { max_new_tokens: 700, temperature: 0.7 }
        }),
      });

      const data = await response.json();
      let respuestaIA = "";

      // Procesar y limpiar el texto devuelto por la IA
      if (Array.isArray(data) && data[0]?.generated_text) {
        respuestaIA = data[0].generated_text.replace(`Eres CoreIntellect AI, un asistente fullstack experto. Responde de forma clara, con ejemplos de código estructurado y en español a la siguiente solicitud: ${texto}`, "").trim();
      } else if (data && data.generated_text) {
        respuestaIA = data.generated_text.replace(`Eres CoreIntellect AI, un asistente fullstack experto. Responde de forma clara, con ejemplos de código estructurado y en español a la siguiente solicitud: ${texto}`, "").trim();
      } else {
        respuestaIA = "No se pudo procesar la respuesta en este momento. Por favor, intenta de nuevo.";
      }

      // 3. Pintar la respuesta de la IA real en el chat
      setMessages(prev => [...prev, { sender: 'ia', text: respuestaIA }]);
      setMetrics(prev => ({ ...prev, total_chats: prev.total_chats + 1 }));

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'ia', text: 'Error en la ejecución directa con el servidor de IA.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0c0a1c', color: 'white', fontFamily: 'sans-serif' }}>
      {/* Barra Lateral */}
      <div style={{ width: '280px', background: '#131129', padding: '20px', borderRight: '1px solid #252147', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ color: '#a277ff', margin: 0 }}>🤖 CoreIntellect</h2>
        <p style={{ color: '#8b86b4', fontSize: '0.85rem', lineHeight: '1.4' }}>Asistente Fullstack Inteligente de ejecución directa y libre de bloqueos perimetrales.</p>
        <hr style={{ border: 0, borderTop: '1px solid #252147', width: '100%' }} />
        <div style={{ fontSize: '0.9rem', color: '#a277ff' }}>⚡ Estado: Activo en Línea</div>
        <div style={{ fontSize: '0.9rem', color: '#ccc' }}>💬 Consultas: {metrics.total_chats}</div>
      </div>

      {/* Área del Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0c0a1c' }}>
        <div style={{ padding: '20px', background: '#131129', borderBottom: '1px solid #252147', fontWeight: 'bold', color: '#a277ff', fontSize: '1.2rem' }}>Panel de Control de IA / Chat Directo</div>
        
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: '12px',
              lineHeight: '1.5',
              fontSize: '0.95rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? '#613dc1' : '#1f1b3d',
              color: 'white',
              border: msg.sender === 'user' ? 'none' : '1px solid #3d3575',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          ))}
          {loading && <div style={{ alignSelf: 'flex-start', background: '#1f1b3d', color: '#a277ff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #3d3575' }}>Pensando...</div>}
        </div>

        <div style={{ padding: '20px', background: '#131129', borderTop: '1px solid #252147', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej. Estructura un modelo de conexión a base de datos en Python..." 
            onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
            style={{ flex: 1, background: '#1f1b3d', border: '1px solid #3d3575', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '0.95rem', outline: 'none' }}
          />
          <button onClick={enviarMensaje} style={{ background: '#613dc1', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar 🚀</button>
        </div>
      </div>
    </div>
  );
}

export default App;
