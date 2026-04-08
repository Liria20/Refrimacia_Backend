import { Request, Response, NextFunction } from 'express';

export const validarUsuarioModificar = (req: Request, res: Response, next: NextFunction) => {
    const { nombre_usuario, correo_electronico, nombre_completo, fecha_nac } = req.body;

    // Validamos que si envían los campos, no estén vacíos
    if (nombre_usuario === "" || nombre_completo === "" || correo_electronico === "") {
        return res.status(400).json({
            status: "error",
            message: "Los campos obligatorios no pueden estar vacíos."
        });
    }

    if (correo_electronico) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo_electronico)) {
            return res.status(400).json({
                status: "error",
                message: "Formato de correo inválido."
            });
        }
    }

    next();
};