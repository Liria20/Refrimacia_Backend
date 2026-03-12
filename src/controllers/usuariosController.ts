import { Request, Response } from 'express';
import db from '../../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    const { 
        nombre_usuario, 
        contrasena, 
        correo_electronico, 
        nombre_completo, 
        fecha_nac, 
        imagen_perfil 
    } = req.body;

    // 1. Validación de campos obligatorios
    if (!nombre_usuario || !contrasena || !correo_electronico || !nombre_completo || !fecha_nac) {
        return res.status(400).json({ 
            status: "error", 
            message: "Faltan datos obligatorios" 
        });
    }

    try {
        // 2. ENCRIPTACIÓN DE CONTRASEÑA
        // Generamos un "salt" (una semilla aleatoria para el hash)
        const salt = await bcrypt.genSalt(10);
        // Creamos el hash de la contraseña original
        const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

        // 3. INSERCIÓN EN LA DB
        const query = `
            INSERT INTO TUsuario 
            (nombre_usuario, contrasena, correo_electronico, nombre_completo, fecha_nac, imagen_perfil) 
            VALUES (?, ?, ?, ?, ?, ?)`;

        const [result]: any = await db.query(query, [
            nombre_usuario, 
            contrasenaHasheada, // <--- Guardamos la versión encriptada
            correo_electronico, 
            nombre_completo, 
            fecha_nac, 
            imagen_perfil || null 
        ]);

        res.status(201).json({
            status: "success",
            message: "Usuario registrado con éxito. Ahora sus datos están protegidos.",
            id: result.insertId
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

export const loginUsuario = async (req: Request, res: Response) => {
    const { nombre_usuario, contrasena } = req.body;

    try {
        // 1. Buscamos al usuario solo por su nombre
        const [rows]: any = await db.query(
            'SELECT * FROM TUsuario WHERE nombre_usuario = ?',
            [nombre_usuario]
        );

        // 2. Si el usuario existe, comparamos la contraseña encriptada
        if (rows.length > 0) {
            const usuario = rows[0];
            
            // Comparamos la clave que envía el usuario con el Hash de la DB
            const esValida = await bcrypt.compare(contrasena, usuario.contrasena);

            if (!esValida) {
                return res.status(401).json({ 
                    status: "error", 
                    message: "Usuario o contraseña incorrectos" 
                });
            }

            // 3. GENERAR EL TOKEN (Se crea uno nuevo en cada login)
            const token = jwt.sign(
                { 
                    id_usuario: usuario.id_usuario, 
                    nombre: usuario.nombre_usuario 
                },
                process.env.JWT_SECRET as string, // Tu clave secreta del .env
                { expiresIn: '2h' } // CADUCIDAD: El token muere en 2 horas
            );

            // Limpiamos datos sensibles antes de responder
            delete usuario.contrasena; 
            
            res.json({ 
                status: "success", 
                message: "Login correcto", 
                token: token, // <--- Este es el String que Android debe guardar
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