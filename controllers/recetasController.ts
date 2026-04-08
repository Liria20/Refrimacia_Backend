import { Request, Response } from 'express';
import db from '../db.js';

export const listarRecetas = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM RECETA');
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: "Error al obtener recetas" });
    }
};

export const crearReceta = async (req: Request, res: Response) => {
    const { 
        titulo_receta, 
        descripcion, 
        instrucciones, 
        ingredientes, 
        tiempo_preparacion, 
        tipo_receta, 
        imagen_receta, 
        id_usuario 
    } = req.body;

    // Validación mínima: Título, ingredientes e ID de usuario son clave
    if (!titulo_receta || !ingredientes || !id_usuario) {
        return res.status(400).json({ 
            status: "error", 
            message: "Faltan campos obligatorios (título, ingredientes o id_usuario)" 
        });
    }

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
            imagen_receta || null, 
            id_usuario
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