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
    { palabras: ['arroz', 'pasta', 'fideo', 'macarron', 'espagueti', 'quinoa', 'avena'], kcal100g: 130, pesoPorUnidad: 150 }, // Cocido
    { palabras: ['harina', 'maicena', 'pan rallado'], kcal100g: 360, pesoPorUnidad: 10 },
    { palabras: ['patata', 'boniato', 'papa'], kcal100g: 80, pesoPorUnidad: 200 },
    { palabras: ['queso', 'mozzarella', 'parmesano', 'cheddar'], kcal100g: 350, pesoPorUnidad: 30, advertencia: 'Grasas saturadas' },
    { palabras: ['leche', 'yogur'], kcal100g: 60, pesoPorUnidad: 200 },
    { palabras: ['huevo', 'huevos'], kcal100g: 155, pesoPorUnidad: 55 },
    { palabras: ['nuez', 'almendra', 'cacahuete', 'pistacho', 'nueces', 'avellana'], kcal100g: 600, pesoPorUnidad: 30, advertencia: 'Grasas saludables' },
    { palabras: ['aguacate'], kcal100g: 160, pesoPorUnidad: 150, advertencia: 'Grasas saludables' },
    { palabras: ['azucar', 'miel', 'chocolate', 'galleta', 'cacao', 'sirope'], kcal100g: 450, pesoPorUnidad: 15, advertencia: 'Alto en azucares' },
    { palabras: ['sal'], kcal100g: 0, pesoPorUnidad: 1, advertencia: 'Sodio' },
    { palabras: ['limon', 'manzana', 'platano', 'naranja', 'pera', 'fresa', 'uva', 'pina'], kcal100g: 50, pesoPorUnidad: 150 },
    { palabras: ['tomate', 'cebolla', 'ajo', 'pimiento', 'lechuga', 'zanahoria', 'calabacin', 'champinon', 'berenjena'], kcal100g: 25, pesoPorUnidad: 100 }
].sort((a, b) => b.palabras[0].length - a.palabras[0].length);

const normalizar = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const obtenerGramosReales = (cantidadStr: string, unidadStr: string, nombreItem: string, pesoRef: number): number => {
    const texto = normalizar(nombreItem);
    if (texto.includes('pizca')) return 2;
    if (texto.includes('chorrito')) return 8;
    if (texto.includes('punado')) return 30;

    let n = 1;
    if (cantidadStr) {
        n = cantidadStr.includes('/') 
            ? (parseFloat(cantidadStr.split('/')[0]) / parseFloat(cantidadStr.split('/')[1]))
            : parseFloat(cantidadStr.replace(',', '.'));
    }

    const u = normalizar(unidadStr || "");
    if (['kg', 'kilos', 'l', 'litros'].includes(u)) return n * 1000;
    if (['g', 'gr', 'gramos', 'ml', 'mililitros'].includes(u)) return n;
    if (['cucharada', 'cda'].includes(u)) return n * 15;
    if (['cucharadita', 'cdta'].includes(u)) return n * 5;
    if (['taza'].includes(u)) return n * 200;
    if (['diente', 'dientes'].includes(u)) return n * 5;

    return n * pesoRef;
};

export const obtenerNutricionDesdeAPI = async (ingredientesStr: string, tipoReceta: string) => {
    try {
        let kcalTotales = 0;
        let advertencias = new Set<string>();
        let desglose: any[] = [];
        let desconocidos: string[] = [];

        // 1. DETECTAR SI ES FRITURA (Para el truco del aceite)
        const esFritura = /frit|freir|rebozad|empanad/i.test(normalizar(ingredientesStr));

        // 2. RACIONES
        let numRaciones = 1;
        const matchRaciones = ingredientesStr.match(/(?:para\s+)?(\d+)/i);
        if (matchRaciones) numRaciones = parseInt(matchRaciones[1]);

        const listaIngredientes = ingredientesStr.split(/,| y /i).map(i => i.trim());
        const regexParser = /^([\d.,\/]+)?\s*(kg|kilos?|g|gr|gramos|ml|l|litros?|cucharadas?|cda|cucharaditas?|cdta|tazas?|dientes?|pz|piezas?|unidades?)?\s*((?:de\s+)?.*)$/i;

        listaIngredientes.forEach(item => {
            if (!item || item.toLowerCase().includes("para")) return;

            const match = item.match(regexParser);
            if (match) {
                const nombreLimpio = normalizar(match[3] || "");

                // 🟢 TRUCO DE NUTRICIONISTA: 
                // Si la receta es frita y el ingrediente es "Aceite" en gran cantidad (>50ml), 
                // lo ignoramos aquí porque aplicaremos el factor de absorción (30%) al final.
                if (esFritura && nombreLimpio.includes('aceite')) {
                    const cant = parseFloat(match[1] || "0");
                    if (cant > 50) return; 
                }

                const alimentoDB = BASE_DATOS_INGREDIENTES.find(dbItem => 
                    dbItem.palabras.some(p => new RegExp(`\\b${normalizar(p)}\\b`, 'i').test(nombreLimpio))
                );

                if (alimentoDB) {
                    const gramos = obtenerGramosReales(match[1] || "", match[2] || "", nombreLimpio, alimentoDB.pesoPorUnidad);
                    const kcalItem = (gramos / 100) * alimentoDB.kcal100g;
                    kcalTotales += kcalItem;
                    
                    desglose.push({ nombre: match[3], gramos: Math.round(gramos), kcal: Math.round(kcalItem) });
                    if (alimentoDB.advertencia) advertencias.add(alimentoDB.advertencia);
                } else if (nombreLimpio.length > 2) {
                    desconocidos.push(item);
                }
            }
        });

        // 3. APLICAR FACTOR DE COCCIÓN (Solo la técnica dominante)
        if (esFritura) {
            kcalTotales *= 1.30; // Sumamos un 30% de calorías por el aceite absorbido
            advertencias.add('Fritura profunda');
        } else if (/horno|asad/i.test(normalizar(ingredientesStr))) {
            kcalTotales *= 1.05;
        }

        const kcalFinal = Math.round(kcalTotales / numRaciones);

        return {
            calorias: kcalFinal,
            consumo_recomendado: kcalFinal > 750 ? "Consumo ocasional" : "Consumo habitual",
            meta: {
                raciones: numRaciones,
                precision: desglose.length + desconocidos.length > 0 ? parseFloat((desglose.length / (desglose.length + desconocidos.length)).toFixed(2)) : 0,
                desconocidos,
                desglose
            }
        };
    } catch (error) {
        return { calorias: 0, meta: { error: "Fallo en el motor" } };
    }
};