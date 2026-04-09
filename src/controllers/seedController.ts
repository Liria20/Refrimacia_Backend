import { Request, Response } from 'express';
import db from '../../db.js'; // Aquí sí funciona el import normal
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import pool from '../../db.js';

export const ejecutarSeed = async (req: Request, res: Response) => {
    const { clave_secreta } = req.body;
    if (clave_secreta !== 'Sembrar2026!') return res.status(403).json({ message: "Error de clave" });

    try {
        const passwordHashed = await bcrypt.hash('password123', 10);
        const userIds: number[] = [];
        const recipeIds: number[] = [];

        // --- 1. GENERAR 50 USUARIOS ---
        for (let i = 0; i < 50; i++) {
            const email = `test_${faker.string.alphanumeric(8)}@refrimancia.test`;
            const [u]: any = await db.query(
                `INSERT INTO TUsuario (nombre_usuario, contrasena, correo_electronico, nombre_completo, fecha_nac, imagen_perfil) VALUES (?,?,?,?,?,?)`,
                [faker.internet.username(), passwordHashed, email, faker.person.fullName(), faker.date.birthdate(), `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.uuid()}`]
            );
            userIds.push(u.insertId);
        }

        // --- 2. GENERAR 50 RECETAS ---
        const tipos = ['Desayuno', 'Almuerzo', 'Cena', 'Postre'];
        for (let i = 0; i < 50; i++) {
            const idAutor = userIds[Math.floor(Math.random() * userIds.length)];
            const [r]: any = await db.query(
                `INSERT INTO TReceta (titulo_receta, descripcion, ingredientes, tipo_receta, imagen_receta, id_usuario) VALUES (?,?,?,?,?,?)`,
                [faker.food.dish(), faker.food.description(), faker.food.ingredient(), tipos[Math.floor(Math.random() * tipos.length)], `https://loremflickr.com/640/480/food?lock=${i}`, idAutor]
            );
            recipeIds.push(r.insertId);
        }

        // --- 3. GENERAR VALORACIONES AL AZAR ---
        console.log("⭐ Generando valoraciones...");
        for (const idReceta of recipeIds) {
            // Cada receta tendrá entre 1 y 5 valoraciones de usuarios aleatorios
            const numVotos = faker.number.int({ min: 1, max: 5 });
            for (let j = 0; j < numVotos; j++) {
                const idVotante = userIds[Math.floor(Math.random() * userIds.length)];
                await db.query(
                    `INSERT IGNORE INTO TValoracion (id_receta, id_usuario, puntuacion) VALUES (?, ?, ?)`,
                    [idReceta, idVotante, faker.number.int({ min: 1, max: 5 })]
                );
            }
        }

        // --- 4. GENERAR COMENTARIOS AL AZAR ---
        console.log("💬 Generando comentarios...");
        const frasesComida = ["¡Increíble receta!", "Me encantó el sabor.", "Fácil de hacer y muy rico.", "A mi familia le flipó.", "No me convenció mucho el punto de sal.", "La repetiré seguro."];
        
        for (const idReceta of recipeIds) {
            const numComentarios = faker.number.int({ min: 0, max: 3 });
            for (let k = 0; k < numComentarios; k++) {
                const idComentarista = userIds[Math.floor(Math.random() * userIds.length)];
                await db.query(
                    `INSERT INTO TComentario (id_receta, id_usuario, mensaje) VALUES (?, ?, ?)`,
                    [idReceta, idComentarista, frasesComida[Math.floor(Math.random() * frasesComida.length)]]
                );
            }
        }

        res.json({ status: "success", message: "¡App llena de vida! Creados usuarios, recetas, estrellas y comentarios." });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const limpiarTablas = async (req: Request, res: Response) => {
    const { clave_secreta } = req.body;
    if (clave_secreta !== 'Sembrar2026!') return res.status(403).json({ message: "Clave incorrecta" });

    try {
        // 1. Buscamos los IDs de usuarios ficticios (@refrimancia.test)
        const [usuarios]: any = await db.query('SELECT id_usuario FROM TUsuario WHERE correo_electronico LIKE "%@refrimancia.test"');
        
        if (usuarios.length === 0) return res.json({ message: "Nada que limpiar" });
        const ids = usuarios.map((u: any) => u.id_usuario);

        // 2. BORRADO EN CASCADA MANUAL (De lo más pequeño a lo más grande)
        
        // A. Borrar valoraciones de esos usuarios o de sus recetas
        await db.query('DELETE FROM TValoracion WHERE id_usuario IN (?)', [ids]);
        
        // B. Borrar comentarios de esos usuarios
        await db.query('DELETE FROM TComentario WHERE id_usuario IN (?)', [ids]);
        
        // C. Borrar recetas de esos usuarios
        // (Nota: Si las recetas tienen comentarios de OTROS usuarios, habría que borrarlos también)
        await db.query('DELETE FROM TComentario WHERE id_receta IN (SELECT id_receta FROM TReceta WHERE id_usuario IN (?))', [ids]);
        await db.query('DELETE FROM TValoracion WHERE id_receta IN (SELECT id_receta FROM TReceta WHERE id_usuario IN (?))', [ids]);
        await db.query('DELETE FROM TReceta WHERE id_usuario IN (?)', [ids]);

        // D. Finalmente, borrar los usuarios
        await db.query('DELETE FROM TUsuario WHERE id_usuario IN (?)', [ids]);

        res.json({ status: "success", message: "Limpieza total realizada." });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: "error", message: error.message });
    }
};