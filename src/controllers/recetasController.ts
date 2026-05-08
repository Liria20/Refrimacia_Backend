import { Request, Response } from 'express';
import db from '../../db.js';
// 🟢 Importamos nuestra conexión a la API de nutrición
import { obtenerNutricionDesdeAPI } from '../helpers/ApiNutricion.js';

const IMAGEN_POR_DEFECTO = "https://cdn-icons-png.flaticon.com/512/857/857681.png";

// --- Tipos válidos ---
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

        const query = `
            SELECT r.id_receta, r.titulo_receta, r.imagen_receta, r.tiempo_preparacion, 
                   r.tipo_receta, r.fecha_publicacion, r.ingredientes, r.descripcion, u.nombre_usuario,
            (SELECT IFNULL(AVG(puntuacion), 0) FROM TValoracion WHERE id_receta = r.id_receta) as media_puntuacion
            FROM TReceta r
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            ORDER BY r.id_receta DESC
            LIMIT ? OFFSET ?`;
            
        const [rows]: any = await db.query(query, [limit, offset]);

        const recetasProcesadas = await Promise.all(rows.map(async (receta: any) => {
            const nutricion = await obtenerNutricionDesdeAPI(
                receta.ingredientes, 
                receta.tipo_receta, 
                receta.descripcion
            );

            return {
                id_receta: receta.id_receta,
                titulo_receta: receta.titulo_receta,
                imagen_receta: receta.imagen_receta,
                tiempo_preparacion: receta.tiempo_preparacion,
                tipo_receta: receta.tipo_receta,
                fecha_publicacion: receta.fecha_publicacion,
                nombre_usuario: receta.nombre_usuario,
                media_puntuacion: parseFloat(receta.media_puntuacion).toFixed(2),
                consumo_habitual: nutricion.consumo_recomendado,
                semaforo: nutricion.semaforo
            };
        }));

        res.json({ 
            status: "success", 
            data: recetasProcesadas,
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
    const { titulo_receta, descripcion, ingredientes, tipo_receta, tiempo_preparacion } = req.body;

    if (!titulo_receta || !ingredientes) {
        return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
    }

    if (tipo_receta && !TIPOS_VALIDOS.includes(tipo_receta as TipoReceta)) {
        return res.status(400).json({
            status: "error",
            message: `Tipo de receta no válido. Usa: ${TIPOS_VALIDOS.join(', ')}`
        });
    }

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
            tipo_receta || 'Almuerzo',
            tiempo_preparacion || 0,
            imagen_final,
            id_usuario_token
        ]);

        const id_nueva_receta = result.insertId;

        // 1. ⚡ RESPUESTA INSTANTÁNEA: El usuario recibe el OK aquí mismo
        res.status(201).json({
            status: "success",
            id_receta: id_nueva_receta,
            foto: imagen_final
        });

        // 2. 🧠 PROCESO EN SEGUNDO PLANO: Se ejecuta sin hacer esperar al usuario
        (async () => {
            try {
                // Forzamos el tipo a 'any' para evitar que TypeScript se queje de los campos nuevos
                const nutricion: any = await obtenerNutricionDesdeAPI(ingredientes, tipo_receta, descripcion);
                
                const updateQuery = `
                    UPDATE TReceta 
                    SET kcal = ?, proteinas = ?, carbohidratos = ?, fibra = ?, grasas = ?,
                        semaforo = ?, consumo_habitual = ? 
                    WHERE id_receta = ?`;

                await db.query(updateQuery, [
                    nutricion.kcal || 0,
                    nutricion.proteinas || 0,
                    nutricion.carbohidratos || 0,
                    nutricion.fibra || 0,
                    nutricion.grasas || 0,
                    nutricion.semaforo || 'amarillo',
                    nutricion.consumo_recomendado || 'No disponible',
                    id_nueva_receta
                ]);
                console.log(`✅ Nutrición calculada para la receta ${id_nueva_receta}`);
            } catch (errorIA) {
                console.error("❌ Error al calcular nutrición en segundo plano:", errorIA);
            }
        })();

    } catch (error: any) {
        // Solo enviamos error si no se ha enviado la respuesta de éxito todavía
        if (!res.headersSent) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }
};

export const modificarReceta = async (req: Request, res: Response) => {
    const { id } = req.params;
    const id_usuario_token = (req as any).user.id_usuario;
    const { titulo_receta, descripcion, ingredientes, tipo_receta, imagen_receta, tiempo_preparacion } = req.body;

    // Validación de tipos permitidos si se envía el campo
    if (tipo_receta && !TIPOS_VALIDOS.includes(tipo_receta as TipoReceta)) {
        return res.status(400).json({
            status: "error",
            message: `Tipo de receta no válido. Usa: ${TIPOS_VALIDOS.join(', ')}`
        });
    }

    try {
        // 1. Verificar existencia y propiedad
        const [receta]: any = await db.query('SELECT id_usuario FROM TReceta WHERE id_receta = ?', [id]);
        if (receta.length === 0) return res.status(404).json({ status: "error", message: "La receta no existe" });
        
        if (receta[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ status: "error", message: "No tienes permiso para editar esta receta" });
        }

        // 2. Construcción dinámica de campos
        let campos = [];
        let valores = [];

        if (titulo_receta) { campos.push("titulo_receta = ?"); valores.push(titulo_receta); }
        if (descripcion !== undefined) { campos.push("descripcion = ?"); valores.push(descripcion); }
        if (ingredientes) { campos.push("ingredientes = ?"); valores.push(ingredientes); }
        if (tipo_receta) { campos.push("tipo_receta = ?"); valores.push(tipo_receta); }
        if (tiempo_preparacion !== undefined) { campos.push("tiempo_preparacion = ?"); valores.push(tiempo_preparacion); }

        // 3. Lógica de imagen (Igual que en Usuario)
        if (req.file) {
            // Sube archivo nuevo
            campos.push("imagen_receta = ?");
            valores.push(req.file.path);
        } else if (imagen_receta === null || imagen_receta === "null") {
            // Resetea a imagen por defecto
            campos.push("imagen_receta = ?");
            valores.push(IMAGEN_POR_DEFECTO);
        }

        // 4. ¿Hay algo que actualizar?
        if (campos.length === 0) {
            return res.status(400).json({ status: "error", message: "No se enviaron campos para modificar" });
        }

        // 5. Ejecutar Update
        const query = `UPDATE TReceta SET ${campos.join(", ")} WHERE id_receta = ?`;
        valores.push(id);

        await db.query(query, valores);

        res.json({ 
            status: "success", 
            message: "Receta actualizada correctamente",
            foto: req.file ? req.file.path : (imagen_receta === "null" || imagen_receta === null ? "Default" : "Mantenida")
        });

    } catch (error: any) {
        console.error("❌ Error en modificarReceta:", error);
        res.status(500).json({ status: "error", message: "Error interno al modificar la receta" });
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    try {
        let whereClause = "";
        const params: any[] = [];

        if (ingredientes) {
            const palabras = (ingredientes as string)
                .toLowerCase()
                .replace(/,/g, ' ')
                .split(/\s+/)
                .filter(p => p.length > 2);

            if (palabras.length > 0) {
                const condiciones = palabras.map(() => `r.ingredientes LIKE ?`).join(' AND ');
                whereClause = ` WHERE ${condiciones}`;
                palabras.forEach(p => params.push(`%${p}%`));
            }
        }

        const countQuery = `SELECT COUNT(*) as total FROM TReceta r ${whereClause}`;
        const [totalRows]: any = await db.query(countQuery, params);
        const totalRecetas = totalRows[0].total;
        const totalPages = Math.ceil(totalRecetas / limit);

        let query = `
            SELECT r.id_receta, r.titulo_receta, r.imagen_receta, r.tiempo_preparacion, 
                   r.tipo_receta, r.fecha_publicacion, r.ingredientes, r.descripcion, u.nombre_usuario as autor 
            FROM TReceta r 
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            ${whereClause}
            ORDER BY r.fecha_publicacion DESC
            LIMIT ? OFFSET ?`;

        const [rows]: any = await db.query(query, [...params, limit, offset]);

        const recetasProcesadas = await Promise.all(rows.map(async (receta: any) => {
            const nutricion = await obtenerNutricionDesdeAPI(
                receta.ingredientes,
                receta.tipo_receta,
                receta.descripcion
            );

            return {
                id_receta: receta.id_receta,
                titulo_receta: receta.titulo_receta,
                imagen_receta: receta.imagen_receta,
                tiempo_preparacion: receta.tiempo_preparacion,
                tipo_receta: receta.tipo_receta,
                fecha_publicacion: receta.fecha_publicacion,
                autor: receta.autor,
                consumo_habitual: nutricion.consumo_recomendado,
                semaforo: nutricion.semaforo
            };
        }));

        res.json({
            status: "success",
            data: recetasProcesadas,
            paginacion: {
                total_recetas: totalRecetas,
                total_paginas: totalPages,
                pagina_actual: page,
                recetas_por_pagina: limit
            }
        });
    } catch (error: any) {
        console.error(error);
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
        const baseQuery = `
            SELECT r.id_receta, r.titulo_receta, r.imagen_receta, r.tiempo_preparacion, 
                   r.ingredientes, r.descripcion, r.tipo_receta, r.fecha_publicacion, u.nombre_usuario,
            (SELECT IFNULL(AVG(puntuacion), 0) FROM TValoracion WHERE id_receta = r.id_receta) as media_puntuacion
            FROM TReceta r
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            WHERE r.tipo_receta = ?
            ORDER BY RAND() LIMIT 1
        `;

        const [
            [desayunos], [almuerzos], [comidas], [meriendas], [cenas], [postres], [snacks]
        ]: any = await Promise.all([
            db.query(baseQuery, ['Desayuno']),
            db.query(baseQuery, ['Almuerzo']),
            db.query(baseQuery, ['Comida']),
            db.query(baseQuery, ['Merienda']),
            db.query(baseQuery, ['Cena']),
            db.query(baseQuery, ['Postre']),
            db.query(baseQuery, ['Snack'])
        ]);

        const enriquecerRecetaLigera = async (lista: any[]) => {
            if (!lista || lista.length === 0) return null;
            const receta = lista[0];
            
            const nutricion = await obtenerNutricionDesdeAPI(
                receta.ingredientes, 
                receta.tipo_receta, 
                receta.descripcion
            );

            return {
                id_receta: receta.id_receta,
                titulo_receta: receta.titulo_receta,
                imagen_receta: receta.imagen_receta,
                tiempo_preparacion: receta.tiempo_preparacion,
                tipo_receta: receta.tipo_receta,
                fecha_publicacion: receta.fecha_publicacion,
                nombre_usuario: receta.nombre_usuario,
                media_puntuacion: parseFloat(receta.media_puntuacion).toFixed(2),
                consumo_habitual: nutricion.consumo_recomendado,
                semaforo: nutricion.semaforo
            };
        };

        const [
            menuDesayuno, menuAlmuerzo, menuComida, 
            menuMerienda, menuCena, menuPostre, menuSnack
        ] = await Promise.all([
            enriquecerRecetaLigera(desayunos),
            enriquecerRecetaLigera(almuerzos),
            enriquecerRecetaLigera(comidas),
            enriquecerRecetaLigera(meriendas),
            enriquecerRecetaLigera(cenas),
            enriquecerRecetaLigera(postres),
            enriquecerRecetaLigera(snacks)
        ]);

        res.json({
            status: "success",
            data: {
                desayuno: menuDesayuno,
                almuerzo: menuAlmuerzo,
                comida: menuComida,
                merienda: menuMerienda,
                cena: menuCena,
                postre: menuPostre,
                snack: menuSnack
            }
        });
    } catch (error: any) {
        console.error("Error en el Menú del Día:", error);
        res.status(500).json({ status: "error", message: "Error al generar el menú del día." });
    }
};