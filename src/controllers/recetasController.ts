import { Request, Response } from 'express';
import db from '../../db.js';


export const listarRecetas = async (req: Request, res: Response) => {
    try {
        // Mejoramos la consulta para saber quién publicó la receta usando un JOIN
        const query = `
            SELECT r.*, u.nombre_usuario 
            FROM TReceta r
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            ORDER BY r.id_receta DESC`;
            
        const [rows] = await db.query(query);
        res.json({
            status: "success",
            data: rows
        });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: "Error al obtener recetas" });
    }
};

export const obtenerRecetaPorId = async (req: Request, res: Response) => {
    const { id } = req.params; // Sacamos el ID de la URL

    try {
        // Consultamos la receta y unimos con el nombre del autor
        const query = `
            SELECT r.*, u.nombre_usuario as autor 
            FROM TReceta r
            LEFT JOIN TUsuario u ON r.id_usuario = u.id_usuario
            WHERE r.id_receta = ?`;

        const [rows]: any = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "La receta no existe."
            });
        }

        res.json({
            status: "success",
            data: rows[0]
        });

    } catch (error: any) {
        console.error("❌ Error al obtener receta:", error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener los detalles de la receta."
        });
    }
};

export const crearReceta = async (req: Request, res: Response) => {
    // 1. Extraemos el ID del usuario del TOKEN (inyectado por validarToken)
    const id_usuario_token = (req as any).user.id_usuario;

    const { 
        titulo_receta, 
        descripcion, 
        ingredientes, 
        tipo_receta, 
        imagen_receta 
    } = req.body;

    // 2. Validación: Ahora id_usuario no viene en el body, lo tenemos del token
    if (!titulo_receta || !ingredientes) {
        return res.status(400).json({ 
            status: "error", 
            message: "Faltan campos obligatorios (título o ingredientes)" 
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
            id_usuario_token // <--- Usamos el ID del token por seguridad
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
    const { id } = req.params; // ID de la receta que viene en la URL
    const id_usuario_token = (req as any).user.id_usuario; // Quién está intentando editar

    const { 
        titulo_receta, 
        descripcion, 
        ingredientes, 
        tipo_receta, 
        imagen_receta 
    } = req.body;

    try {
        // 1. PRIMERO: Verificamos si la receta existe y si pertenece al usuario
        const [receta]: any = await db.query(
            'SELECT id_usuario FROM TReceta WHERE id_receta = ?', 
            [id]
        );

        if (receta.length === 0) {
            return res.status(404).json({ status: "error", message: "Receta no encontrada" });
        }

        if (receta[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ 
                status: "error", 
                message: "No tienes permiso para editar esta receta. No eres el autor." 
            });
        }

        // 2. SEGUNDO: Si es el dueño, procedemos a actualizar
        const query = `
            UPDATE TReceta 
            SET titulo_receta = ?, 
                descripcion = ?, 
                ingredientes = ?, 
                tipo_receta = ?, 
                imagen_receta = ? 
            WHERE id_receta = ?`;

        await db.query(query, [
            titulo_receta, 
            descripcion, 
            ingredientes, 
            tipo_receta, 
            imagen_receta, 
            id
        ]);

        res.json({ status: "success", message: "Receta actualizada correctamente" });

    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const eliminarReceta = async (req: Request, res: Response) => {
    const { id } = req.params; // ID de la receta a eliminar
    const id_usuario_token = (req as any).user.id_usuario; // Quién lo intenta eliminar

    try {
        // Ejecutamos el DELETE con una doble condición:
        // 1. Que el ID de la receta coincida
        // 2. Que el ID del autor sea el del token
        const [result]: any = await db.query(
            'DELETE FROM TReceta WHERE id_receta = ? AND id_usuario = ?',
            [id, id_usuario_token]
        );

        // Si no se borró nada, puede ser porque la receta no existe 
        // o porque el usuario no es el dueño
        if (result.affectedRows === 0) {
            return res.status(403).json({ 
                status: "error", 
                message: "No se pudo eliminar la receta. Puede que no exista o no tengas permiso." 
            });
        }

        res.json({ 
            status: "success", 
            message: "Receta eliminada correctamente." 
        });

    } catch (error: any) {
        console.error("Error al eliminar receta:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const buscarPorIngredientes = async (req: Request, res: Response) => {
    const { ingredientes } = req.query;

    try {
        let query = `
            SELECT r.*, u.nombre_usuario as autor 
            FROM TReceta r
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
        `;
        const params: any[] = [];

        if (ingredientes) {
            // 1. Limpiamos y separamos por comas y ESPACIOS
            // Esto convierte "Arroz sushi, salmon" en ["Arroz", "sushi", "salmon"]
            const palabras = (ingredientes as string)
                .toLowerCase()
                .replace(/,/g, ' ') // Cambiamos comas por espacios
                .split(/\s+/)      // Sepsramos por cualquier cantidad de espacios
                .filter(p => p.length > 2); // Ignoramos palabras de 1 o 2 letras (de, el, y...)

            if (palabras.length > 0) {
                // 2. Creamos la condición: Que contenga TODAS las palabras clave
                const condiciones = palabras.map(() => `r.ingredientes LIKE ?`).join(' AND ');
                query += ` WHERE ${condiciones}`;
                
                palabras.forEach(p => params.push(`%${p}%`));
            }
        }

        query += ` ORDER BY r.fecha_publicacion DESC`;

        const [rows]: any = await db.query(query, params);

        res.json({
            status: "success",
            count: rows.length,
            data: rows
        });

    } catch (error: any) {
        console.error("❌ Error en búsqueda:", error);
        res.status(500).json({ status: "error", message: "Error en el buscador." });
    }
};

export const obtenerRecetaParaCompartir = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Consultamos la receta y el nombre del autor
        const query = `
            SELECT r.*, u.nombre_usuario 
            FROM TReceta r
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            WHERE r.id_receta = ?
        `;

        const [rows]: any = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Receta no encontrada." });
        }

        const receta = rows[0];

        // Construimos un objeto optimizado para "Compartir"
        res.json({
            status: "success",
            data: {
                enlace: `refrimancia://receta/${receta.id_receta}`, // Deep Link para Android
                titulo: receta.titulo_receta,
                autor: receta.nombre_usuario,
                imagen: receta.imagen_receta,
                info_nutricional: {
                    kcal: receta.kcal_por_racion,
                    color: receta.semaforo_color,
                    consejo: receta.sugerencia_consumo
                },
                // Un texto predefinido para que el usuario lo pegue en RRSS
                texto_compartir: `¡Mira esta receta de ${receta.titulo_receta} en RefriMancia! Es ${receta.semaforo_color === 'verde' ? 'súper saludable 🥗' : 'deliciosa 😋'}.`
            }
        });

    } catch (error: any) {
        console.error("❌ Error al generar enlace compartido:", error);
        res.status(500).json({ status: "error", message: "Error al preparar la receta para compartir." });
    }
};

export const obtenerMenuDelDia = async (req: Request, res: Response) => {
    try {
        // Seleccionamos 2 recetas aleatorias usando las columnas que SÍ tienes
        const query = `
            SELECT r.*, u.nombre_usuario as autor
            FROM TReceta r
            JOIN TUsuario u ON r.id_usuario = u.id_usuario
            ORDER BY RAND() 
            LIMIT 2
        `;

        const [recetas]: any = await db.query(query);

        // Si tienes menos de 2 recetas, la app no puede sugerir un "menú" (comida y cena)
        if (recetas.length < 2) {
            return res.status(404).json({ 
                status: "error", 
                message: "Necesitas al menos 2 recetas en la base de datos para generar un menú." 
            });
        }

        const comida = recetas[0];
        const cena = recetas[1];

        res.json({
            status: "success",
            data: {
                mensaje: "Aquí tienes tu propuesta para hoy",
                fecha: new Date().toLocaleDateString(),
                menu: {
                    almuerzo: {
                        id: comida.id_receta,
                        plato: comida.titulo_receta,
                        categoria: comida.tipo_receta,
                        cocinado_por: comida.autor
                    },
                    cena: {
                        id: cena.id_receta,
                        plato: cena.titulo_receta,
                        categoria: cena.tipo_receta,
                        cocinado_por: cena.autor
                    }
                }
            }
        });

    } catch (error: any) {
        console.error("❌ Error en el oráculo:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Error al consultar la base de datos." 
        });
    }
};