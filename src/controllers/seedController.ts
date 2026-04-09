import { Request, Response } from 'express';
import db from '../../db.js'; // Aquí sí funciona el import normal
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import pool from '../../db.js';

export const ejecutarSeed = async (req: Request, res: Response) => {
    const { clave_secreta } = req.body;

    if (clave_secreta !== 'Sembrar2026!') {
        return res.status(403).json({ status: "error", message: "Clave incorrecta." });
    }

    try {
        const passwordHashed = await bcrypt.hash('password123', 10);
        const userIds: number[] = [];

        // --- 1. USUARIOS ---
        for (let i = 0; i < 50; i++) {
            // Creamos un correo que podamos identificar luego fácilmente
            const emailFicticio = `test_${faker.string.alphanumeric(10)}@refrimancia.test`;

            const [result]: any = await db.query(
                `INSERT INTO TUsuario (nombre_usuario, contrasena, correo_electronico, nombre_completo, fecha_nac, imagen_perfil) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    faker.internet.username(),
                    passwordHashed,
                    emailFicticio, // <-- Marcador
                    faker.person.fullName(),
                    faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.uuid()}`
                ]
            );
            userIds.push(result.insertId);
        }

        // --- 2. RECETAS ---
        const tipos = ['Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Snack'];
        for (let i = 0; i < 50; i++) {
            const idUsuarioAleatorio = userIds[Math.floor(Math.random() * userIds.length)];
            
            await db.query(
                `INSERT INTO TReceta (titulo_receta, descripcion, ingredientes, tipo_receta, imagen_receta, id_usuario) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    faker.food.dish(),
                    faker.food.description(),
                    faker.food.ingredient() + ", " + faker.food.ingredient(),
                    tipos[Math.floor(Math.random() * tipos.length)],
                    `https://loremflickr.com/640/480/food?lock=${i}`,
                    idUsuarioAleatorio
                ]
            );
        }

        res.json({ status: "success", message: "¡Siembra quirúrgica completada!" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error en la siembra." });
    }
};

export const limpiarTablas = async (req: Request, res: Response) => {
    const { clave_secreta } = req.body;

    if (clave_secreta !== 'Sembrar2026!') {
        return res.status(403).json({ status: "error", message: "Clave incorrecta." });
    }

    try {
        // 1. Identificamos primero a los usuarios que queremos borrar
        const [usuariosFicticios]: any = await db.query(
            'SELECT id_usuario FROM TUsuario WHERE correo_electronico LIKE "%@refrimancia.test"'
        );

        if (usuariosFicticios.length === 0) {
            return res.json({ status: "success", message: "No había datos ficticios que borrar." });
        }

        const idsParaBorrar = usuariosFicticios.map((u: any) => u.id_usuario);

        // 2. Borramos las recetas que pertenecen SOLO a esos usuarios
        // Usamos IN (?) para pasarle la lista de IDs
        await db.query('DELETE FROM TReceta WHERE id_usuario IN (?)', [idsParaBorrar]);

        // 3. Borramos los usuarios que coinciden con nuestro dominio de test
        await db.query('DELETE FROM TUsuario WHERE id_usuario IN (?)', [idsParaBorrar]);

        res.json({ 
            status: "success", 
            message: `Se han eliminado exactamente ${idsParaBorrar.length} usuarios ficticios y sus recetas.` 
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al limpiar datos ficticios." });
    }
};