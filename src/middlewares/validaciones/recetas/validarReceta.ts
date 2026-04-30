import { Request, Response, NextFunction } from 'express';

export const validarReceta = (req: Request, res: Response, next: NextFunction) => {
    const { titulo_receta, ingredientes, tiempo_preparacion } = req.body;

    // Validar título solo si se envía
    if (titulo_receta !== undefined) {
        if (titulo_receta.trim() === "" || titulo_receta.length < 5) {
            return res.status(400).json({
                status: "error",
                message: "El título debe tener al menos 5 caracteres y no puede estar vacío."
            });
        }
    }

    // Validar ingredientes solo si se envían
    if (ingredientes !== undefined) {
        if (ingredientes.trim() === "") {
            return res.status(400).json({
                status: "error",
                message: "Los ingredientes no pueden estar vacíos."
            });
        }
    }

    // Validar tiempo solo si se envía
    if (tiempo_preparacion !== undefined) {
        if (isNaN(Number(tiempo_preparacion))) {
            return res.status(400).json({
                status: "error",
                message: "El tiempo de preparación debe ser un número válido."
            });
        }
    }

    next();
};