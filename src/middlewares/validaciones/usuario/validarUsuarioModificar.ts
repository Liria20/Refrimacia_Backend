import { Request, Response, NextFunction } from 'express';

export const validarUsuarioModificar = (req: Request, res: Response, next: NextFunction) => {
    const { nombre_usuario, correo_electronico, nombre_completo, fecha_nac } = req.body;

    // 1. Evitar que envíen campos vacíos si los envían
    // (nombre_usuario, nombre_completo, correo y fecha_nac suelen ser obligatorios en DB)
    if (nombre_usuario === "" || nombre_completo === "" || correo_electronico === "" || fecha_nac === "") {
        return res.status(400).json({
            status: "error",
            message: "Los campos obligatorios no pueden estar vacíos."
        });
    }

    // 2. Si intentan cambiar el correo, validamos el formato
    if (correo_electronico) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo_electronico)) {
            return res.status(400).json({
                status: "error",
                message: "El formato del nuevo correo electrónico no es válido."
            });
        }
    }

    // 3. Validación de longitud de nombre de usuario (opcional)
    if (nombre_usuario && nombre_usuario.length < 3) {
        return res.status(400).json({
            status: "error",
            message: "El nombre de usuario debe tener al menos 3 caracteres."
        });
    }

    next();
};