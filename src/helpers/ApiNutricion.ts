// helpers/ApiNutricion.ts

interface IngredienteDB {
    palabras: string[];
    categoria: 'Sano' | 'Neutro' | 'Moderado' | 'Procesado';
    advertencia?: string;
}

// 1. BASE DE DATOS BASADA EN CALIDAD (NO EN KCAL)
const BASE_DATOS_INGREDIENTES: IngredienteDB[] = [
    // 🟢 SALUDABLES (Base de la pirámide)
    { palabras: ['tomate', 'cebolla', 'ajo', 'pimiento', 'lechuga', 'zanahoria', 'calabacin', 'champinon', 'berenjena', 'verdura'], categoria: 'Sano' },
    { palabras: ['manzana', 'platano', 'naranja', 'pera', 'fresa', 'limon', 'uva', 'pina', 'fruta', 'arandano', 'frambuesa'], categoria: 'Sano' },
    { palabras: ['pollo', 'pavo', 'pechuga', 'merluza', 'bacalao', 'pulpo', 'sepia', 'clara'], categoria: 'Sano' },
    { palabras: ['arroz', 'pasta', 'quinoa', 'avena', 'legumbre', 'lenteja', 'garbanzo', 'ubia'], categoria: 'Sano' },

    // 🟡 NEUTROS / MODERADOS (Saludables pero calóricos o con grasas)
    { palabras: ['aceite', 'aguacate', 'nuez', 'almendra', 'cacahuete', 'pistacho', 'nueces'], categoria: 'Moderado', advertencia: 'Grasas saludables pero calóricas' },
    { palabras: ['huevo', 'huevos', 'salmon', 'atun', 'sardina', 'ternera', 'cerdo', 'cordero'], categoria: 'Moderado' },
    { palabras: ['pan', 'baguette', 'barra', 'tostada', 'queso', 'leche', 'yogur'], categoria: 'Moderado' },

    // 🔴 PROCESADOS O ALTOS EN AZÚCAR/GRASA SATURADA
    { palabras: ['azucar', 'miel', 'chocolate', 'galleta', 'cacao', 'sirope', 'caramelo'], categoria: 'Procesado', advertencia: 'Alto en azúcares' },
    { palabras: ['chorizo', 'panceta', 'bacon', 'salchicha', 'morcilla', 'salami', 'fuet', 'hamburguesa'], categoria: 'Procesado', advertencia: 'Carne procesada' },
    { palabras: ['mantequilla', 'margarina', 'nata', 'manteca'], categoria: 'Procesado', advertencia: 'Grasas saturadas' }
];

const normalizar = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const obtenerNutricionDesdeAPI = async (ingredientesStr: string, tipoReceta: string, descripcion?: string) => {
    try {
        const textoCompleto = normalizar(ingredientesStr + " " + (descripcion || "") + " " + tipoReceta);
        
        // 1. DETECTAR TÉCNICA (Fritura es el "Red Flag" principal)
        const esFritura = /(frit|frie|frii|freir|rebozad|empanad|tempura)/i.test(textoCompleto);
        
        const listaIngredientes = ingredientesStr.split(/,| y /i).map(i => i.trim());
        
        let conteoCategorias = { Sano: 0, Neutro: 0, Moderado: 0, Procesado: 0 };
        let advertenciasFinales = new Set<string>();

        // 2. ANALIZAR CALIDAD DE INGREDIENTES
        listaIngredientes.forEach(item => {
            const nombreLimpio = normalizar(item);
            const alimento = BASE_DATOS_INGREDIENTES.find(db => 
                db.palabras.some(p => nombreLimpio.includes(normalizar(p)))
            );

            if (alimento) {
                conteoCategorias[alimento.categoria]++;
                if (alimento.advertencia) advertenciasFinales.add(alimento.advertencia);
            }
        });

        // 3. LÓGICA DE CONSUMO (EL SEMÁFORO)
        let consumo = "Consumo habitual (Diario)";
        let color = "verde";

        // REGLA 1: Si es frito -> Siempre ocasional
        if (esFritura) {
            consumo = "Consumo ocasional (Máx. 1 vez/semana)";
            color = "rojo";
        } 
        // REGLA 2: Si tiene ingredientes procesados (embutidos, azúcares...)
        else if (conteoCategorias.Procesado > 0) {
            consumo = "Consumo ocasional (Por ingredientes procesados)";
            color = "rojo";
        }
        // REGLA 3: Si es equilibrado pero tiene ingredientes que requieren moderación (quesos, carnes rojas)
        else if (conteoCategorias.Moderado > 2) {
            consumo = "Consumo moderado (3-4 veces/semana)";
            color = "amarillo";
        }
        // REGLA 4: Si es mayoritariamente sano
        else if (conteoCategorias.Sano >= conteoCategorias.Moderado) {
            consumo = "Consumo habitual (Recomendado)";
            color = "verde";
        }

        // Devolvemos una "estimación" de calorías muy genérica para no dejar el campo vacío, 
        // pero avisamos que es orientativa.
        return {
            calorias: "Ver desglose", 
            consumo_recomendado: consumo,
            semaforo: color,
            detalles: Array.from(advertenciasFinales)
        };

    } catch (error) {
        return { calorias: "---", consumo_recomendado: "Indeterminado" };
    }
};