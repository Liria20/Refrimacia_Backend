import { Request, Response } from 'express';
import db from '../../db.js'; // Aquí sí funciona el import normal
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

export const ejecutarSeed = async (req: Request, res: Response) => {
    const { clave_secreta } = req.body;

    // 🛡️ SEGURIDAD: Si no mandan la clave correcta, los echamos
    if (clave_secreta !== 'Sembrar2026!') {
        return res.status(403).json({ status: "error", message: "Acceso denegado. Clave incorrecta." });
    }

    try {
        const passwordHashed = await bcrypt.hash('password123', 10);
        const userIds: number[] = [];

        // --- 1. USUARIOS ---
        for (let i = 0; i < 50; i++) {
            const [result]: any = await db.query(
                `INSERT INTO TUsuario (nombre_usuario, contrasena, correo_electronico, nombre_completo, fecha_nac, imagen_perfil) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    faker.internet.username(),
                    passwordHashed,
                    faker.internet.email(),
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

        res.json({ status: "success", message: "¡Base de datos sembrada con 100 registros nuevos!" });
    } catch (error: any) {
        console.error("Error en seed:", error);
        res.status(500).json({ status: "error", message: "Falló la siembra de datos." });
    }
};