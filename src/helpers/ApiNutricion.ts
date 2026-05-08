import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY as string);

export const obtenerNutricionDesdeAPI = async (ingredientes: string, tipo: string, descripcion: string) => {
    try {
        // 🛠️ Forzamos la apiVersion a 'v1' para evitar el error 404 de la v1beta
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: "v1" }
        );

        const prompt = `
            Actúa como un experto nutricionista. Analiza la siguiente receta:
            Tipo: ${tipo}
            Ingredientes: ${ingredientes}
            Descripcion: ${descripcion}

            Calcula los valores nutricionales por ración y clasifica la receta.
            
            IMPORTANTE: Para el campo "semaforo", debes elegir ÚNICAMENTE uno de estos 5 valores:
            - verde_oscuro (Muy saludable / Nutri-Score A)
            - verde_claro (Saludable / Nutri-Score B)
            - amarillo (Moderado / Nutri-Score C)
            - naranja (Poco saludable / Nutri-Score D)
            - rojo (Nada saludable / Nutri-Score E)

            Responde ÚNICAMENTE con un objeto JSON con esta estructura:
            {
              "kcal": number,
              "proteinas": number,
              "carbohidratos": number,
              "grasas": number,
              "fibra": number,
              "consumo_recomendado": "string corto",
              "semaforo": "rojo" | "naranja" | "amarillo" | "verde_claro" | "verde_oscuro"
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // 🔍 DEBUG 1: Ver qué responde la IA exactamente
        console.log("🤖 [IA RAW RESPONSE]:", text);

        // Limpieza de formato markdown
        const cleanJson = text.replace(/```json|```/g, "").trim();
        
        // 🔍 DEBUG 2: Ver el texto después de limpiar el Markdown
        console.log("🧹 [CLEAN TEXT]:", cleanJson);

        const data = JSON.parse(cleanJson);

        // 🔍 DEBUG 3: Ver el objeto final que se va a devolver
        console.log("📊 [DATA OBJECT]:", data);

        return data;

    } catch (error) {
        // 🔍 DEBUG 4: Ver si hay un error de conexión, de API KEY o de Parseo
        console.error("❌ [ERROR EN GEMINI HELPER]:", error);
        
        return { 
            kcal: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0, 
            consumo_recomendado: "No disponible", 
            semaforo: "gris" 
        };
    }
};