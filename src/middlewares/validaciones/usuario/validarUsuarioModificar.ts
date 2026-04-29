import { Request, Response, NextFunction } from 'express';

export const validarUsuarioModificar = (req: Request, res: Response, next: NextFunction) => {
    const { nombre_usuario, nombre_completo, fecha_nac } = req.body;

    // 1. 🟢 Eliminamos 'correo_electronico' de aquí porque ya no lo editamos en esta ruta.

    // 2. 🛡️ Validación más robusta (comprobamos que no sea solo espacios en blanco)
    // Usamos .trim() para evitar que alguien ponga " " como nombre.
    if (nombre_usuario !== undefined && nombre_usuario.trim() === "") {
        return res.status(400).json({
            status: "error",
            message: "El nombre de usuario no puede estar vacío."
        });
    }

    if (nombre_completo !== undefined && nombre_completo.trim() === "") {
        return res.status(400).json({
            status: "error",
            message: "El nombre completo no puede estar vacío."
        });
    }

    // 3. 📅 Validación opcional de fecha (solo si viene en el body)
    if (fecha_nac) {
        const fecha = new Date(fecha_nac);
        if (isNaN(fecha.getTime())) {
            return res.status(400).json({
                status: "error",
                message: "La fecha de nacimiento no es válida."
            });
        }
    }

    next();
};