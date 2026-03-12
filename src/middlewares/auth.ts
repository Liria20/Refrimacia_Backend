import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const validarToken = (req: Request, res: Response, next: NextFunction) => {
    // El token suele venir en el header "Authorization" como "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ 
            status: "error", 
            message: "Acceso denegado. No se proporcionó un token." 
        });
    }

    try {
        // Verificamos si el token es válido y no ha caducado
        const verificado = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = verificado; // Guardamos los datos del usuario para el siguiente paso
        next(); // ¡Todo bien! Pasamos al controlador
    } catch (error) {
        res.status(401).json({ 
            status: "error", 
            message: "Token inválido o caducado. Inicie sesión de nuevo." 
        });
    }
};