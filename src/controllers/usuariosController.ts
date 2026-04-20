import { Request, Response } from 'express';
import db from '../../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// 🟢 NUEVO: Definimos el avatar por defecto para los usuarios sin foto
const IMAGEN_PERFIL_POR_DEFECTO = "https://images.icon-icons.com/1603/PNG/512/kitchen-coock-chef-hat_108594.png";

export const modificarUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    const idUsuarioToken = (req as any).user.id_usuario;

    if (String(id) !== String(idUsuarioToken)) {
        return res.status(403).json({
            status: "error",
            message: "No tienes permiso para modificar este perfil."
        });
    }

    const {
        nombre_usuario,
        imagen_perfil, // Este vendrá del body si no se sube archivo nuevo
        nombre_completo,
        fecha_nac,
        correo_electronico
    } = req.body;

    try {
        // 🚀 CAMBIO CLOUDINARY: Usamos la URL pública o la imagen que ya tenía. 
        // 🟢 NUEVO: Si viene vacío/null, le ponemos la de por defecto.
        const imagenFinal = req.file ? req.file.path : (imagen_perfil || IMAGEN_PERFIL_POR_DEFECTO);

        const query = `
            UPDATE TUsuario 
            SET nombre_usuario = ?, 
                imagen_perfil = ?, 
                nombre_completo = ?, 
                fecha_nac = ?, 
                correo_electronico = ? 
            WHERE id_usuario = ?`;

        const [result]: any = await db.query(query, [
            nombre_usuario,
            imagenFinal,
            nombre_completo,
            fecha_nac,
            correo_electronico,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({
            status: "success",
            message: "Datos de usuario actualizados correctamente",
            foto: imagenFinal
        });
    } catch (error: any) {
        console.error("❌ Error SQL:", error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
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
                process.env.JWT_SECRET as string,
                { expiresIn: '2h' }
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
        const senderEmail = "tu-correo-verificado@dominio.com"; // DEBE estar verificado en Brevo

        await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { email: senderEmail, name: "RefriMancia App" },
            to: [{ email: correo_electronico }],
            subject: "Código de recuperación - RefriMancia",
            htmlContent: `
                <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px;">
                    <h2>Recuperación de contraseña</h2>
                    <p>Has solicitado un código para cambiar tu contraseña en RefriMancia.</p>
                    <h1 style="color: #4CAF50; letter-spacing: 5px;">${codigo}</h1>
                    <p>Este código es de un solo uso. Si no has sido tú, ignora este correo.</p>
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
        // 🔴 IMPORTANTE: Loguea el error para ver qué dice Brevo en la consola de Render
        console.error("Error en Brevo/DB:", error.response?.data || error.message);
        res.status(500).json({ 
            status: "error", 
            message: "No se pudo enviar el correo. Revisa la configuración del servidor." 
        });
    }
};