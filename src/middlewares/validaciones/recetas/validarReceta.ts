import { Request, Response, NextFunction } from 'express';

export const validarReceta = (req: Request, res: Response, next: NextFunction) => {
    // Usamos 'descripcion' que es como está en tu DB
    const { titulo_receta, ingredientes, tiempo_preparacion } = req.body;

    if (!titulo_receta || !ingredientes || titulo_receta.trim() === "" ) {
        return res.status(400).json({
            status: "error",
            message: "El título y los ingredientes son obligatorios."
        });
    }

    if (titulo_receta.length < 5) {
        return res.status(400).json({
            status: "error",
            message: "El título debe tener al menos 5 caracteres."
        });
    }

    // El tiempo en form-data llega como string, Number() lo arregla
    if (tiempo_preparacion && isNaN(Number(tiempo_preparacion))) {
        return res.status(400).json({
            status: "error",
            message: "El tiempo de preparación debe ser un número."
        });
    }

    next();
};