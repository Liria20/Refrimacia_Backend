import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_KEY;

if (!apiKey) {
    console.error("⚠️ ERROR GRAVE: La clave GOOGLE_AI_KEY no se está inyectando desde Render.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const obtenerNutricionDesdeAPI = async (ingredientes: string, tipo: string, descripcion: string) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: "Actúa como un experto nutricionista y chef de RefriMancia. Tu única tarea es analizar la receta que te pase el usuario y rellenar un esquema de datos estricto con los macros por ración, la dificultad y el semáforo nutricional. Sé matemático, frío y ultra-rápido.",
            generationConfig: {
                responseMimeType: "application/json", 
                temperature: 0 
            }
        });

        const prompt = `
            Analiza esta receta:
            Tipo: ${tipo}
            Ingredientes: ${ingredientes}
            Descripcion: ${descripcion}

            Reglas para campos específicos:
            - "semaforo": elije uno de estos valores: verde_oscuro, verde_claro, amarillo, naranja, rojo.
            - "dificultad": elije uno de estos valores: Fácil, Media, Difícil.
            - "consumo_recomendado": 🔥 Elije ÚNICAMENTE una de estas 4 frases exactas (la que mejor se adapte):
                "Ideal para consumo diario"
                "Consumo moderado (2-3 veces por semana)"
                "Consumo ocasional (Capricho puntual)"
                "Incomestible (Evitar)"

            Devuelve el JSON con la siguiente estructura exacta:
            {
              "kcal": number,
              "proteinas": number,
              "carbohidratos": number,
              "grasas": number,
              "fibra": number,
              "consumo_recomendado": "Ideal para consumo diario" | "Consumo moderado (2-3 veces por semana)" | "Consumo ocasional (Capricho puntual)" | "Incomestible (Evitar)",
              "semaforo": "verde_oscuro" | "verde_claro" | "amarillo" | "naranja" | "rojo",
              "dificultad": "Fácil" | "Media" | "Difícil"
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log("🤖 [IA RAW RESPONSE]:", text);

        const data = JSON.parse(text);

        console.log("📊 [DATA OBJECT]:", data);

        return data;

    } catch (error: any) {
        console.error("❌ [ERROR EN GEMINI HELPER]:", error.message);

        return {
            kcal: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0,
            consumo_recomendado: "Servicio temporalmente no disponible",
            semaforo: "gris",
            dificultad: "Media"
        };
    }
};