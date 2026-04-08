import { Request, Response } from 'express';
import db from '../../db.js';

// 1. AÑADIR O ACTUALIZAR VALORACIÓN
export const valorarReceta = async (req: Request, res: Response) => {
    const { id_receta, puntuacion } = req.body;
    const idUsuarioToken = (req as any).user.id_usuario; // Del Token

    // Validaciones
    if (!id_receta || isNaN(Number(id_receta))) {
        return res.status(400).json({ status: "error", message: "ID de receta no válido." });
    }

    // 🔴 AQUÍ ESTÁ EL CAMBIO: puntuacion < 1 en lugar de puntuacion < 0
    if (puntuacion === undefined || isNaN(Number(puntuacion)) || puntuacion < 1 || puntuacion > 5) {
        return res.status(400).json({ status: "error", message: "La puntuación debe ser un número entre 1 y 5." });
    }

    try {
        // Comprobar si la receta existe
        const [receta]: any = await db.query('SELECT id_receta FROM TReceta WHERE id_receta = ?', [id_receta]);
        if (receta.length === 0) {
            return res.status(404).json({ status: "error", message: "La receta no existe." });
        }

        // MAGIA SQL: "Insertar, pero si ya existe (por la regla UNIQUE), entonces Actualizar"
        const query = `
            INSERT INTO TValoracion (id_usuario, id_receta, puntuacion) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE puntuacion = ?, fecha_valoracion = CURRENT_TIMESTAMP
        `;
        
        await db.query(query, [idUsuarioToken, id_receta, puntuacion, puntuacion]);

        res.json({
            status: "success",
            message: "Valoración guardada correctamente."
        });

    } catch (error: any) {
        console.error("❌ Error al valorar receta:", error);
        res.status(500).json({ status: "error", message: "Error interno al guardar la valoración." });
    }
};

// 2. OBTENER LA MEDIA DE UNA RECETA (Público)
export const obtenerMediaReceta = async (req: Request, res: Response) => {
    const { id_receta } = req.params;

    try {
        const query = `
            SELECT 
                COUNT(*) as total_votos, 
                IFNULL(AVG(puntuacion), 0) as nota_media 
            FROM TValoracion 
            WHERE id_receta = ?
        `;

        const [rows]: any = await db.query(query, [id_receta]);

        res.json({
            status: "success",
            data: {
                total_votos: rows[0].total_votos,
                // Redondeamos a 1 decimal (ej: 4.5)
                nota_media: parseFloat(Number(rows[0].nota_media).toFixed(1)) 
            }
        });

    } catch (error: any) {
        console.error("❌ Error al obtener la media:", error);
        res.status(500).json({ status: "error", message: "Error al calcular la valoración." });
    }
};