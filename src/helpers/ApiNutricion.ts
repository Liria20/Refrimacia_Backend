// helpers/ApiNutricion.ts

interface IngredienteDB {
    palabras: string[];
    kcal100g: number;
    pesoPorUnidad: number;
    advertencia?: string;
}

const BASE_DATOS_INGREDIENTES: IngredienteDB[] = [
    { palabras: ['aceite', 'mantequilla', 'margarina', 'manteca'], kcal100g: 890, pesoPorUnidad: 15, advertencia: 'Grasas añadidas' },
    { palabras: ['nata', 'crema de leche'], kcal100g: 340, pesoPorUnidad: 15 },
    { palabras: ['pollo', 'pavo', 'pechuga'], kcal100g: 165, pesoPorUnidad: 150 },
    { palabras: ['ternera', 'cerdo', 'carne picada', 'lomo', 'costilla', 'hamburguesa'], kcal100g: 220, pesoPorUnidad: 150 },
    { palabras: ['chorizo', 'panceta', 'bacon', 'salchicha', 'morcilla', 'salami'], kcal100g: 400, pesoPorUnidad: 50, advertencia: 'Ultraprocesado' },
    { palabras: ['salmon', 'atun', 'sardina'], kcal100g: 200, pesoPorUnidad: 150 },
    { palabras: ['merluza', 'bacalao', 'calamar', 'pulpo', 'gamba', 'langostino', 'sepia'], kcal100g: 90, pesoPorUnidad: 150 },
    { palabras: ['pan', 'baguette', 'barra', 'tostada'], kcal100g: 270, pesoPorUnidad: 120 },
    { palabras: ['arroz', 'pasta', 'fideo', 'macarron', 'espagueti', 'quinoa', 'avena'], kcal100g: 130, pesoPorUnidad: 150 },
    { palabras: ['harina', 'maicena', 'pan rallado'], kcal100g: 360, pesoPorUnidad: 10 },
    { palabras: ['patata', 'boniato', 'papa'], kcal100g: 80, pesoPorUnidad: 200 },
    { palabras: ['queso', 'mozzarella', 'parmesano', 'cheddar'], kcal100g: 350, pesoPorUnidad: 30, advertencia: 'Grasas saturadas' },
    { palabras: ['leche', 'yogur'], kcal100g: 60, pesoPorUnidad: 200 },
    { palabras: ['huevo', 'huevos'], kcal100g: 155, pesoPorUnidad: 55 },
    { palabras: ['nuez', 'almendra', 'cacahuete', 'pistacho', 'nueces'], kcal100g: 600, pesoPorUnidad: 30, advertencia: 'Grasas saludables' },
    { palabras: ['aguacate'], kcal100g: 160, pesoPorUnidad: 150, advertencia: 'Grasas saludables' },
    { palabras: ['azucar', 'miel', 'chocolate', 'galleta', 'cacao'], kcal100g: 450, pesoPorUnidad: 15, advertencia: 'Alto en azucares' },
    { palabras: ['limon', 'manzana', 'platano', 'naranja', 'pera', 'fresa', 'uva', 'pina'], kcal100g: 50, pesoPorUnidad: 150 },
    { palabras: ['tomate', 'cebolla', 'ajo', 'pimiento', 'lechuga', 'zanahoria', 'calabacin', 'champinon', 'berenjena'], kcal100g: 25, pesoPorUnidad: 100 }
].sort((a, b) => b.palabras[0].length - a.palabras[0].length);

const normalizar = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const obtenerGramosReales = (cantidadStr: string, unidadStr: string, nombreItem: string, pesoPorUnidad: number): number | null => {
    const texto = normalizar(nombreItem);
    
    if (texto.includes('pizca')) return 2;
    if (texto.includes('chorrito')) return 8;
    if (texto.includes('punado')) return 30;

    // 🟢 ESTRICTO: Si no detectamos número, devolvemos null
    if (!cantidadStr || cantidadStr.trim() === "") return null;

    let n = 1;
    if (cantidadStr.includes('/')) {
        const parts = cantidadStr.split('/');
        n = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
        n = parseFloat(cantidadStr.replace(',', '.'));
    }

    const u = normalizar(unidadStr || "");
    if (['kg', 'kilos', 'l', 'litros'].includes(u)) return n * 1000;
    if (['g', 'gr', 'gramos', 'ml', 'mililitros'].includes(u)) return n;
    if (['cucharada', 'cda'].includes(u)) return n * 15;
    if (['cucharadita', 'cdta'].includes(u)) return n * 5;
    if (['taza'].includes(u)) return n * 200;

    return n * pesoPorUnidad;
};

export const obtenerNutricionDesdeAPI = async (ingredientesStr: string, tipoReceta: string, descripcion?: string) => {
    try {
        let kcalTotales = 0;
        let advertencias = new Set<string>();

        const textoCompleto = normalizar(ingredientesStr + " " + (descripcion || "") + " " + tipoReceta);
        const esFritura = /(frit|frie|frii|freir|rebozad|empanad|tempura)/i.test(textoCompleto);

        let numRaciones = 1;
        const matchRaciones = ingredientesStr.match(/para\s+(\d+)/i);
        if (matchRaciones) numRaciones = parseInt(matchRaciones[1]);

        const listaIngredientes = ingredientesStr.split(/,| y /i).map(i => i.trim());
        const regexParser = /^([\d.,\/]+)?\s*(kg|kilos?|g|gr|gramos|ml|l|litros?|cucharadas?|cda|cucharaditas?|cdta|tazas?|dientes?|pz|piezas?|unidades?)?\s*(?:de\s+)?(.*)$/i;

        for (const item of listaIngredientes) {
            if (!item || normalizar(item).startsWith("para")) continue;

            const match = item.match(regexParser);
            if (match) {
                const nombreLimpio = normalizar(match[3] || "");

                const alimentoDB = BASE_DATOS_INGREDIENTES.find(dbItem =>
                    dbItem.palabras.some(p => nombreLimpio.includes(normalizar(p)))
                );

                if (alimentoDB) {
                    // Obtención estricta de gramos
                    const gramos = obtenerGramosReales(match[1] || "", match[2] || "", nombreLimpio, alimentoDB.pesoPorUnidad);
                    
                    if (gramos !== null) {
                        // Filtro de aceite para frituras
                        if (esFritura && nombreLimpio.includes('aceite') && gramos > 50) continue;

                        kcalTotales += (gramos / 100) * alimentoDB.kcal100g;
                        if (alimentoDB.advertencia) advertencias.add(alimentoDB.advertencia);
                    }
                }
            }
        }

        if (esFritura && kcalTotales > 0) kcalTotales *= 1.30;

        const kcalFinal = Math.round(kcalTotales / numRaciones);

        // 🟢 LÓGICA DE CONSUMO ACTUALIZADA
        let consumo = "Consumo habitual";
        
        if (kcalFinal === 0) {
            consumo = "Indeterminado (Faltan cantidades)";
        } else if (kcalFinal > 800 || advertencias.has('Fritura profunda')) {
            consumo = "Consumo ocasional";
        } else if (kcalFinal > 500) {
            consumo = "Consumo moderado";
        }

        return {
            calorias: kcalFinal,
            consumo_recomendado: consumo
        };

    } catch (error) {
        return { calorias: 0, consumo_recomendado: "Error de cálculo" };
    }
};