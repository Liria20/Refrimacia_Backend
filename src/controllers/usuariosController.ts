import { Request, Response } from 'express';
import db from '../../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const modificarUsuario = async (req: Request, res: Response) => {
    const { id } = req.params; // El id_usuario que viene en la URL
    const idUsuarioToken = (req as any).user.id_usuario; // Extraído del token por el middleware

    // Verificación de seguridad: ¿Eres tú mismo?
    if (String(id) !== String(idUsuarioToken)) {
        return res.status(403).json({
            status: "error",
            message: "No tienes permiso para modificar este perfil."
        });
    }
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
    // 1. Ahora recibimos 'correo_electronico' en lugar de 'nombre_usuario'
    const { correo_electronico, contrasena } = req.body;

    try {
        // 2. Buscamos en la DB por correo
        const [rows]: any = await db.query(
            'SELECT * FROM TUsuario WHERE correo_electronico = ?',
            [correo_electronico]
        );

        if (rows.length > 0) {
            const usuario = rows[0];

            // 3. Verificamos la contraseña (como ya lo hacías)
            const esValida = await bcrypt.compare(contrasena, usuario.contrasena);

            if (!esValida) {
                return res.status(401).json({
                    status: "error",
                    message: "Correo o contraseña incorrectos"
                });
            }

            // 4. Generamos el token dinámico
            const token = jwt.sign(
                { id_usuario: usuario.id_usuario, nombre: usuario.nombre_usuario },
                process.env.JWT_SECRET as string,
                { expiresIn: '2h' }
            );

            // 5. Guardamos el token en la DB (Sesión única)
            await db.query(
                'UPDATE TUsuario SET ultimo_token = ? WHERE id_usuario = ?',
                [token, usuario.id_usuario]
            );

            delete usuario.contrasena;

            res.json({
                status: "success",
                message: "Login correcto",
                token: token,
                data: usuario
            });

        } else {
            res.status(401).json({
                status: "error",
                message: "Correo o contraseña incorrectos"
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

export const obtenerPerfilPrivado = async (req: Request, res: Response) => {
    // El ID viene del middleware de autenticación (el token que desciframos)
    const idUsuarioToken = (req as any).user.id_usuario;

    try {
        // Buscamos los datos del usuario en la base de datos
        const [rows]: any = await db.query(
            'SELECT id_usuario, nombre_usuario, imagen_perfil, nombre_completo, fecha_nac, correo_electronico FROM TUsuario WHERE id_usuario = ?',
            [idUsuarioToken]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado."
            });
        }

        const usuario = rows[0];

        res.json({
            status: "success",
            data: usuario
        });

    } catch (error: any) {
        console.error("❌ Error al obtener perfil:", error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor."
        });
    }
};

export const solicitarCodigoRecuperacion = async (req: Request, res: Response) => {
    const { correo_electronico } = req.body;

    if (!correo_electronico) {
        return res.status(400).json({ status: "error", message: "Debes proporcionar un correo." });
    }

    try {
        // 1. Comprobamos si el correo existe
        const [rows]: any = await db.query('SELECT id_usuario FROM TUsuario WHERE correo_electronico = ?', [correo_electronico]);

        if (rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Este correo no está registrado." });
        }

        // 2. Generamos el código
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Lo guardamos en la DB
        await db.query('UPDATE TUsuario SET codigo_verificacion = ? WHERE correo_electronico = ?', [codigo, correo_electronico]);

        // 4. ENVÍO CON BREVO 🚀
        const emailData = {
            sender: {
                name: "RefriMancia",
                email: "evagr4121@gmail.com"
            },
            to: [
                { email: correo_electronico }
            ],
            subject: "Recuperación de Contraseña - RefriMancia",
            htmlContent: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>Recuperación de contraseña</h2>
                    <p>Has solicitado restablecer tu contraseña. Introduce este código en la aplicación:</p>
                    <h1 style="color: #FF5722; letter-spacing: 5px;">${codigo}</h1>
                    <p>Si no has sido tú, ignora este mensaje.</p>
                </div>
            `
        };

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY as string,
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Error de Brevo:", errorData);
            return res.status(400).json({ status: "error", message: "Fallo al enviar correo desde el servidor." });
        }

        // ⏱️ TEMPORIZADOR DE AUTODESTRUCCIÓN (5 MINUTOS) ⏱️
        setTimeout(async () => {
            try {
                await db.query('UPDATE TUsuario SET codigo_verificacion = NULL WHERE correo_electronico = ?', [correo_electronico]);
                console.log(`⏱️ El código de ${correo_electronico} ha expirado y ha sido borrado.`);
            } catch (err) {
                console.error("Error al intentar borrar el código expirado:", err);
            }
        }, 5 * 60 * 1000);

        res.json({ status: "success", message: "Código enviado al correo con éxito. Caduca en 5 minutos." });

    } catch (error: any) {
        console.error("❌ Error en el servidor:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const cambiarContrasena = async (req: Request, res: Response) => {
    // Android nos enviará estas 3 cosas
    const { correo_electronico, codigo, nueva_contrasena } = req.body;

    if (!correo_electronico || !codigo || !nueva_contrasena) {
        return res.status(400).json({ status: "error", message: "Faltan datos obligatorios." });
    }

    try {
        // 1. Verificamos si el código coincide EXACTAMENTE con el de la base de datos
        const [rows]: any = await db.query(
            'SELECT id_usuario FROM TUsuario WHERE correo_electronico = ? AND codigo_verificacion = ?',
            [correo_electronico, codigo]
        );

        if (rows.length === 0) {
            return res.status(400).json({ status: "error", message: "El código es incorrecto o ha caducado." });
        }

        // 2. Si el código es correcto, encriptamos la NUEVA contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasenaHasheada = await bcrypt.hash(nueva_contrasena, salt);

        // 3. Actualizamos la contraseña y BORRAMOS el código para que no se pueda reutilizar
        await db.query(
            'UPDATE TUsuario SET contrasena = ?, codigo_verificacion = NULL WHERE correo_electronico = ?',
            [contrasenaHasheada, correo_electronico]
        );

        res.json({ status: "success", message: "¡Contraseña actualizada correctamente!" });

    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};