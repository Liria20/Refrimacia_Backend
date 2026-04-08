import { Request, Response, NextFunction } from 'express';

export const validarRegistro = (req: Request, res: Response, next: NextFunction) => {
    const { nombre_usuario, contrasena, correo_electronico, nombre_completo, fecha_nac } = req.body;

    // 1. Validar que no falte ningún campo obligatorio
    if (!nombre_usuario || !contrasena || !correo_electronico || !nombre_completo || !fecha_nac) {
        return res.status(400).json({
            status: "error",
            message: "Faltan campos obligatorios. Debes enviar: nombre_usuario, contrasena, correo_electronico, nombre_completo y fecha_nac."
        });
    }

    // 2. Validar formato de la contraseña
    // Explicación de la Regex:
    // ^(?=.*[A-Z])       -> Al menos una mayúscula
    // (?=.*\d)           -> Al menos un número
    // .{8,}              -> Mínimo 8 caracteres
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(contrasena)) {
        return res.status(400).json({
            status: "error",
            message: "La contraseña es demasiado débil. Debe tener al menos 8 caracteres, una mayúscula y un número."
        });
    }

    // 3. Validar formato básico de email (opcional pero recomendado)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo_electronico)) {
        return res.status(400).json({
            status: "error",
            message: "El formato del correo electrónico no es válido."
        });
    }

    // Si todo está bien, pasamos al controlador
    next();
};