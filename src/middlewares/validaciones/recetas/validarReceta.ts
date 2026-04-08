import { Request, Response, NextFunction } from 'express';

export const validarReceta = (req: Request, res: Response, next: NextFunction) => {
    const { titulo_receta, ingredientes, instrucciones, tiempo_preparacion } = req.body;

    // 1. Campos obligatorios
    if (!titulo_receta || !ingredientes) {
        return res.status(400).json({
            status: "error",
            message: "El título y los ingredientes son obligatorios."
        });
    }

    // 2. Longitud mínima del título (para evitar títulos basura)
    if (titulo_receta.length < 5) {
        return res.status(400).json({
            status: "error",
            message: "El título de la receta debe tener al menos 5 caracteres."
        });
    }

    // 3. Validar que el tiempo de preparación sea un número si se envía
    if (tiempo_preparacion && isNaN(Number(tiempo_preparacion))) {
        return res.status(400).json({
            status: "error",
            message: "El tiempo de preparación debe ser un número (minutos)."
        });
    }

    next();
};