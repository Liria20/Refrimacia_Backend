import { Request, Response } from 'express';
import db from '../../db.js';

export const listarRecetas = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT r.*, u.nombre_usuario 
            FROM TReceta r
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            ORDER BY r.id_receta DESC`;
            
        const [rows] = await db.query(query);
        res.json({ status: "success", data: rows });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: "Error al obtener recetas" });
    }
};

export const obtenerRecetaPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT r.*, u.nombre_usuario as autor 
            FROM TReceta r
            LEFT JOIN TUsuario u ON r.id_usuario = u.id_usuario
            WHERE r.id_receta = ?`;
        const [rows]: any = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ status: "error", message: "La receta no existe." });
        }
        res.json({ status: "success", data: rows[0] });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: "Error al obtener los detalles." });
    }
};

export const crearReceta = async (req: Request, res: Response) => {
    const id_usuario_token = (req as any).user.id_usuario;
    const { titulo_receta, descripcion, ingredientes, tipo_receta } = req.body;

    if (!titulo_receta || !ingredientes) {
        return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
    }

    // 1️⃣ CAMBIO AQUÍ: La imagen ya no viene del body, viene de Multer (req.file)
    const imagen_final = req.file ? `/uploads/recetas/${req.file.filename}` : null;

    try {
        const query = `
            INSERT INTO TReceta 
            (titulo_receta, descripcion, ingredientes, tipo_receta, imagen_receta, id_usuario) 
            VALUES (?, ?, ?, ?, ?, ?)`;

        const [result]: any = await db.query(query, [
            titulo_receta, 
            descripcion || null, 
            ingredientes, 
            tipo_receta || 'General', 
            imagen_final, // Usamos la ruta del archivo
            id_usuario_token 
        ]);

        res.status(201).json({
            status: "success",
            message: "¡Receta publicada con éxito!",
            id_receta: result.insertId
        });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const modificarReceta = async (req: Request, res: Response) => {
    const { id } = req.params;
    const id_usuario_token = (req as any).user.id_usuario;
    const { titulo_receta, descripcion, ingredientes, tipo_receta, imagen_receta } = req.body;

    try {
        const [receta]: any = await db.query('SELECT id_usuario FROM TReceta WHERE id_receta = ?', [id]);
        if (receta.length === 0 || receta[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ status: "error", message: "No tienes permiso o no existe" });
        }

        const imagen_final = req.file ? `/uploads/recetas/${req.file.filename}` : imagen_receta;

        const query = `
            UPDATE TReceta 
            SET titulo_receta = ?, descripcion = ?, ingredientes = ?, tipo_receta = ?, imagen_receta = ? 
            WHERE id_receta = ?`;

        await db.query(query, [titulo_receta, descripcion, ingredientes, tipo_receta, imagen_final, id]);
        res.json({ status: "success", message: "Receta actualizada correctamente" });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const eliminarReceta = async (req: Request, res: Response) => {
    const { id } = req.params;
    const id_usuario_token = (req as any).user.id_usuario;
    try {
        const [result]: any = await db.query('DELETE FROM TReceta WHERE id_receta = ? AND id_usuario = ?', [id, id_usuario_token]);
        if (result.affectedRows === 0) return res.status(403).json({ status: "error", message: "Error al eliminar" });
        res.json({ status: "success", message: "Receta eliminada correctamente." });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const buscarPorIngredientes = async (req: Request, res: Response) => {
    const { ingredientes } = req.query;
    try {
        let query = `SELECT r.*, u.nombre_usuario as autor FROM TReceta r JOIN TUsuario u ON r.id_usuario = u.id_usuario`;
        const params: any[] = [];
        if (ingredientes) {
            const palabras = (ingredientes as string).toLowerCase().replace(/,/g, ' ').split(/\s+/).filter(p => p.length > 2);
            if (palabras.length > 0) {
                const condiciones = palabras.map(() => `r.ingredientes LIKE ?`).join(' AND ');
                query += ` WHERE ${condiciones}`;
                palabras.forEach(p => params.push(`%${p}%`));
            }
        }
        query += ` ORDER BY r.fecha_publicacion DESC`;
        const [rows]: any = await db.query(query, params);
        res.json({ status: "success", count: rows.length, data: rows });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: "Error en el buscador." });
    }
};

export const obtenerRecetaParaCompartir = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const query = `SELECT r.*, u.nombre_usuario FROM TReceta r JOIN TUsuario u ON r.id_usuario = u.id_usuario WHERE r.id_receta = ?`;
        const [rows]: any = await db.query(query, [id]);
        if (rows.length === 0) return res.status(404).json({ status: "error", message: "No encontrada." });
        
        const receta = rows[0];
        res.json({
            status: "success",
            data: {
                enlace: `refrimancia://receta/${receta.id_receta}`,
                titulo: receta.titulo_receta,
                autor: receta.nombre_usuario,
                imagen: receta.imagen_receta,
                texto_compartir: `¡Mira esta receta de ${receta.titulo_receta} en RefriMancia! 😋`
            }
        });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: "Error al preparar compartido." });
    }
};

export const obtenerMenuDelDia = async (req: Request, res: Response) => {
    try {
        const query = `SELECT * FROM TReceta ORDER BY RAND() LIMIT 2`;
        const [recetas]: any = await db.query(query);

        if (recetas.length < 2) {
            return res.status(404).json({ status: "error", message: "Faltan recetas." });
        }

        res.json({
            status: "success",
            data: {
                almuerzo: recetas[0].titulo_receta,
                cena: recetas[1].titulo_receta
            }
        });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: "Error en el oráculo." });
    }
};