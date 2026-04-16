// utils/apiNutricion.ts

const APP_ID = "cb651dec"; 
const APP_KEY = "cf8c86d88edbffce4d9d5c4e1866ef22";

export const obtenerNutricionDesdeAPI = async (ingredientesStr: string, tipoReceta: string) => {
    try {
        // Preparamos los ingredientes separándolos por comas
        const listaIngredientes = ingredientesStr.split(',').map(i => i.trim());

        // Hacemos la llamada a la API de Edamam
        const response = await fetch(`https://api.edamam.com/api/nutrition-details?app_id=${APP_ID}&app_key=${APP_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: "Receta",
                ingr: listaIngredientes
            })
        });

        if (!response.ok) {
            throw new Error("No se pudo calcular la nutrición con Edamam");
        }

        const data = await response.json();
        const kcalTotales = data.calories || 0;

        // Lógica sencilla de consumo
        let consumo = "Consumo habitual (3-4 veces por semana)";
        if (kcalTotales > 600 || tipoReceta === 'Postre') {
            consumo = "Consumo moderado u ocasional";
        } else if (kcalTotales < 350) {
            consumo = "Consumo diario o frecuente";
        }

        return {
            calorias: Math.round(kcalTotales),
            consumo_recomendado: consumo
        };

    } catch (error) {
        console.error("Error en la API de nutrición:", error);
        // Fallback por si falla internet
        return {
            calorias: 0,
            consumo_recomendado: "Información no disponible"
        };
    }
};