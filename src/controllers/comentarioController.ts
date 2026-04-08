import { Request, Response } from 'express';
import db from '../../db.js';

export const listarComentariosPorReceta = async (req: Request, res: Response) => {
    const { id_receta } = req.params;

    // 1. Atrapamos los parámetros de paginación
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    try {
        // 2. Contamos el total de comentarios PERO solo de esta receta
        const [totalRows]: any = await db.query(
            'SELECT COUNT(*) as total FROM TComentario WHERE id_receta = ?', 
            [id_receta]
        );
        const totalComentarios = totalRows[0].total;
        const totalPages = Math.ceil(totalComentarios / limit);

        // 3. Traemos el comentario + datos del autor aplicando LIMIT y OFFSET
        const query = `
            SELECT c.*, u.nombre_usuario, u.imagen_perfil 
            FROM TComentario c
            JOIN TUsuario u ON c.id_usuario = u.id_usuario
            WHERE c.id_receta = ?
            ORDER BY c.fecha_comentario DESC
            LIMIT ? OFFSET ?`; 

        const [rows]: any = await db.query(query, [id_receta, limit, offset]);

        // 4. Devolvemos la respuesta con la estructura unificada
        res.json({
            status: "success",
            data: rows,
            paginacion: {
                total_comentarios: totalComentarios,
                total_paginas: totalPages,
                pagina_actual: page,
                comentarios_por_pagina: limit
            }
        });

    } catch (error: any) {
        console.error("❌ Error al listar comentarios:", error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener los comentarios."
        });
    }
};

export const modificarComentario = async (req: Request, res: Response) => {
    const { id } = req.params; 
    const { mensaje } = req.body; // CORREGIDO: Ahora sacamos 'mensaje' del body
    const idUsuarioToken = (req as any).user.id_usuario; 

    // 1. Validación de entrada
    if (!mensaje || mensaje.trim().length === 0) {
        return res.status(400).json({ 
            status: "error", 
            message: "El mensaje del comentario no puede estar vacío." 
        });
    }

    try {
        // 2. Validación de Existencia y Propiedad
        const [rows]: any = await db.query(
            'SELECT id_usuario FROM TComentario WHERE id_comentario = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ 
                status: "error", 
                message: "El comentario que intentas editar no existe." 
            });
        }

        if (rows[0].id_usuario !== idUsuarioToken) {
            return res.status(403).json({ 
                status: "error", 
                message: "Acceso denegado: No puedes editar un comentario que no es tuyo." 
            });
        }

        // 3. UPDATE: Corregido para que solo actualice 'mensaje'
        const query = 'UPDATE TComentario SET mensaje = ? WHERE id_comentario = ?';
        await db.query(query, [mensaje, id]);

        res.json({
            status: "success",
            message: "Comentario actualizado con éxito."
        });

    } catch (error: any) {
        console.error("❌ Error en validación/modificación:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Error interno al procesar la solicitud." 
        });
    }
};

export const eliminarComentario = async (req: Request, res: Response) => {
    const { id } = req.params; 
    const idUsuarioToken = (req as any).user.id_usuario; 

    try {
        const [rows]: any = await db.query(
            'SELECT id_usuario FROM TComentario WHERE id_comentario = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ 
                status: "error", 
                message: "El comentario no existe o ya fue eliminado." 
            });
        }

        if (rows[0].id_usuario !== idUsuarioToken) {
            return res.status(403).json({ 
                status: "error", 
                message: "No tienes permiso para eliminar un comentario que no es tuyo." 
            });
        }

        await db.query('DELETE FROM TComentario WHERE id_comentario = ?', [id]);

        res.json({
            status: "success",
            message: "Comentario eliminado correctamente."
        });

    } catch (error: any) {
        console.error("❌ Error al eliminar comentario:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Error interno del servidor al intentar eliminar." 
        });
    }
};

export const crearComentario = async (req: Request, res: Response) => {
    const { id_receta, mensaje } = req.body;
    const idUsuarioToken = (req as any).user.id_usuario;

    if (!id_receta || isNaN(Number(id_receta))) {
        return res.status(400).json({ status: "error", message: "ID de receta no válido." });
    }

    if (!mensaje || mensaje.trim().length === 0) {
        return res.status(400).json({ status: "error", message: "El comentario no puede estar vacío." });
    }

    if (mensaje.length > 500) {
        return res.status(400).json({ status: "error", message: "El comentario es demasiado largo (máximo 500 caracteres)." });
    }

    try {
        const [receta]: any = await db.query('SELECT id_receta FROM TReceta WHERE id_receta = ?', [id_receta]);
        
        if (receta.length === 0) {
            return res.status(404).json({ status: "error", message: "No puedes comentar en una receta que no existe." });
        }

        const [duplicado]: any = await db.query(
            'SELECT id_comentario FROM TComentario WHERE id_usuario = ? AND id_receta = ? AND mensaje = ? AND fecha_comentario > NOW() - INTERVAL 1 MINUTE',
            [idUsuarioToken, id_receta, mensaje.trim()]
        );

        if (duplicado.length > 0) {
            return res.status(429).json({ status: "error", message: "Estás enviando comentarios demasiado rápido o repetidos." });
        }

        const query = 'INSERT INTO TComentario (id_receta, id_usuario, mensaje) VALUES (?, ?, ?)';
        const [result]: any = await db.query(query, [id_receta, idUsuarioToken, mensaje.trim()]);

        res.status(201).json({
            status: "success",
            message: "Comentario publicado con éxito.",
            id_comentario: result.insertId
        });

    } catch (error: any) {
        console.error("❌ Error al crear comentario:", error);
        res.status(500).json({ status: "error", message: "Error interno al publicar el comentario." });
    }
};