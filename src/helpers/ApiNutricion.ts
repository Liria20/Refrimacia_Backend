import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔍 Protección: Si la clave no carga, lo verás en la consola de Render
if (!process.env.GOOGLE_AI_KEY) {
    console.error("⚠️ CRÍTICO: La variable GOOGLE_AI_KEY no está llegando al servidor.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "");

export const obtenerNutricionDesdeAPI = async (ingredientes: string, tipo: string, descripcion: string) => {
    try {
        // 🛠️ AJUSTE 2026: Usamos el nombre de modelo de este año: "gemini-3-flash"
        // Este modelo reemplaza a los antiguos 1.5 y soluciona el error 404.
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

        const prompt = `
            Actúa como un experto nutricionista. Analiza la siguiente receta:
            Tipo: ${tipo}
            Ingredientes: ${ingredientes}
            Descripcion: ${descripcion}

            Calcula los valores nutricionales por ración y clasifica la receta.
            
            IMPORTANTE: Para el campo "semaforo", debes elegir ÚNICAMENTE uno de estos 5 valores:
            - verde_oscuro
            - verde_claro
            - amarillo
            - naranja
            - rojo

            Responde ÚNICAMENTE con un objeto JSON (sin markdown, sin texto extra) con esta estructura:
            {
              "kcal": number,
              "proteinas": number,
              "carbohidratos": number,
              "grasas": number,
              "fibra": number,
              "consumo_recomendado": "string corto",
              "semaforo": "verde_oscuro" | "verde_claro" | "amarillo" | "naranja" | "rojo"
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        console.log("🤖 [IA RAW RESPONSE]:", text);

        const cleanJson = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanJson);

        console.log("📊 [DATA OBJECT]:", data);

        return data;

    } catch (error: any) {
        console.error("❌ [ERROR EN GEMINI HELPER]:", error.message);
        
        // Devolvemos 'gris' para que sepa que está pendiente o hubo un fallo
        return { 
            kcal: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0, 
            consumo_recomendado: "Servicio temporalmente no disponible", 
            semaforo: "gris" 
        };
    }
};