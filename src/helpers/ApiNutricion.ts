// helpers/ApiNutricion.ts

interface IngredienteDB {
    palabras: string[];
    puntos: number; // Sano: +2, Moderado: +1, Procesado: -2
}

const BASE_DATOS_INGREDIENTES: IngredienteDB[] = [
    // +2 PUNTOS: Superalimentos y bases sanas
    { palabras: ['tomate', 'cebolla', 'ajo', 'pimiento', 'lechuga', 'zanahoria', 'calabacin', 'champinon', 'berenjena', 'verdura', 'manzana', 'platano', 'naranja', 'pera', 'fresa', 'limon', 'uva', 'pina', 'fruta', 'arandano', 'frambuesa', 'mora', 'kiwi'], puntos: 2 },
    
    // +1 PUNTO: Proteínas y carbohidratos complejos
    { palabras: ['pollo', 'pavo', 'pechuga', 'merluza', 'bacalao', 'pulpo', 'sepia', 'clara', 'arroz', 'pasta', 'quinoa', 'avena', 'legumbre', 'lenteja', 'garbanzo', 'judia', 'huevo', 'huevos', 'salmon', 'atun', 'sardina'], puntos: 1 },
    
    // 0 PUNTOS: Alimentos neutros o que requieren control (grasas/panes)
    { palabras: ['aceite', 'aguacate', 'nuez', 'almendra', 'cacahuete', 'pistacho', 'nueces', 'ternera', 'cerdo', 'cordero', 'pan', 'baguette', 'barra', 'tostada', 'queso', 'leche', 'yogur', 'kefir'], puntos: 0 },

    // -2 PUNTOS: Procesados o azúcares
    { palabras: ['azucar', 'miel', 'chocolate', 'galleta', 'cacao', 'sirope', 'caramelo', 'chorizo', 'panceta', 'bacon', 'salchicha', 'morcilla', 'salami', 'fuet', 'hamburguesa', 'mantequilla', 'margarina', 'nata', 'manteca'], puntos: -2 }
];

const normalizar = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const obtenerNutricionDesdeAPI = async (ingredientesStr: string, tipoReceta: string, descripcion?: string) => {
    try {
        const textoCompleto = normalizar(ingredientesStr + " " + (descripcion || "") + " " + tipoReceta);
        const esFritura = /(frit|frie|frii|freir|rebozad|empanad|tempura)/i.test(textoCompleto);
        
        const listaIngredientes = ingredientesStr.split(/,| y /i).map(i => i.trim());
        
        let scoreTotal = 0;
        let ingredientesConCantidad = 0;
        let totalDetectados = 0;

        listaIngredientes.forEach(item => {
            const itemNorm = normalizar(item);
            const tieneCantidad = /[\d]/.test(itemNorm) || /(pizca|chorrito|punado)/i.test(itemNorm);
            
            const alimento = BASE_DATOS_INGREDIENTES.find(db => 
                db.palabras.some(p => itemNorm.includes(normalizar(p)))
            );

            if (alimento) {
                scoreTotal += alimento.puntos;
                totalDetectados++;
                if (tieneCantidad) ingredientesConCantidad++;
            }
        });

        // 🟢 LÓGICA DE 5 COLORES + GRIS
        let consumo = "";
        let color = "";

        // 1. Caso Gris (Falta información)
        if (ingredientesConCantidad === 0) {
            return { consumo_recomendado: "Indeterminado (Faltan cantidades)", semaforo: "gris" };
        }

        // 2. Penalización por técnica (La fritura baja el score drásticamente)
        if (esFritura) scoreTotal -= 5;

        // 3. Clasificación por Score Final
        if (scoreTotal >= 5) {
            consumo = "Excelente (Consumo diario)";
            color = "verde_oscuro";
        } 
        else if (scoreTotal >= 2) {
            consumo = "Saludable (Consumo habitual)";
            color = "verde_claro";
        } 
        else if (scoreTotal >= 0) {
            consumo = "Equilibrado (Consumo moderado)";
            color = "amarillo";
        }
        else if (scoreTotal >= -3) {
            consumo = "Limitado (Consumo semanal)";
            color = "naranja";
        }
        else {
            consumo = "Ocasional (Consumo muy esporádico)";
            color = "rojo";
        }

        return { consumo_recomendado: consumo, semaforo: color };

    } catch (error) {
        return { consumo_recomendado: "Indeterminado", semaforo: "gris" };
    }
};