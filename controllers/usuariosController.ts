import { Request, Response } from 'express';
import db from '../db.js';

export const modificarUsuario = async (req: Request, res: Response) => {
    const { id } = req.params; // El id_usuario que viene en la URL
    const { 
        nombre_usuario, 
        imagen_perfil, 
        nombre_completo, 
        fecha_nac, 
        correo_electronico 
    } = req.body;

    try {
        // Usamos la tabla TUsuario de tu nuevo script
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
            imagen_perfil, 
            nombre_completo, 
            fecha_nac, 
            correo_electronico, 
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Datos de usuario actualizados correctamente" });
    } catch (error: any) {
        console.error("❌ Error SQL:", error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
};
export const crearUsuario = async (req: Request, res: Response) => {
    // Extraemos todos los campos de tu tabla TUsuario
    const { 
        nombre_usuario, 
        contrasena, 
        correo_electronico, 
        nombre_completo, 
        fecha_nac, 
        imagen_perfil 
    } = req.body;

    // Validación de campos obligatorios
    if (!nombre_usuario || !contrasena || !correo_electronico || !nombre_completo || !fecha_nac) {
        return res.status(400).json({ 
            status: "error", 
            message: "Faltan datos obligatorios (solo la imagen es opcional)" 
        });
    }

    try {
        const query = `
            INSERT INTO TUsuario 
            (nombre_usuario, contrasena, correo_electronico, nombre_completo, fecha_nac, imagen_perfil) 
            VALUES (?, ?, ?, ?, ?, ?)`;

        // Si imagen_perfil no viene, enviamos null
        const [result]: any = await db.query(query, [
            nombre_usuario, 
            contrasena, 
            correo_electronico, 
            nombre_completo, 
            fecha_nac, 
            imagen_perfil || null 
        ]);

        res.status(201).json({
            status: "success",
            message: "Usuario registrado con éxito",
            id: result.insertId
        });

    } catch (error: any) {
        // Manejo de duplicados (Correo o Nombre de usuario)
        if (error.errno === 1062) {
            return res.status(400).json({ 
                status: "error", 
                message: "El nombre de usuario o el correo ya están registrados" 
            });
        }
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const loginUsuario = async (req: Request, res: Response) => {
    const { nombre_usuario, contrasena } = req.body;

    try {
        // Buscamos al usuario por nombre y contraseña (en texto plano por ahora)
        const [rows]: any = await db.query(
            'SELECT * FROM TUsuario WHERE nombre_usuario = ? AND contrasena = ?',
            [nombre_usuario, contrasena]
        );

        if (rows.length > 0) {
            const usuario = rows[0];
            // No enviamos la contraseña de vuelta por seguridad
            delete usuario.contrasena; 
            
            res.json({ 
                status: "success", 
                message: "Login correcto", 
                data: usuario 
            });
        } else {
            res.status(401).json({ 
                status: "error", 
                message: "Usuario o contraseña incorrectos" 
            });
        }
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const listarUsuarios = async (req: Request, res: Response) => {
    try {
        // Seleccionamos todo excepto la contraseña (por seguridad)
        const [rows]: any = await db.query(
            'SELECT id_usuario, nombre_usuario, imagen_perfil, nombre_completo, fecha_nac, correo_electronico FROM TUsuario'
        );

        res.json({
            status: "success",
            count: rows.length,
            data: rows
        });
    } catch (error: any) {
        res.status(500).json({ 
            status: "error", 
            message: "Error al obtener la lista de usuarios",
            error: error.message 
        });
    }
};