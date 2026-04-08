import { Request, Response, NextFunction } from 'express';

export const validarLogin = (req: Request, res: Response, next: NextFunction) => {
    const { correo_electronico, contrasena } = req.body;

    // 1. Validar que existan ambos campos
    if (!correo_electronico || !contrasena) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos. Debes enviar 'correo_electronico' y 'contrasena'."
        });
    }

    // 2. Validar formato de email (para no buscar basura en la DB)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_electronico)) {
        return res.status(400).json({
            status: "error",
            message: "El formato del correo electrónico no es válido."
        });
    }

    next();
};