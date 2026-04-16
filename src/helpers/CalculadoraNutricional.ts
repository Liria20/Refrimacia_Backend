// utils/calculadoraNutricional.ts

export const estimarNutricion = (ingredientesStr: string, tipoReceta: string) => {
    let kcalTotales = 0;
    let advertencias: string[] = [];

    // Pasamos todo a minúsculas para que sea fácil buscar
    const ingredientes = ingredientesStr.toLowerCase();

    // 1. DICCIONARIO DE CALORÍAS (Estimación por ración media)
    const baseKcal = 150; // Calorías base que tiene cualquier plato por defecto
    kcalTotales += baseKcal;

    // Proteínas y grasas fuertes
    if (ingredientes.includes('aceite')) kcalTotales += 120;
    if (ingredientes.includes('mantequilla') || ingredientes.includes('nata')) { kcalTotales += 150; advertencias.push('Grasas saturadas'); }
    if (ingredientes.includes('queso')) kcalTotales += 100;
    if (ingredientes.includes('chorizo') || ingredientes.includes('panceta') || ingredientes.includes('bacon')) { kcalTotales += 200; advertencias.push('Ultraprocesado'); }
    if (ingredientes.includes('pollo') || ingredientes.includes('ternera') || ingredientes.includes('cerdo')) kcalTotales += 150;
    if (ingredientes.includes('salmón') || ingredientes.includes('atún')) kcalTotales += 120;
    if (ingredientes.includes('huevo')) kcalTotales += 80;

    // Carbohidratos
    if (ingredientes.includes('patata') || ingredientes.includes('boniato')) kcalTotales += 130;
    if (ingredientes.includes('arroz') || ingredientes.includes('pasta') || ingredientes.includes('fideo') || ingredientes.includes('macarrones')) kcalTotales += 180;
    if (ingredientes.includes('pan') || ingredientes.includes('harina') || ingredientes.includes('galleta')) kcalTotales += 120;
    if (ingredientes.includes('azúcar') || ingredientes.includes('miel') || ingredientes.includes('chocolate')) { kcalTotales += 150; advertencias.push('Alto en azúcares'); }

    // Verduras (suman muy poquito)
    if (ingredientes.includes('tomate') || ingredientes.includes('cebolla') || ingredientes.includes('ajo') || ingredientes.includes('zanahoria') || ingredientes.includes('lechuga') || ingredientes.includes('calabacín')) {
        kcalTotales += 30;
    }

    // 2. LÓGICA DE CONSUMO HABITUAL
    let consumo = "Consumo habitual (3-4 veces por semana)";

    // Si tiene cosas pesadas o es un postre
    if (advertencias.includes('Alto en azúcares') || advertencias.includes('Ultraprocesado') || advertencias.includes('Grasas saturadas')) {
        consumo = "Consumo ocasional (1 vez por semana)";
    } 
    // Los postres y snacks por defecto se recomiendan menos
    else if (tipoReceta === 'Postre' || tipoReceta === 'Snack') {
        consumo = "Consumo moderado (1-2 veces por semana)";
    }
    // Si no tiene grasas malas y es bajito en calorías
    else if (kcalTotales < 350) {
        consumo = "Consumo diario o frecuente";
    }

    // Redondeamos para que no queden números feos como "312 kcal" sino "310 kcal"
    const kcalRedondeadas = Math.round(kcalTotales / 10) * 10;

    return {
        calorias: kcalRedondeadas,
        consumo_recomendado: consumo
    };
};