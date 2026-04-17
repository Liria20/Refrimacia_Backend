import { Request, Response } from 'express';
import db from '../../db.js';
// 🟢 NUEVO: Importamos nuestra conexión a la API de Edamam
import { obtenerNutricionDesdeAPI } from '../helpers/ApiNutricion.js';

const IMAGEN_POR_DEFECTO = "https://cdn-icons-png.flaticon.com/512/857/857681.png";

// --- 🟢 NUEVO: Definimos los tipos válidos para que TypeScript y el Frontend lo sepan ---
export type TipoReceta = 'Desayuno' | 'Almuerzo' | 'Comida' | 'Merienda' | 'Cena' | 'Postre' | 'Snack';
export const TIPOS_VALIDOS: TipoReceta[] = ['Desayuno', 'Almuerzo', 'Comida', 'Merienda', 'Cena', 'Postre', 'Snack'];

export const listarRecetas = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    try {
        const [totalRows]: any = await db.query('SELECT COUNT(*) as total FROM TReceta');
        const totalRecetas = totalRows[0].total;
        const totalPages = Math.ceil(totalRecetas / limit);

        // Añadimos una subconsulta para traer la media de estrellas en el listado
        const query = `
            SELECT r.*, u.nombre_usuario,
            (SELECT IFNULL(AVG(puntuacion), 0) FROM TValoracion WHERE id_receta = r.id_receta) as media_puntuacion
            FROM TReceta r
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            ORDER BY r.id_receta DESC
            LIMIT ? OFFSET ?`;

        const [rows] = await db.query(query, [limit, offset]);

        res.json({
            status: "success",
            data: rows,
            paginacion: {
                total_recetas: totalRecetas,
                total_paginas: totalPages,
                pagina_actual: page,
                recetas_por_pagina: limit
            }
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al obtener recetas" });
    }
};


export const obtenerRecetaPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const queryReceta = `
            SELECT r.*, u.nombre_usuario as autor,
            (SELECT IFNULL(AVG(puntuacion), 0) FROM TValoracion WHERE id_receta = r.id_receta) as media_puntuacion
            FROM TReceta r
            LEFT JOIN TUsuario u ON r.id_usuario = u.id_usuario
            WHERE r.id_receta = ?`;

        const [recetaRows]: any = await db.query(queryReceta, [id]);

        if (recetaRows.length === 0) {
            return res.status(404).json({ status: "error", message: "La receta no existe." });
        }

        const [comentarios]: any = await db.query(
            `SELECT c.*, u.nombre_usuario, u.imagen_perfil 
             FROM TComentario c 
             JOIN TUsuario u ON c.id_usuario = u.id_usuario 
             WHERE c.id_receta = ? ORDER BY c.fecha_comentario DESC`,
            [id]
        );

        const receta = recetaRows[0];
        const nutricion = await obtenerNutricionDesdeAPI(receta.ingredientes, receta.tipo_receta, receta.descripcion);

        res.json({
            status: "success",
            data: {
                ...receta,
                consumo_habitual: nutricion.consumo_recomendado,
                semaforo: nutricion.semaforo,
                comentarios: comentarios
            }
        });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: "Error al obtener los detalles." });
    }
};

export const crearReceta = async (req: Request, res: Response) => {
    const id_usuario_token = (req as any).user.id_usuario;
    // Recuperamos tiempo_preparacion del body
    const { titulo_receta, descripcion, ingredientes, tipo_receta, tiempo_preparacion } = req.body;

    if (!titulo_receta || !ingredientes) {
        return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
    }

    // --- 🟢 NUEVO: Validación estricta del tipo de receta ---
    if (tipo_receta && !TIPOS_VALIDOS.includes(tipo_receta as TipoReceta)) {
        return res.status(400).json({
            status: "error",
            message: `Tipo de receta no válido. Usa: ${TIPOS_VALIDOS.join(', ')}`
        });
    }

    // 🟢 CAMBIO: Usamos la imagen por defecto si no viene archivo
    const imagen_final = req.file ? req.file.path : IMAGEN_POR_DEFECTO;

    try {
        const query = `
            INSERT INTO TReceta 
            (titulo_receta, descripcion, ingredientes, tipo_receta, tiempo_preparacion, imagen_receta, id_usuario) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const [result]: any = await db.query(query, [
            titulo_receta,
            descripcion || null,
            ingredientes,
            tipo_receta || 'Almuerzo', // Cambiado 'General' por 'Almuerzo' para respetar el ENUM
            tiempo_preparacion || 0,
            imagen_final,
            id_usuario_token
        ]);

        res.status(201).json({
            status: "success",
            id_receta: result.insertId,
            foto: imagen_final
        });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const modificarReceta = async (req: Request, res: Response) => {
    const { id } = req.params;
    const id_usuario_token = (req as any).user.id_usuario;
    const { titulo_receta, descripcion, ingredientes, tipo_receta, imagen_receta, tiempo_preparacion } = req.body;

    // --- 🟢 NUEVO: Validación estricta del tipo de receta al modificar ---
    if (tipo_receta && !TIPOS_VALIDOS.includes(tipo_receta as TipoReceta)) {
        return res.status(400).json({
            status: "error",
            message: `Tipo de receta no válido. Usa: ${TIPOS_VALIDOS.join(', ')}`
        });
    }

    try {
        const [receta]: any = await db.query('SELECT id_usuario FROM TReceta WHERE id_receta = ?', [id]);
        if (receta.length === 0 || receta[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ status: "error", message: "No tienes permiso o no existe" });
        }

        // 🟢 CAMBIO: Si no hay archivo nuevo, usamos la imagen vieja, pero si es null, usamos la por defecto
        const imagen_final = req.file ? req.file.path : (imagen_receta || IMAGEN_POR_DEFECTO);

        const query = `
            UPDATE TReceta 
            SET titulo_receta = ?, descripcion = ?, ingredientes = ?, tipo_receta = IFNULL(?, tipo_receta), imagen_receta = ?, tiempo_preparacion = ? 
            WHERE id_receta = ?`;

        await db.query(query, [titulo_receta, descripcion, ingredientes, tipo_receta || null, imagen_final, tiempo_preparacion || 0, id]);
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
        // 1. La consulta base (con joins, medias de estrellas y al azar)
        const baseQuery = `
            SELECT r.*, u.nombre_usuario as autor,
            (SELECT IFNULL(AVG(puntuacion), 0) FROM TValoracion WHERE id_receta = r.id_receta) as media_puntuacion
            FROM TReceta r
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            WHERE r.tipo_receta = ?
            ORDER BY RAND() LIMIT 1
        `;

        // 2. Disparamos las 7 consultas a la vez (en paralelo)
        const [
            [desayunos],
            [almuerzos],
            [comidas],
            [meriendas],
            [cenas],
            [postres],
            [snacks]
        ]: any = await Promise.all([
            db.query(baseQuery, ['Desayuno']),
            db.query(baseQuery, ['Almuerzo']),
            db.query(baseQuery, ['Comida']),
            db.query(baseQuery, ['Merienda']),
            db.query(baseQuery, ['Cena']),
            db.query(baseQuery, ['Postre']),
            db.query(baseQuery, ['Snack'])
        ]);

        // 3. Devolvemos el menú estructurado y ordenado exactamente como pediste
        res.json({
            status: "success",
            data: {
                desayuno: desayunos.length > 0 ? desayunos[0] : null,
                almuerzo: almuerzos.length > 0 ? almuerzos[0] : null,
                comida: comidas.length > 0 ? comidas[0] : null,
                merienda: meriendas.length > 0 ? meriendas[0] : null,
                cena: cenas.length > 0 ? cenas[0] : null,
                postre: postres.length > 0 ? postres[0] : null,
                snack: snacks.length > 0 ? snacks[0] : null
            }
        });
    } catch (error: any) {
        console.error("Error en el Menú del Día completo:", error);
        res.status(500).json({ status: "error", message: "Error al generar el menú del día." });
    }
};