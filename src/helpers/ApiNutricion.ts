import { GoogleGenerativeAI } from "@google/generative-ai";

// Asegúrate de que esta clave no tenga espacios en Render
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY as string);

export const obtenerNutricionDesdeAPI = async (ingredientes: string, tipo: string, descripcion: string) => {
    try {
        // Probamos con el nombre estándar. 
        // Si sigue fallando, cambia "gemini-1.5-flash" por "gemini-pro"
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        // Limpieza de formato markdown por si la IA se pone rebelde
        const cleanJson = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanJson);

        console.log("📊 [DATA OBJECT]:", data);

        return data;

    } catch (error: any) {
        console.error("❌ [ERROR EN GEMINI HELPER]:", error.message);
        
        // Si el error es 404, es que el nombre del modelo no le gusta. 
        // Devolvemos el objeto "gris" para que la DB no pete mientras lo arreglamos.
        return { 
            kcal: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0, 
            consumo_recomendado: "Servicio temporalmente no disponible", 
            semaforo: "gris" 
        };
    }
};