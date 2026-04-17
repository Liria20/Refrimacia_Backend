// helpers/ApiNutricion.ts

interface IngredienteDB {
    palabras: string[];
    categoria: 'Sano' | 'Neutro' | 'Moderado' | 'Procesado';
    advertencia?: string;
}

const BASE_DATOS_INGREDIENTES: IngredienteDB[] = [
    { palabras: ['tomate', 'cebolla', 'ajo', 'pimiento', 'lechuga', 'zanahoria', 'calabacin', 'champinon', 'berenjena', 'verdura'], categoria: 'Sano' },
    { palabras: ['manzana', 'platano', 'naranja', 'pera', 'fresa', 'limon', 'uva', 'pina', 'fruta', 'arandano', 'frambuesa', 'mora', 'kiwi'], categoria: 'Sano' },
    { palabras: ['pollo', 'pavo', 'pechuga', 'merluza', 'bacalao', 'pulpo', 'sepia', 'clara'], categoria: 'Sano' },
    { palabras: ['arroz', 'pasta', 'quinoa', 'avena', 'legumbre', 'lenteja', 'garbanzo', 'judia'], categoria: 'Sano' },
    { palabras: ['aceite', 'aguacate', 'nuez', 'almendra', 'cacahuete', 'pistacho', 'nueces'], categoria: 'Moderado', advertencia: 'Grasas saludables' },
    { palabras: ['huevo', 'huevos', 'salmon', 'atun', 'sardina', 'ternera', 'cerdo', 'cordero'], categoria: 'Moderado' },
    { palabras: ['pan', 'baguette', 'barra', 'tostada', 'queso', 'leche', 'yogur', 'kefir'], categoria: 'Moderado' },
    { palabras: ['azucar', 'miel', 'chocolate', 'galleta', 'cacao', 'sirope', 'caramelo'], categoria: 'Procesado', advertencia: 'Alto en azúcares' },
    { palabras: ['chorizo', 'panceta', 'bacon', 'salchicha', 'morcilla', 'salami', 'fuet', 'hamburguesa'], categoria: 'Procesado', advertencia: 'Carne procesada' },
    { palabras: ['mantequilla', 'margarina', 'nata', 'manteca'], categoria: 'Procesado', advertencia: 'Grasas saturadas' }
];

const normalizar = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const obtenerNutricionDesdeAPI = async (ingredientesStr: string, tipoReceta: string, descripcion?: string) => {
    try {
        const textoCompleto = normalizar(ingredientesStr + " " + (descripcion || "") + " " + tipoReceta);
        const esFritura = /(frit|frie|frii|freir|rebozad|empanad|tempura)/i.test(textoCompleto);
        
        const listaIngredientes = ingredientesStr.split(/,| y /i).map(i => i.trim());
        
        let conteoCategorias = { Sano: 0, Neutro: 0, Moderado: 0, Procesado: 0 };
        let advertenciasFinales = new Set<string>();
        let ingredientesConCantidad = 0;

        // 1. ANALIZAR CALIDAD E INTENCIÓN DE CANTIDADES
        listaIngredientes.forEach(item => {
            const itemNorm = normalizar(item);
            
            // Verificamos si el ingrediente tiene algún número o medida coloquial
            // Detecta: "100g", "1/2", "(125g)", "pizca", "chorrito"
            const tieneCantidad = /[\d]/.test(itemNorm) || /(pizca|chorrito|punado)/i.test(itemNorm);
            
            const alimento = BASE_DATOS_INGREDIENTES.find(db => 
                db.palabras.some(p => itemNorm.includes(normalizar(p)))
            );

            if (alimento) {
                conteoCategorias[alimento.categoria]++;
                if (alimento.advertencia) advertenciasFinales.add(alimento.advertencia);
                if (tieneCantidad) ingredientesConCantidad++;
            }
        });

        // 2. LÓGICA DE CONSUMO (CON FILTRO DE CANTIDADES)
        let consumo = "";
        let color = "";

        // 🔴 CASO ESPECIAL: Si no se detectan cantidades en la mayoría de ingredientes
        if (ingredientesConCantidad === 0) {
            consumo = "Indeterminado (Faltan cantidades)";
            color = "gris";
        } 
        // 🔴 REGLA 1: Fritura
        else if (esFritura) {
            consumo = "Consumo ocasional (Técnica de fritura)";
            color = "rojo";
        } 
        // 🔴 REGLA 2: Procesados
        else if (conteoCategorias.Procesado > 0) {
            consumo = "Consumo ocasional (Ingredientes procesados)";
            color = "rojo";
        }
        // 🟡 REGLA 3: Moderación
        else if (conteoCategorias.Moderado > 2) {
            consumo = "Consumo moderado (Ingredientes calóricos)";
            color = "amarillo";
        }
        // 🟢 REGLA 4: Saludable
        else {
            consumo = "Consumo habitual (Ingredientes saludables)";
            color = "verde";
        }

        return {
            consumo_recomendado: consumo,
            semaforo: color,
            detalles: Array.from(advertenciasFinales)
        };

    } catch (error) {
        return { consumo_recomendado: "Indeterminado", semaforo: "gris", detalles: [] };
    }
};