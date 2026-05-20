import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_KEY;

if (!apiKey) {
    console.error("⚠️ ERROR GRAVE: La clave GOOGLE_AI_KEY no se está inyectando desde Render.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const obtenerNutricionDesdeAPI = async (ingredientes: string, tipo: string, descripcion: string) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Actúa como un expertisimo nutricionista y chef de RefriMancia. Tu única tarea es analizar la receta que te pase el usuario y rellenar un esquema de datos estricto con los macros TOTALES de todo el plato combinados, la dificultad y el semáforo nutricional. Sé matemático, frío y ultra-rápido.",
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

            CRÍTICO: Calcula los valores nutricionales enfocados al TOTAL DE TODO EL PLATO combinado. Estima también el peso neto aproximado del plato cocinado en gramos.

            Reglas para campos específicos:
            - "semaforo": elije uno de estos valores basándote en la calidad nutricional por 100g del plato: verde_oscuro, verde_claro, amarillo, naranja, rojo.
            - "dificultad": elije uno de estos valores: Fácil, Media, Difícil.

            Devuelve el JSON con la siguiente estructura exacta (atendiendo exactamente a los nombres de las llaves):
            {
              "peso_total_g": number,
              "kcal": number,
              "proteinas": number,
              "carbohidratos": number,
              "azucares": number,
              "grasas": number,
              "grasas_saturadas": number,
              "fibra": number,
              "sal": number,
              "consumo_habitual": "string corto",
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
            peso_total_g: 0, kcal: 0, proteinas: 0, carbohidratos: 0, azucares: 0, 
            grasas: 0, grasas_saturadas: 0, fibra: 0, sal: 0,
            consumo_habitual: "Servicio temporalmente no disponible",
            semaforo: "gris",
            dificultad: "Media"
        };
    }
};

export const calcularValores100g = (datosIA: any) => {
    // Evitamos la división por cero si la IA se equivoca con el peso
    const peso = datosIA.peso_total_g > 0 ? datosIA.peso_total_g : 100;

    return {
        kcal_100g: parseFloat(((datosIA.kcal * 100) / peso).toFixed(1)),
        proteinas_100g: parseFloat(((datosIA.proteinas * 100) / peso).toFixed(1)),
        carbohidratos_100g: parseFloat(((datosIA.carbohidratos * 100) / peso).toFixed(1)),
        azucares_100g: parseFloat(((datosIA.azucares * 100) / peso).toFixed(1)),
        grasas_100g: parseFloat(((datosIA.grasas * 100) / peso).toFixed(1)),
        grasas_saturadas_100g: parseFloat(((datosIA.grasas_saturadas * 100) / peso).toFixed(1)),
        fibra_100g: parseFloat(((datosIA.fibra * 100) / peso).toFixed(1)),
        sal_100g: parseFloat(((datosIA.sal * 100) / peso).toFixed(1))
    };
};