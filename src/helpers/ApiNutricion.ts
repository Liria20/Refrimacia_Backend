// helpers/ApiNutricion.ts

interface IngredienteDB {
    palabras: string[];
    kcal100g: number;
    pesoPorUnidad: number;
    advertencia?: string;
}

// 1. BASE DE DATOS (Normalizada sin tildes para el motor)
const BASE_DATOS_INGREDIENTES: IngredienteDB[] = [
    { palabras: ['aceite', 'mantequilla', 'margarina', 'manteca'], kcal100g: 890, pesoPorUnidad: 15, advertencia: 'Grasas añadidas' },
    { palabras: ['nata', 'crema de leche'], kcal100g: 340, pesoPorUnidad: 15 },
    { palabras: ['pollo', 'pavo', 'pechuga'], kcal100g: 165, pesoPorUnidad: 150 },
    { palabras: ['ternera', 'cerdo', 'carne picada', 'lomo', 'costilla'], kcal100g: 220, pesoPorUnidad: 150 },
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
    { palabras: ['nuez', 'almendra', 'cacahuete', 'pistacho', 'nueces', 'avellana'], kcal100g: 600, pesoPorUnidad: 30, advertencia: 'Grasas saludables' },
    { palabras: ['aguacate'], kcal100g: 160, pesoPorUnidad: 150, advertencia: 'Grasas saludables' },
    { palabras: ['azucar', 'miel', 'chocolate', 'galleta', 'cacao', 'sirope'], kcal100g: 450, pesoPorUnidad: 15, advertencia: 'Alto en azucares' },
    { palabras: ['sal'], kcal100g: 0, pesoPorUnidad: 1, advertencia: 'Alto en sodio' },
    { palabras: ['manzana', 'platano', 'naranja', 'pera', 'fresa', 'limon', 'uva', 'pina'], kcal100g: 50, pesoPorUnidad: 150 },
    { palabras: ['tomate', 'cebolla', 'ajo', 'pimiento', 'lechuga', 'zanahoria', 'calabacin', 'champinon', 'berenjena'], kcal100g: 25, pesoPorUnidad: 100 }
].sort((a, b) => b.palabras[0].length - a.palabras[0].length);

const TECNICAS_COCCION = [
    { palabras: ['frit', 'freir', 'rebozad', 'empanad', 'tempura'], factor: 1.15, advertencia: 'Fritura profunda' },
    { palabras: ['horno', 'asado'], factor: 1.05, advertencia: null },
    { palabras: ['plancha', 'vapor', 'cocido', 'hervido'], factor: 1.0, advertencia: null }
];

// 2. NORMALIZADOR (Tildes y mayúsculas)
const normalizar = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// 3. CONVERSOR DE GRAMOS ROBUSTO (Recuperado y mejorado)
const obtenerGramosReales = (cantidadStr: string, unidadStr: string, nombreItem: string, pesoRef: number): number => {
    const texto = normalizar(nombreItem);
    
    // Medidas coloquiales
    if (texto.includes('pizca') || texto.includes('pellizco')) return 2;
    if (texto.includes('chorrito')) return 8;
    if (texto.includes('punado')) return 30;

    let n = 1;
    if (cantidadStr) {
        n = cantidadStr.includes('/') 
            ? (parseFloat(cantidadStr.split('/')[0]) / parseFloat(cantidadStr.split('/')[1]))
            : parseFloat(cantidadStr.replace(',', '.'));
    }

    const u = normalizar(unidadStr || "");
    if (['kg', 'kilos', 'kilogramos', 'l', 'litros'].includes(u)) return n * 1000;
    if (['g', 'gr', 'gramos', 'ml', 'mililitros'].includes(u)) return n;
    if (['cucharada', 'cda', 'cucharadas'].includes(u)) return n * 15;
    if (['cucharadita', 'cdta', 'cucharaditas'].includes(u)) return n * 5;
    if (['taza', 'tazas'].includes(u)) return n * 200;
    if (['diente', 'dientes'].includes(u)) return n * 5;
    if (['pieza', 'piezas', 'unidad', 'unidades', 'pz'].includes(u)) return n * pesoRef;

    return n * pesoRef; // Fallback
};

// 4. MOTOR PRINCIPAL
export const obtenerNutricionDesdeAPI = async (ingredientesStr: string, tipoReceta: string) => {
    try {
        let kcalTotales = 0;
        let advertencias = new Set<string>();
        let desglose: any[] = [];
        let desconocidos: string[] = [];

        // REGEX RACIONES MEJORADO (Detecta: "para 2", "para 2 personas", "2 personas")
        let numRaciones = 1;
        const regexRaciones = /para\s+(\d+)/i;
        const matchRaciones = ingredientesStr.match(regexRaciones);
        if (matchRaciones && matchRaciones[1]) numRaciones = parseInt(matchRaciones[1]);

        const listaIngredientes = ingredientesStr.split(/,| y /i).map(i => i.trim());
        const regexParser = /^([\d.,\/]+)?\s*(kg|kilos?|g|gr|gramos|ml|l|litros?|cucharadas?|cda|cucharaditas?|cdta|tazas?|dientes?|pz|piezas?|unidades?)?\s*((?:de\s+)?.*)$/i;

        listaIngredientes.forEach(item => {
            if (!item || item.toLowerCase().includes("para")) return;

            const match = item.match(regexParser);
            if (match) {
                const nombreLimpio = normalizar(match[3] || "");
                const alimentoDB = BASE_DATOS_INGREDIENTES.find(dbItem => 
                    dbItem.palabras.some(p => new RegExp(`\\b${normalizar(p)}\\b`, 'i').test(nombreLimpio))
                );

                if (alimentoDB) {
                    const gramos = obtenerGramosReales(match[1], match[2], nombreLimpio, alimentoDB.pesoPorUnidad);
                    const kcalItem = (gramos / 100) * alimentoDB.kcal100g;
                    kcalTotales += kcalItem;
                    
                    desglose.push({ nombre: match[3], gramos: Math.round(gramos), kcal: Math.round(kcalItem) });
                    if (alimentoDB.advertencia) advertencias.add(alimentoDB.advertencia);
                } else if (nombreLimpio.length > 2) {
                    desconocidos.push(item);
                }
            }
        });

        // TÉCNICA DOMINANTE
        const tecnicaAplicada = TECNICAS_COCCION.find(t => 
            t.palabras.some(p => normalizar(ingredientesStr).includes(normalizar(p)))
        );
        if (tecnicaAplicada) {
            kcalTotales *= tecnicaAplicada.factor;
            if (tecnicaAplicada.advertencia) advertencias.add(tecnicaAplicada.advertencia);
        }

        const kcalFinal = Math.round(kcalTotales / numRaciones);

        return {
            calorias: kcalFinal,
            consumo_recomendado: kcalFinal > 800 ? "Consumo ocasional" : "Consumo habitual",
            meta: {
                raciones: numRaciones,
                // PRECISIÓN: Si no hay ingredientes, es 0. Si hay, es el ratio.
                precision: desglose.length + desconocidos.length > 0 
                    ? parseFloat((desglose.length / (desglose.length + desconocidos.length)).toFixed(2))
                    : 0,
                desconocidos,
                desglose
            }
        };
    } catch (error) {
        return { calorias: 0, meta: { error: "Fallo en el motor" } };
    }
};