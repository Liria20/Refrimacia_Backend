import { Request, Response, NextFunction } from 'express';

export const validarUsuarioModificar = (req: Request, res: Response, next: NextFunction) => {
    const { nombre_usuario, nombre_completo, fecha_nac } = req.body;

    // Solo validamos si el campo está presente (no es undefined)
    if (nombre_usuario !== undefined && nombre_usuario.trim() === "") {
        return res.status(400).json({
            status: "error",
            message: "El nombre de usuario no puede ser un texto vacío."
        });
    }

    if (nombre_completo !== undefined && nombre_completo.trim() === "") {
        return res.status(400).json({
            status: "error",
            message: "El nombre completo no puede ser un texto vacío."
        });
    }

    if (fecha_nac) {
        const fecha = new Date(fecha_nac);
        if (isNaN(fecha.getTime())) {
            return res.status(400).json({
                status: "error",
                message: "La fecha de nacimiento proporcionada no es válida."
            });
        }
    }

    next();
};