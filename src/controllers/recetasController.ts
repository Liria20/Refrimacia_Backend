import { Request, Response } from 'express';
import db from '../../db.js';
// 🟢 Importamos nuestra conexión a la API de nutrición
import { calcularValores100g, obtenerNutricionDesdeAPI } from '../helpers/ApiNutricion.js';

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
                   r.tipo_receta, r.fecha_publicacion, u.nombre_usuario, -- 👈 CAMBIO AQUÍ: de "r." a "u."
                   r.semaforo, r.consumo_habitual, r.dificultad,
            (SELECT IFNULL(AVG(puntuacion), 0) FROM TValoracion WHERE id_receta = r.id_receta) as media_puntuacion
            FROM TReceta r
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            ORDER BY r.id_receta DESC
            LIMIT ? OFFSET ?`;

        const [rows]: any = await db.query(query, [limit, offset]);

        const recetasProcesadas = rows.map((receta: any) => ({
            id_receta: receta.id_receta,
            titulo_receta: receta.titulo_receta,
            imagen_receta: receta.imagen_receta,
            tiempo_preparacion: receta.tiempo_preparacion,
            tipo_receta: receta.tipo_receta,
            fecha_publicacion: receta.fecha_publicacion,
            nombre_usuario: receta.nombre_usuario,
            media_puntuacion: parseFloat(receta.media_puntuacion).toFixed(2),
            semaforo: receta.semaforo || 'gris',
            consumo_habitual: receta.consumo_habitual || 'No disponible',
            dificultad: receta.dificultad || 'Media'
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
        console.error("Error al listar recetas:", error);
        res.status(500).json({ status: "error", message: "Error al obtener recetas" });
    }
};

export const obtenerRecetaPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // 1. Al hacer r.* ya estás trayendo TODAS las nuevas columnas nutricionales automáticamente
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

        // 2. Traemos los comentarios asociados
        const [comentarios]: any = await db.query(
            `SELECT c.*, u.nombre_usuario, u.imagen_perfil 
             FROM TComentario c 
             JOIN TUsuario u ON c.id_usuario = u.id_usuario 
             WHERE c.id_receta = ? ORDER BY c.fecha_comentario DESC`,
            [id]
        );

        const receta = recetaRows[0];

        // 🌟 OPTIMIZACIÓN: Redondeamos la puntuación media a 1 decimal (ej: 4.5)
        // Esto evita que Android reciba cosas como 4.6666666667 y rompa el diseño de las estrellas
        receta.media_puntuacion = parseFloat(Number(receta.media_puntuacion).toFixed(1));

        // 3. Enviamos la respuesta
        res.json({
            status: "success",
            data: {
                ...receta, // Aquí ya van: kcal, azucares, sal, kcal_100g, consumo_habitual, semaforo, etc.
                comentarios: comentarios
            }
        });
    } catch (error: any) {
        console.error("❌ Error al obtener la receta por ID:", error);
        res.status(500).json({ status: "error", message: "Error al obtener los detalles de la receta." });
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

        // 1. ⚡ RESPUESTA INSTANTÁNEA: El usuario de Android recibe el OK al instante
        res.status(201).json({
            status: "success",
            id_receta: id_nueva_receta,
            foto: imagen_final
        });

        // 2. 🧠 PROCESO EN SEGUNDO PLANO: Se calcula todo el bloque nutricional sin hacer esperar al móvil
        (async () => {
            try {
                // Llamamos a la IA para obtener los totales y el peso estimado del plato
                const nutricion: any = await obtenerNutricionDesdeAPI(ingredientes, tipo_receta, descripcion);

                // Pasamos esos datos por tu función matemática para sacar el desglose por cada 100g
                const macros100g = calcularValores100g(nutricion);

                // Mapeamos el UPDATE masivo con la estructura exacta de tu tabla TReceta
                const updateQuery = `
                    UPDATE TReceta 
                    SET peso_total_g = ?,
                        kcal = ?, proteinas = ?, carbohidratos = ?, azucares = ?, fibra = ?, grasas = ?, grasas_saturadas = ?, sal = ?,
                        kcal_100g = ?, proteinas_100g = ?, carbohidratos_100g = ?, azucares_100g = ?, grasas_100g = ?, grasas_saturadas_100g = ?, fibra_100g = ?, sal_100g = ?,
                        semaforo = ?, consumo_habitual = ?, dificultad = ? 
                    WHERE id_receta = ?`;

                await db.query(updateQuery, [
                    nutricion.peso_total_g || 0,
                    
                    // Totales del plato (las llaves ya no llevan el sufijo _total)
                    nutricion.kcal || 0,
                    nutricion.proteinas || 0,
                    nutricion.carbohidratos || 0,
                    nutricion.azucares || 0,
                    nutricion.fibra || 0,
                    nutricion.grasas || 0,
                    nutricion.grasas_saturadas || 0,
                    nutricion.sal || 0,
                    
                    // Valores calculados por cada 100g
                    macros100g.kcal_100g || 0,
                    macros100g.proteinas_100g || 0,
                    macros100g.carbohidratos_100g || 0,
                    macros100g.azucares_100g || 0,
                    macros100g.grasas_100g || 0,
                    macros100g.grasas_saturadas_100g || 0,
                    macros100g.fibra_100g || 0,
                    macros100g.sal_100g || 0,
                    
                    // Clasificación y metadatos
                    nutricion.semaforo || 'gris',
                    nutricion.consumo_habitual || 'No disponible', // Cambiado para que coincida con la BD
                    nutricion.dificultad || 'Media',
                    
                    id_nueva_receta
                ]);

                console.log(`✅ Todo el bloque nutricional (Totales y 100g) guardado para la receta ${id_nueva_receta}`);
            } catch (errorIA) {
                console.error("❌ Error al calcular nutrición en segundo plano:", errorIA);
            }
        })();

    } catch (error: any) {
        if (!res.headersSent) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }
};

export const modificarReceta = async (req: Request, res: Response) => {
    const { id } = req.params;
    const id_usuario_token = (req as any).user.id_usuario;
    const { titulo_receta, descripcion, ingredientes, tipo_receta, imagen_receta, tiempo_preparacion } = req.body;

    if (tipo_receta && !TIPOS_VALIDOS.includes(tipo_receta as TipoReceta)) {
        return res.status(400).json({
            status: "error",
            message: `Tipo de receta no válido. Usa: ${TIPOS_VALIDOS.join(', ')}`
        });
    }

    try {
        // 1. Verificar existencia y propiedad de la receta
        const [recetaOriginal]: any = await db.query('SELECT * FROM TReceta WHERE id_receta = ?', [id]);
        if (recetaOriginal.length === 0) return res.status(404).json({ status: "error", message: "La receta no existe" });

        if (recetaOriginal[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ status: "error", message: "No tienes permiso para editar esta receta" });
        }

        // 2. Construcción dinámica de los campos básicos modificados
        let campos = [];
        let valores = [];

        if (titulo_receta) { campos.push("titulo_receta = ?"); valores.push(titulo_receta); }
        if (descripcion !== undefined) { campos.push("descripcion = ?"); valores.push(descripcion); }
        if (ingredientes) { campos.push("ingredientes = ?"); valores.push(ingredientes); }
        if (tipo_receta) { campos.push("tipo_receta = ?"); valores.push(tipo_receta); }
        if (tiempo_preparacion !== undefined) { campos.push("tiempo_preparacion = ?"); valores.push(tiempo_preparacion); }

        if (req.file) {
            campos.push("imagen_receta = ?");
            valores.push(req.file.path);
        } else if (imagen_receta === null || imagen_receta === "null") {
            campos.push("imagen_receta = ?");
            valores.push(IMAGEN_POR_DEFECTO);
        }

        if (campos.length === 0) {
            return res.status(400).json({ status: "error", message: "No se enviaron campos para modificar" });
        }

        // 3. Ejecutar Update rápido de los campos de texto
        const query = `UPDATE TReceta SET ${campos.join(", ")} WHERE id_receta = ?`;
        valores.push(id);
        await db.query(query, valores);

        // 4. ¿NECESITAMOS RECALCULAR NUTRICIÓN?
        const necesitaRecalculo = ingredientes || tipo_receta || descripcion || titulo_receta;

        if (necesitaRecalculo) {
            console.log(`🔄 Receta ${id} modificada. Recalculando bloque nutricional en segundo plano...`);

            // Cambiamos el semáforo a gris provisionalmente en lo que trabaja Gemini
            await db.query("UPDATE TReceta SET semaforo = 'gris' WHERE id_receta = ?", [id]);

            // Proceso en segundo plano: no lleva await para liberar al cliente al instante
            (async () => {
                try {
                    // Extraemos los datos unificados tras la edición
                    const [recetaActualizada]: any = await db.query('SELECT * FROM TReceta WHERE id_receta = ?', [id]);
                    const r = recetaActualizada[0];

                    // Obtenemos los totales y peso bruto desde la API de Gemini
                    const nutricion = await obtenerNutricionDesdeAPI(r.ingredientes, r.tipo_receta, r.descripcion);

                    // Calculamos proporcionalmente los valores por cada 100g
                    const macros100g = calcularValores100g(nutricion);

                    // Actualización masiva de todo el nuevo arsenal nutricional
                    const updateQuery = `
                        UPDATE TReceta 
                        SET peso_total_g = ?,
                            kcal = ?, proteinas = ?, carbohidratos = ?, azucares = ?, fibra = ?, grasas = ?, grasas_saturadas = ?, sal = ?,
                            kcal_100g = ?, proteinas_100g = ?, carbohidratos_100g = ?, azucares_100g = ?, grasas_100g = ?, grasas_saturadas_100g = ?, fibra_100g = ?, sal_100g = ?,
                            semaforo = ?, consumo_habitual = ?, dificultad = ? 
                        WHERE id_receta = ?`;

                    await db.query(updateQuery, [
                        nutricion.peso_total_g || 0,
                        
                        // Totales corregidos (sin sufijos según tu estructura SQL)
                        nutricion.kcal || 0,
                        nutricion.proteinas || 0,
                        nutricion.carbohidratos || 0,
                        nutricion.azucares || 0,
                        nutricion.fibra || 0,
                        nutricion.grasas || 0,
                        nutricion.grasas_saturadas || 0,
                        nutricion.sal || 0,
                        
                        // Tanda de 100g calculada al vuelo
                        macros100g.kcal_100g || 0,
                        macros100g.proteinas_100g || 0,
                        macros100g.carbohidratos_100g || 0,
                        macros100g.azucares_100g || 0,
                        macros100g.grasas_100g || 0,
                        macros100g.grasas_saturadas_100g || 0,
                        macros100g.fibra_100g || 0,
                        macros100g.sal_100g || 0,
                        
                        // Metadatos finales
                        nutricion.semaforo || 'gris',
                        nutricion.consumo_habitual || 'No disponible',
                        nutricion.dificultad || 'Media',
                        id
                    ]);
                    
                    console.log(`✅ Nutrición (Totales y 100g) recalculada con éxito para la receta editada: ${id}`);
                } catch (error) {
                    console.error(`❌ Error recalculando nutrición en edición para receta ${id}:`, error);
                }
            })();
        }

        // Respuesta inmediata al frontend
        res.json({
            status: "success",
            message: "Receta actualizada correctamente. La nutrición se está recalculando.",
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
    const { ingredientes, tipo_receta } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    try {
        let whereClause = "";
        const condiciones: string[] = []; // Array para agrupar todos los filtros
        const params: any[] = [];

        // Filtro 1: Por ingredientes
        if (ingredientes) {
            const palabras = (ingredientes as string)
                .toLowerCase()
                .replace(/,/g, ' ')
                .split(/\s+/)
                .filter(p => p.length > 2);

            if (palabras.length > 0) {
                const condIngredientes = palabras.map(() => `r.ingredientes LIKE ?`).join(' AND ');
                // Lo ponemos entre paréntesis por seguridad al juntarlo con otros filtros
                condiciones.push(`(${condIngredientes})`);
                palabras.forEach(p => params.push(`%${p}%`));
            }
        }

        // 🟢 Filtro 2: Por múltiples tipos de receta (MODIFICADO)
        if (tipo_receta) {
            let tiposArray: string[] = [];
            
            // Si viene como array (?tipo=Cena&tipo=Comida) o como string con comas (?tipo=Cena,Comida)
            if (Array.isArray(tipo_receta)) {
                tiposArray = tipo_receta as string[];
            } else if (typeof tipo_receta === 'string') {
                tiposArray = tipo_receta.split(',').map(t => t.trim());
            }

            if (tiposArray.length > 0) {
                // Creamos las interrogaciones dinámicas: ?, ?, ?
                const placeholders = tiposArray.map(() => '?').join(', ');
                condiciones.push(`r.tipo_receta IN (${placeholders})`);
                tiposArray.forEach(t => params.push(t));
            }
        }

        // Si hay algún filtro (ingredientes, tipo o ambos), construimos el WHERE
        if (condiciones.length > 0) {
            whereClause = ` WHERE ${condiciones.join(' AND ')}`;
        }

        const countQuery = `SELECT COUNT(*) as total FROM TReceta r ${whereClause}`;
        const [totalRows]: any = await db.query(countQuery, params);
        const totalRecetas = totalRows[0].total;
        const totalPages = Math.ceil(totalRecetas / limit);

        // Añadimos r.dificultad a la consulta
        let query = `
            SELECT r.id_receta, r.titulo_receta, r.imagen_receta, r.tiempo_preparacion, 
                   r.tipo_receta, r.fecha_publicacion, u.nombre_usuario as autor,
                   r.semaforo, r.consumo_habitual, r.dificultad
            FROM TReceta r 
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            ${whereClause}
            ORDER BY r.fecha_publicacion DESC
            LIMIT ? OFFSET ?`;

        const [rows]: any = await db.query(query, [...params, limit, offset]);

        // Mapeamos incluyendo la dificultad
        const recetasProcesadas = rows.map((receta: any) => ({
            id_receta: receta.id_receta,
            titulo_receta: receta.titulo_receta,
            imagen_receta: receta.imagen_receta,
            tiempo_preparacion: receta.tiempo_preparacion,
            tipo_receta: receta.tipo_receta,
            fecha_publicacion: receta.fecha_publicacion,
            autor: receta.autor,
            consumo_habitual: receta.consumo_habitual || "No disponible",
            semaforo: receta.semaforo || "gris",
            dificultad: receta.dificultad || "Media"
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
        console.error("❌ Error en buscador:", error);
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
        // 1. Añadimos semaforo, consumo_habitual y dificultad a la consulta SQL
        const baseQuery = `
            SELECT r.id_receta, r.titulo_receta, r.imagen_receta, r.tiempo_preparacion, 
                   r.tipo_receta, r.fecha_publicacion, u.nombre_usuario,
                   r.semaforo, r.consumo_habitual, r.dificultad, -- 👈 Añadimos r.dificultad
            (SELECT IFNULL(AVG(puntuacion), 0) FROM TValoracion WHERE id_receta = r.id_receta) as media_puntuacion
            FROM TReceta r
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            WHERE r.tipo_receta = ?
            ORDER BY RAND() LIMIT 1
        `;

        // Ejecutamos las consultas a la base de datos (son muy rápidas)
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

        // 2. Simplificamos la función: ya no es async porque no llama a la IA
        const formatearReceta = (lista: any[]) => {
            if (!lista || lista.length === 0) return null;
            const receta = lista[0];

            return {
                id_receta: receta.id_receta,
                titulo_receta: receta.titulo_receta,
                imagen_receta: receta.imagen_receta,
                tiempo_preparacion: receta.tiempo_preparacion,
                tipo_receta: receta.tipo_receta,
                fecha_publicacion: receta.fecha_publicacion,
                nombre_usuario: receta.nombre_usuario,
                media_puntuacion: parseFloat(receta.media_puntuacion).toFixed(2),
                consumo_habitual: receta.consumo_habitual || "No disponible",
                semaforo: receta.semaforo || "gris",
                dificultad: receta.dificultad || "Media" // 👈 Lo exponemos en el JSON
            };
        };

        // 3. Construimos el menú rápidamente
        res.json({
            status: "success",
            data: {
                desayuno: formatearReceta(desayunos),
                almuerzo: formatearReceta(almuerzos),
                comida: formatearReceta(comidas),
                merienda: formatearReceta(meriendas),
                cena: formatearReceta(cenas),
                postre: formatearReceta(postres),
                snack: formatearReceta(snacks)
            }
        });
    } catch (error: any) {
        console.error("❌ Error en el Menú del Día:", error);
        res.status(500).json({ status: "error", message: "Error al generar el menú del día." });
    }
};