    try {
        // 1. URL del modelo de IA real y libre en Hugging Face
        const IA_URL = "https://huggingface.co";
        
        // 2. Petición directa al servidor de IA pasando tu Token Seguro
        const response = await fetch(IA_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: `Eres CoreIntellect AI, un asistente fullstack experto. Responde de forma clara, concisa y en español a la siguiente solicitud: ${textoEnviado}`,
                parameters: { max_new_tokens: 500, temperature: 0.7 }
            }),
        });

        const data = await response.json();
        
        // 3. Extraemos el texto generado por la IA real
        let respuestaIA = "";
        if (data && data[0] && data[0].generated_text) {
            // Limpiamos el prompt del texto para dejar solo la respuesta
            respuestaIA = data[0].generated_text.replace(`Eres CoreIntellect AI, un asistente fullstack experto. Responde de forma clara, concisa y en español a la siguiente solicitud: ${textoEnviado}`, "").trim();
        } else {
            respuestaIA = "Lo siento, no pude procesar la respuesta en este momento.";
        }

        // 4. Pintamos la respuesta real en el chat
        setMessages(prev => [...prev, { sender: 'ia', text: respuestaIA }]);
        setMetrics(prev => ({ ...prev, total_chats: prev.total_chats + 1 }));

    } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { sender: 'ia', text: 'Error de ejecución directa con el servidor de IA.' }]);
    }
