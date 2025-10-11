// Configuración del Chatbot Zoom TV
export const CHATBOT_CONFIG = {
  // Configuración de la API
  API_KEY: 'AIzaSyCrMeUIKSewl5vRauMjNpakJh6U29I5nAE',
  MODEL: 'gemini-2.0-flash-exp',
  
  // Configuración del prompt
  SYSTEM_PROMPT: `Eres un asistente virtual de Zoom TV, un canal de televisión. Responde de manera amigable y profesional en español.

Contexto sobre Zoom TV:
- Zoom TV es un canal de televisión que ofrece programación variada
- Incluye noticias locales y regionales
- Tiene secciones de deportes, música, programación local y contenido regional
- Es un medio de comunicación importante en la comunidad
- Ofrece programación en vivo y contenido grabado
- Tiene presencia en redes sociales y plataforma digital

Instrucciones:
- Responde siempre en español
- Sé amigable y profesional
- Proporciona información útil sobre Zoom TV cuando sea relevante
- Si no sabes algo específico sobre Zoom TV, admítelo pero ofrece ayuda general
- Mantén las respuestas concisas pero informativas
- Usa un tono conversacional y cercano

Pregunta del usuario: `,

  // Mensajes del sistema
  MESSAGES: {
    WELCOME: "¡Hola! Soy el asistente de Zoom TV. ¿En qué puedo ayudarte hoy?",
    ERROR: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
    LOADING: "Escribiendo...",
    PLACEHOLDER: "Escribe tu mensaje...",
    SEND_BUTTON: "Enviar",
    SEND_LOADING: "...",
    ONLINE_STATUS: "Online",
    CHAT_TITLE: "Zoom TV Assistant"
  },

  // Configuración de la interfaz
  UI: {
    MAX_MESSAGE_WIDTH: '18rem',
    MESSAGE_PADDING: '0.75rem',
    FONT_SIZE: '0.875rem',
    BORDER_RADIUS: '0.5rem',
    ANIMATION_DURATION: '0.3s'
  },

  // Configuración de colores (para referencia)
  COLORS: {
    PRIMARY_RED: '#e50914',
    DARK_RED: '#b2070f',
    BLACK: '#000000',
    DARK_GRAY: '#141414',
    MEDIUM_GRAY: '#333333',
    LIGHT_GRAY: '#e5e5e5',
    WHITE: '#ffffff'
  }
};

// Función para generar el prompt completo
export const generatePrompt = (userMessage) => {
  return `${CHATBOT_CONFIG.SYSTEM_PROMPT}${userMessage}

Responde de manera útil y concisa:`;
};

// Función para obtener la configuración de la API
export const getApiConfig = () => {
  return {
    apiKey: CHATBOT_CONFIG.API_KEY,
    model: CHATBOT_CONFIG.MODEL
  };
};
