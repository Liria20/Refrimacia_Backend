import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// 1. FORZAMOS la lectura del archivo .env aquí mismo
dotenv.config();

const apiKey = process.env.GOOGLE_AI_KEY;

// 2. Comprobación de seguridad
if (!apiKey) {
    console.error("⚠️ ERROR GRAVE: La clave GOOGLE_AI_KEY está vacía o no se encuentra el archivo .env");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const obtenerNutricionDesdeAPI = async (ingredientes: string, tipo: string, descripcion: string) => {
    try {
        // 3. Usamos el modelo exacto y soportado por la v0.24.1
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

        // Limpieza de formato markdown
        const cleanJson = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanJson);

        console.log("📊 [DATA OBJECT]:", data);

        return data;

    } catch (error: any) {
        console.error("❌ [ERROR EN GEMINI HELPER]:", error.message);
        
        // Devolvemos el color 'gris' para evitar que la app explote mientras se soluciona
        return { 
            kcal: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0, 
            consumo_recomendado: "Servicio temporalmente no disponible", 
            semaforo: "gris" 
        };
    }
};