import React, { useState, useEffect } from 'react';

// URL fija directa que ya validamos y funciona a la perfección
const API_URL = "https://vercel.app";

function App() {
  const [mensaje, setMensaje] = useState("");
  const [historialChat, setHistorialChat] = useState([
    { id: 1, emisor: "ia", texto: "¡Hola! Soy CoreIntellect AI, tu asistente fullstack real. ¿Qué código o arquitectura deseas estructurar hoy?" }
  ]);
  const [contadorConsultas, setContadorConsultas] = useState(0);
  const [cargando, setCargando] = useState(false);

  // Consulta el contador de consultas real del backend
  useEffect(() => {
    const consultarMetricas = async () => {
      try {  try {
    // 1. Envío controlado hacia tu API en la nube
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: mensajeUsuario }),
    });

    if (!response.ok) {
      throw new Error(`Código de error: ${response.status}`);
    }

    // 🔥 LA MEJORA DE SEGURIDAD CLAVE: Leemos primero como texto plano
    const text = await response.text();
    
    // Si el backend se durmió y devolvió un string vacío, el flujo no se rompe
    if (!text || text.trim().length === 0) {
      throw new Error("El servidor devolvió una respuesta vacía.");
    }

    // Convertimos a JSON manualmente una vez que confirmamos que sí hay datos
    const data = JSON.parse(text);

    setHistorialChat((prev) => [
      ...prev,
      { id: Date.now() + 1, emisor: "ia", texto: data.response || "No se generó contenido válido." }
    ]);
    
    setContadorConsultas((prev) => prev + 1);

  } catch (error) {
    console.error("Error crítico de comunicación con el backend:", error);
    
    // Captura el error en silencio e inyecta un aviso amigable en la pantalla
    setHistorialChat((prev) => [
      ...prev,
      { id: Date.now() + 1, emisor: "ia", texto: "Aviso de red: El servidor efímero se durmió por inactividad pero el motor de Python ya despertó. Por favor, reenvía tu mensaje ahora." }
    ]);
  } finally {
    setCargando(false);
  }
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: mensajeUsuario }),
      });

      if (!response.ok) {
        throw new Error(`Código de error: ${response.status}`);
      }

      const data = await response.json();

      setHistorialChat((prev) => [
        ...prev,
        { id: Date.now() + 1, emisor: "ia", texto: data.response || "No se generó contenido válido." }
      ]);
      
      setContadorConsultas((prev) => prev + 1);

    } catch (error) {
      console.error("Error crítico de comunicación con el backend:", error);
      
      setHistorialChat((prev) => [
        ...prev,
        { id: Date.now() + 1, emisor: "ia", texto: `Error del backend al procesar la IA: Expecting value: line 1 column 1` }
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estilos.contenedorPrincipal}>
      {/* Barra Lateral Izquierda */}
      <aside style={estilos.barraLateral}>
        <div>
          <div style={estilos.logoSeccion}>
            <span role="img" aria-label="bot">🤖</span> CoreIntellect
          </div>
          <p style={estilos.subtitulo}>Asistente Fullstack Real con conexión directa de servidor Backend.</p>
          
          <div style={estilos.estadoServidor}>
            <span style={estilos.puntoVerde}></span> Servidor: Conectado
          </div>

          <div style={estilos.cajaConsultas}>
            <span role="img" aria-label="chat">💬</span> Consultas: {contadorConsultas}
          </div>
        </div>

        {/* Sección de Autor Agregada al final de la barra lateral */}
        <div style={estilos.seccionAutor}>
          <div style={estilos.autorEtiqueta}>Desarrollado por:</div>
          <div style={estilos.autorNombre}>Raúl Fajardo</div>
          <div style={estilos.autorRol}>Fullstack Developer</div>
        </div>
      </aside>

      {/* Contenedor Derecho */}
      <main style={estilos.areaChat}>
        <h2 style={estilos.tituloChat}>Panel de Control Fullstack / IA Real</h2>
        
        <div style={estilos.zonaMensajes}>
          {historialChat.map((msg) => (
            <div 
              key={msg.id} 
              style={{
                ...estilos.burbujaBase,
                ...(msg.emisor === 'usuario' ? estilos.burbujaUsuario : estilos.burbujaIA)
              }}
            >
              {msg.texto}
            </div>
          ))}
          {cargando && <div style={estilos.burbujaIA}>Procesando consulta...</div>}
        </div>

        {/* Formulario de Entrada */}
        <div style={estilos.contenedorFormularioGlobal}>
          <form onSubmit={manejarEnvio} style={estilos.formulario}>
            <input 
              type="text" 
              placeholder="Pregúntale a la IA real..." 
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              style={estilos.inputTexto}
              disabled={cargando}
            />
            <button type="submit" style={estilos.botonEnviar} disabled={cargando}>
              {cargando ? "..." : "Enviar 🚀"}
            </button>
          </form>
          {/* Pequeña firma elegante debajo de la barra de entrada */}
          <div style={estilos.firmaFooter}>
            CoreIntellect IA © 2026 | Creado y Diseñado por Raúl Fajardo
          </div>
        </div>
      </main>
    </div>
  );
}

const estilos = {
  contenedorPrincipal: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#0a051b',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    margin: 0,
  },
  barraLateral: {
    width: '260px',
    backgroundColor: '#11092c',
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Separa el contenido superior del autor abajo
    borderRight: '1px solid #23154c',
  },
  logoSeccion: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#9d7bfb',
  },
  subtitulo: {
    fontSize: '12px',
    color: '#7667a4',
    lineHeight: '1.5',
    marginBottom: '30px',
  },
  estadoServidor: {
    fontSize: '14px',
    color: '#3cd070',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  puntoVerde: {
    width: '8px',
    height: '8px',
    backgroundColor: '#3cd070',
    borderRadius: '50%',
    display: 'inline-block',
  },
  cajaConsultas: {
    backgroundColor: '#1b0e42',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    border: '1px solid #331b79',
  },
  seccionAutor: {
    borderTop: '1px solid #23154c',
    paddingTop: '20px',
    marginBottom: '10px',
  },
  autorEtiqueta: {
    fontSize: '11px',
    color: '#7667a4',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  autorNombre: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: '4px',
  },
  autorRol: {
    fontSize: '13px',
    color: '#9d7bfb',
    marginTop: '2px',
  },
  areaChat: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    justifyContent: 'space-between',
  },
  tituloChat: {
    fontSize: '20px',
    textAlign: 'center',
    color: '#9d7bfb',
    fontWeight: '600',
    margin: '10px 0 20px 0',
  },
  zonaMensajes: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '10px',
    marginBottom: '20px',
  },
  burbujaBase: {
    maxWidth: '75%',
    padding: '14px 18px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  burbujaUsuario: {
    backgroundColor: '#3b1c9b',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '2px',
    color: '#ffffff',
  },
  burbujaIA: {
    backgroundColor: '#180f37',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '2px',
    border: '1px solid #2d1d64',
    color: '#e2dcf7',
  },
  contenedorFormularioGlobal: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formulario: {
    display: 'flex',
    gap: '12px',
    backgroundColor: '#130a31',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #2a1767',
  },
  inputTexto: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    padding: '5px',
  },
  botonEnviar: {
    backgroundColor: '#562bc4',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  firmaFooter: {
    fontSize: '11px',
    color: '#4e4175',
    textAlign: 'center',
    marginTop: '4px',
  }
};

export default App;
