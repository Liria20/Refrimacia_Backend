// helpers/ApiNutricion.ts

interface IngredienteDB {
    palabras: string[];
    categoria: 'Sano' | 'Moderado' | 'Procesado';
}

const BASE_DATOS_INGREDIENTES: IngredienteDB[] = [
    { palabras: ['tomate', 'cebolla', 'ajo', 'pimiento', 'lechuga', 'zanahoria', 'calabacin', 'champinon', 'berenjena', 'verdura'], categoria: 'Sano' },
    { palabras: ['manzana', 'platano', 'naranja', 'pera', 'fresa', 'limon', 'uva', 'pina', 'fruta', 'arandano', 'frambuesa', 'mora', 'kiwi'], categoria: 'Sano' },
    { palabras: ['pollo', 'pavo', 'pechuga', 'merluza', 'bacalao', 'pulpo', 'sepia', 'clara'], categoria: 'Sano' },
    { palabras: ['arroz', 'pasta', 'quinoa', 'avena', 'legumbre', 'lenteja', 'garbanzo', 'judia'], categoria: 'Sano' },
    { palabras: ['aceite', 'aguacate', 'nuez', 'almendra', 'cacahuete', 'pistacho', 'nueces'], categoria: 'Moderado' },
    { palabras: ['huevo', 'huevos', 'salmon', 'atun', 'sardina', 'ternera', 'cerdo', 'cordero'], categoria: 'Moderado' },
    { palabras: ['pan', 'baguette', 'barra', 'tostada', 'queso', 'leche', 'yogur', 'kefir'], categoria: 'Moderado' },
    { palabras: ['azucar', 'miel', 'chocolate', 'galleta', 'cacao', 'sirope', 'caramelo'], categoria: 'Procesado' },
    { palabras: ['chorizo', 'panceta', 'bacon', 'salchicha', 'morcilla', 'salami', 'fuet', 'hamburguesa'], categoria: 'Procesado' },
    { palabras: ['mantequilla', 'margarina', 'nata', 'manteca'], categoria: 'Procesado' }
];

const normalizar = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const obtenerNutricionDesdeAPI = async (ingredientesStr: string, tipoReceta: string, descripcion?: string) => {
    try {
        const textoCompleto = normalizar(ingredientesStr + " " + (descripcion || "") + " " + tipoReceta);
        const esFritura = /(frit|frie|frii|freir|rebozad|empanad|tempura)/i.test(textoCompleto);
        
        const listaIngredientes = ingredientesStr.split(/,| y /i).map(i => i.trim());
        
        let conteoCategorias = { Sano: 0, Moderado: 0, Procesado: 0 };
        let ingredientesConCantidad = 0;

        listaIngredientes.forEach(item => {
            const itemNorm = normalizar(item);
            const tieneCantidad = /[\d]/.test(itemNorm) || /(pizca|chorrito|punado)/i.test(itemNorm);
            
            const alimento = BASE_DATOS_INGREDIENTES.find(db => 
                db.palabras.some(p => itemNorm.includes(normalizar(p)))
            );

            if (alimento) {
                conteoCategorias[alimento.categoria]++;
                if (tieneCantidad) ingredientesConCantidad++;
            }
        });

        let consumo = "";
        let color = "";

        if (ingredientesConCantidad === 0) {
            consumo = "Indeterminado (Faltan cantidades)";
            color = "gris";
        } 
        else if (esFritura || conteoCategorias.Procesado > 0) {
            consumo = "Consumo ocasional";
            color = "rojo";
        } 
        else if (conteoCategorias.Moderado > 2) {
            consumo = "Consumo moderado";
            color = "amarillo";
        }
        else {
            consumo = "Consumo habitual";
            color = "verde";
        }

        return { consumo_recomendado: consumo, semaforo: color };

    } catch (error) {
        return { consumo_recomendado: "Indeterminado", semaforo: "gris" };
    }
};