import { Request, Response } from 'express';
import db from '../../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// 🟢 NUEVO: Definimos el avatar por defecto para los usuarios sin foto
const IMAGEN_PERFIL_POR_DEFECTO = "https://images.icon-icons.com/1603/PNG/512/kitchen-coock-chef-hat_108594.png";

export const modificarUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    const idUsuarioToken = (req as any).user?.id_usuario; // Usamos ?. por seguridad

    // 1. Seguridad: Solo el dueño del perfil puede editarlo
    if (!idUsuarioToken || String(id) !== String(idUsuarioToken)) {
        return res.status(403).json({
            status: "error",
            message: "No tienes permiso para modificar este perfil."
        });
    }

    // Extraemos los campos del body
    const { nombre_usuario, nombre_completo, fecha_nac, imagen_perfil } = req.body;

    try {
        let campos = [];
        let valores = [];

        // 2. Construcción dinámica (Comprobamos undefined para que campos opcionales funcionen)
        if (nombre_usuario !== undefined) {
            campos.push("nombre_usuario = ?");
            valores.push(nombre_usuario);
        }
        if (nombre_completo !== undefined) {
            campos.push("nombre_completo = ?");
            valores.push(nombre_completo);
        }
        if (fecha_nac !== undefined) {
            campos.push("fecha_nac = ?");
            valores.push(fecha_nac);
        }

        // 3. Lógica de Imagen (Caso null, texto "null" o archivo vacío)
        if (req.file) {
            // Se subió un archivo nuevo
            campos.push("imagen_perfil = ?");
            valores.push(req.file.path);
        }
        else if (imagen_perfil === null || imagen_perfil === "null") {
            // Se quiere resetear la imagen (enviando null o el texto "null" de Postman)
            campos.push("imagen_perfil = ?");
            valores.push(IMAGEN_PERFIL_POR_DEFECTO);
        }

        // 4. Verificamos si realmente hay algo que actualizar
        if (campos.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No se enviaron datos para actualizar."
            });
        }

        // 5. Ejecución de la Query
        const query = `UPDATE TUsuario SET ${campos.join(", ")} WHERE id_usuario = ?`;
        valores.push(id); // El ID es el último parámetro

        const [result]: any = await db.query(query, valores);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado en la base de datos." });
        }

        res.json({
            status: "success",
            message: "Perfil actualizado correctamente",
            data: {
                foto_actualizada: req.file ? "Nueva imagen" : (imagen_perfil === "null" || imagen_perfil === null ? "Reseteada a default" : "Sin cambios")
            }
        });

    } catch (error: any) {
        // 🚨 MUY IMPORTANTE: Este log te dirá en tu terminal por qué da el 500
        console.error("❌ ERROR CRÍTICO EN MODIFICAR_USUARIO:", error);

        res.status(500).json({
            status: "error",
            message: "Error interno al actualizar el perfil.",
            details: error.message // Te lo pongo aquí para que lo veas en Postman (quítalo en producción)
        });
    }
};

export const crearUsuario = async (req: Request, res: Response) => {
    const {
        nombre_usuario,
        contrasena,
        correo_electronico,
        nombre_completo,
        fecha_nac
    } = req.body;

    if (!nombre_usuario || !contrasena || !correo_electronico || !nombre_completo || !fecha_nac) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos obligatorios"
        });
    }

    // 🚀 CAMBIO CLOUDINARY: Guardamos la URL de la nube si el usuario sube foto.
    // 🟢 NUEVO: Si no sube nada, le ponemos el avatar por defecto.
    const rutaImagen = req.file ? req.file.path : IMAGEN_PERFIL_POR_DEFECTO;

    try {
        const salt = await bcrypt.genSalt(10);
        const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

        const query = `
            INSERT INTO TUsuario 
            (nombre_usuario, contrasena, correo_electronico, nombre_completo, fecha_nac, imagen_perfil) 
            VALUES (?, ?, ?, ?, ?, ?)`;

        const [result]: any = await db.query(query, [
            nombre_usuario,
            contrasenaHasheada,
            correo_electronico,
            nombre_completo,
            fecha_nac,
            rutaImagen
        ]);

        res.status(201).json({
            status: "success",
            message: "Usuario registrado con éxito.",
            id: result.insertId,
            foto: rutaImagen
        });

    } catch (error: any) {
        if (error.errno === 1062) {
            return res.status(400).json({
                status: "error",
                message: "El nombre de usuario o el correo ya están registrados"
            });
        }
        res.status(500).json({ status: "error", message: error.message });
    }
};

// --- EL RESTO DE FUNCIONES NO CAMBIAN ---

export const loginUsuario = async (req: Request, res: Response) => {
    const { correo_electronico, contrasena } = req.body;
    try {
        const [rows]: any = await db.query('SELECT * FROM TUsuario WHERE correo_electronico = ?', [correo_electronico]);
        if (rows.length > 0) {
            const usuario = rows[0];
            const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
            if (!esValida) return res.status(401).json({ status: "error", message: "Credenciales incorrectas" });

            const token = jwt.sign(
                { id_usuario: usuario.id_usuario, nombre: usuario.nombre_usuario },
                process.env.JWT_SECRET as string
                // Sin el objeto de opciones { expiresIn }, el token no expira nunca.
            );
            await db.query('UPDATE TUsuario SET ultimo_token = ? WHERE id_usuario = ?', [token, usuario.id_usuario]);
            delete usuario.contrasena;
            res.json({ status: "success", token, data: usuario });
        } else {
            res.status(401).json({ status: "error", message: "Credenciales incorrectas" });
        }
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const logoutUsuario = async (req: Request, res: Response) => {
    // Como esta ruta estará protegida por tu middleware, 
    // ya sabes qué usuario es gracias a (req as any).user
    const idUsuarioToken = (req as any).user.id_usuario;

    try {
        // Ponemos el token a NULL en la base de datos
        await db.query('UPDATE TUsuario SET ultimo_token = NULL WHERE id_usuario = ?', [idUsuarioToken]);

        res.json({
            status: "success",
            message: "Sesión cerrada correctamente"
        });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: "Error al cerrar sesión" });
    }
};

export const listarUsuarios = async (req: Request, res: Response) => {
    // 1. Atrapamos los parámetros de paginación (Página 1 y 10 usuarios por defecto)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    try {
        // 2. Contamos cuántos usuarios hay en total en la base de datos
        const [totalRows]: any = await db.query('SELECT COUNT(*) as total FROM TUsuario');
        const totalUsuarios = totalRows[0].total;
        const totalPages = Math.ceil(totalUsuarios / limit);

        // 3. Consultamos los usuarios aplicando el límite y el offset
        const query = `
            SELECT id_usuario, nombre_usuario, imagen_perfil, nombre_completo, fecha_nac, correo_electronico 
            FROM TUsuario 
            ORDER BY id_usuario DESC 
            LIMIT ? OFFSET ?`;

        const [rows]: any = await db.query(query, [limit, offset]);

        // 4. Devolvemos los datos junto con el bloque de paginación
        res.json({
            status: "success",
            data: rows,
            paginacion: {
                total_usuarios: totalUsuarios,
                total_paginas: totalPages,
                pagina_actual: page,
                usuarios_por_pagina: limit
            }
        });
    } catch (error: any) {
        console.error("Error en listarUsuarios:", error);
        res.status(500).json({ status: "error", message: "Error al listar usuarios" });
    }
};

export const obtenerPerfilPrivado = async (req: Request, res: Response) => {
    const idUsuarioToken = (req as any).user.id_usuario;
    try {
        const [rows]: any = await db.query('SELECT id_usuario, nombre_usuario, imagen_perfil, nombre_completo, fecha_nac, correo_electronico FROM TUsuario WHERE id_usuario = ?', [idUsuarioToken]);
        if (rows.length === 0) return res.status(404).json({ status: "error", message: "No encontrado" });
        res.json({ status: "success", data: rows[0] });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: "Error interno" });
    }
};

export const eliminarMiCuenta = async (req: Request, res: Response) => {
    // Obtenemos el ID del usuario directamente del token de seguridad (middleware)
    const id_usuario = (req as any).user.id_usuario;

    try {
        // 1. Ejecutamos el borrado. ¡MySQL hará la cascada automáticamente!
        const [resultado]: any = await db.query(
            'DELETE FROM TUsuario WHERE id_usuario = ?',
            [id_usuario]
        );

        // 2. Verificamos si realmente se borró algo
        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontró la cuenta o ya fue eliminada."
            });
        }

        // 3. Respuesta de éxito
        res.json({
            status: "success",
            message: "Tu cuenta, recetas, comentarios y valoraciones han sido eliminados para siempre. ¡Hasta pronto!"
        });

    } catch (error: any) {
        console.error("❌ Error al eliminar la cuenta:", error);
        res.status(500).json({
            status: "error",
            message: "Error interno al intentar eliminar la cuenta."
        });
    }
};

export const solicitarCodigoRecuperacion = async (req: Request, res: Response) => {
    const { correo_electronico } = req.body;
    if (!correo_electronico) return res.status(400).json({ status: "error", message: "Correo necesario" });

    try {
        const [rows]: any = await db.query('SELECT id_usuario FROM TUsuario WHERE correo_electronico = ?', [correo_electronico]);
        if (rows.length === 0) return res.status(404).json({ status: "error", message: "Correo no registrado" });

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        await db.query('UPDATE TUsuario SET codigo_verificacion = ? WHERE correo_electronico = ?', [codigo, correo_electronico]);

        // 🟢 Lógica de Brevo integrada y segura
        const apiKey = process.env.BREVO_API_KEY;
        const senderEmail = "evagr4121@gmail.com"; // DEBE estar verificado en Brevo

        await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { email: senderEmail, name: "RefriMancia App" },
            to: [{ email: correo_electronico }],
            subject: "🔐 Tu código de recuperación - RefriMancia",
            htmlContent: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 40px 20px; border-radius: 10px;">
                    <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: center;">
                        
                        <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 24px;">¡Hola, Chef! 👨‍🍳</h2>
                        
                        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>RefriMancia</strong>. 
                            Utiliza el siguiente código de seguridad en la aplicación para crear tu nueva contraseña:
                        </p>
                        
                        <div style="background-color: #f0fdf4; border: 2px dashed #4CAF50; border-radius: 8px; padding: 20px; margin: 0 auto 30px auto; display: inline-block;">
                            <h1 style="color: #4CAF50; letter-spacing: 10px; margin: 0; font-size: 36px; font-weight: bold;">${codigo}</h1>
                        </div>
                        
                        <p style="color: #888888; font-size: 14px; line-height: 1.5;">
                            Si no has solicitado este cambio, no te preocupes. Puedes ignorar este correo tranquilamente; tu cuenta sigue estando segura.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                        <p style="color: #aaaaaa; font-size: 12px; line-height: 1.4;">
                            © 2026 RefriMancia App. Todos los derechos reservados.<br>
                            Cocinando con magia y tecnología. ✨
                        </p>
                    </div>
                </div>
            `
        }, {
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        res.json({ status: "success", message: "Código enviado correctamente" });

    } catch (error: any) {
        console.error("Error en Brevo/DB:", error.response?.data || error.message);
        res.status(500).json({
            status: "error",
            message: "No se pudo enviar el correo. Revisa la configuración del servidor."
        });
    }
};

export const cambiarContrasena = async (req: Request, res: Response) => {

    const { correo_electronico, codigo, nueva_contrasena } = req.body;

    try {
        const [rows]: any = await db.query('SELECT id_usuario FROM TUsuario WHERE correo_electronico = ? AND codigo_verificacion = ?', [correo_electronico, codigo]);

        if (rows.length === 0) return res.status(400).json({ status: "error", message: "Código inválido" });

        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(nueva_contrasena, salt);

        await db.query('UPDATE TUsuario SET contrasena = ?, codigo_verificacion = NULL WHERE correo_electronico = ?', [hash, correo_electronico]);

        res.json({ status: "success", message: "Contraseña actualizada" });

    } catch (error: any) {

        res.status(500).json({ status: "error", message: error.message });

    }

};