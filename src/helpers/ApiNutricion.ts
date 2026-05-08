import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY as string);

export const obtenerNutricionDesdeAPI = async (ingredientes: string, tipo: string, descripcion: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Actúa como un experto nutricionista. Analiza la siguiente receta:
            Tipo: ${tipo}
            Ingredientes: ${ingredientes}
            Descripción: ${descripcion}

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
        
        // Limpieza de formato markdown
        const cleanJson = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);

    } catch (error) {
        console.error("Error en Gemini:", error);
        return { 
            kcal: 0, proteinas: 0, carbohidratos: 0, grasas: 0, fibra: 0, 
            consumo_recomendado: "Error", 
            semaforo: "amarillo" // Valor neutro por defecto si falla
        };
    }
};