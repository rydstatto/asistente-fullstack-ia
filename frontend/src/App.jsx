import React, { useState } from 'react';

export default function App() {
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState([{ sender: 'ia', text: '¡Hola! ¿En qué te ayudo hoy?' }]);
  const [input, setInput] = useState('');
  const [metrics, setMetrics] = useState({ total_chats: 0 });

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    const textoEnviado = input;
    setInput('');

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textoEnviado })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'ia', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ia', text: 'Error al conectar con el servidor.' }]);
    }
  };

  const verMetricas = async () => {
    setTab('metrics');
    try {
      const response = await fetch('http://localhost:8000/api/dashboard');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.log("Error cargando métricas");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#111827', color: 'white', fontFamily: 'sans-serif', margin: 0 }}>
      {/* Menú Lateral */}
      <div style={{ width: '250px', backgroundColor: '#1f2937', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ color: '#818cf8', margin: '0 0 20px 0' }}>🤖 CoreIntellect</h2>
        <button onClick={() => setTab('chat')} style={{ padding: '12px', backgroundColor: tab === 'chat' ? '#4f46e5' : 'transparent', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>💬 Chat Soporte</button>
        <button onClick={verMetricas} style={{ padding: '12px', backgroundColor: tab === 'metrics' ? '#4f46e5' : 'transparent', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>📊 Panel Métricas</button>
      </div>

      {/* Ventana de Contenido */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', backgroundColor: '#111827' }}>
        {tab === 'chat' ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '90vh', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <div style={{ overflowY: 'auto', flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', backgroundColor: m.sender === 'user' ? '#4f46e5' : '#374151', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', maxWidth: '80%' }}>
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={enviarMensaje} style={{ display: 'flex', gap: '10px', paddingTop: '10px' }}>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pregunta sobre horarios o devoluciones..." style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #4b5563', backgroundColor: '#1f2937', color: 'white', outline: 'none' }} />
              <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#4f46e5', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Enviar</button>
            </form>
          </div>
        ) : (
          <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <h3>Estadísticas del Servidor</h3>
            <div style={{ padding: '20px', backgroundColor: '#1f2937', borderRadius: '8px', marginTop: '20px' }}>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>Total de interacciones procesadas</p>
              <h1 style={{ margin: '10px 0 0 0', color: '#818cf8', fontSize: '36px' }}>{metrics.total_chats}</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
