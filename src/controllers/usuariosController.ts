import { Request, Response } from 'express';
import db from '../../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        // 1️⃣ LÓGICA DE IMAGEN:
        // Si hay un archivo nuevo (req.file), usamos esa ruta.
        // Si no, mantenemos la que ya tenía (imagen_perfil que viene en el body).
        const imagenFinal = req.file ? `/uploads/recetas/${req.file.filename}` : imagen_perfil;

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
            imagenFinal, // <--- Usamos la imagen procesada
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

    // 2️⃣ LÓGICA DE IMAGEN (REGISTRO):
    // Si el usuario sube una foto al registrarse, la guardamos.
    const rutaImagen = req.file ? `/uploads/recetas/${req.file.filename}` : null;

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
            rutaImagen // <--- Guardamos la ruta del archivo real
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

// --- EL RESTO DE FUNCIONES (Login, Listar, Recuperar) NO CAMBIAN ---

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

export const listarUsuarios = async (req: Request, res: Response) => {
    try {
        const [rows]: any = await db.query('SELECT id_usuario, nombre_usuario, imagen_perfil, nombre_completo, fecha_nac, correo_electronico FROM TUsuario');
        res.json({ status: "success", count: rows.length, data: rows });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: "Error al listar" });
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

        // (Lógica de envío de Brevo omitida para brevedad, pero mantenla en tu código real)
        res.json({ status: "success", message: "Código enviado" });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
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