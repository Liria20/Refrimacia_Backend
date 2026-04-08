import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../../db.js';


export const validarToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ status: "error", message: "No se proporcionó un token." });
    }

    try {
        // 1. Verificamos si el token es válido (firma y tiempo)
        const verificado: any = jwt.verify(token, process.env.JWT_SECRET as string);

        // 2. Comprobamos si es el ÚLTIMO token generado (Sesión única)
        const [rows]: any = await db.query(
            'SELECT ultimo_token FROM TUsuario WHERE id_usuario = ?', 
            [verificado.id_usuario]
        );

        if (rows.length === 0 || rows[0].ultimo_token !== token) {
            return res.status(401).json({ 
                status: "error", 
                message: "Esta sesión ya no es válida. Se ha iniciado sesión en otro dispositivo." 
            });
        }

        // Si todo coincide, guardamos el usuario en la request y seguimos
        (req as any).user = verificado;
        next();

    } catch (error) {
        return res.status(401).json({ status: "error", message: "Token inválido o expirado." });
    }
};