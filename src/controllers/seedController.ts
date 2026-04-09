import { Request, Response } from 'express';
import db from '../../db.js'; // Aquí sí funciona el import normal
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import pool from '../../db.js';

export const ejecutarSeed = async (req: Request, res: Response) => {
    const { clave_secreta } = req.body;

    // 🛡️ SEGURIDAD
    if (clave_secreta !== 'Sembrar2026!') {
        return res.status(403).json({ message: "Error de clave" });
    }

    try {
        // --- 0. AUTO-LIMPIEZA (Borrar solo lo generado por el seed anteriormente) ---
        console.log("🧹 Buscando datos de prueba antiguos para limpiar...");
        const [usuariosViejos]: any = await db.query(
            'SELECT id_usuario FROM TUsuario WHERE correo_electronico LIKE ?',
            ['%@refrimancia.test']
        );

        if (usuariosViejos.length > 0) {
            const idsViejos = usuariosViejos.map((u: any) => u.id_usuario);
            
            // Borramos en orden para no romper las claves foráneas
            await db.query('DELETE FROM TValoracion WHERE id_usuario IN (?) OR id_receta IN (SELECT id_receta FROM TReceta WHERE id_usuario IN (?))', [idsViejos, idsViejos]);
            await db.query('DELETE FROM TComentario WHERE id_usuario IN (?) OR id_receta IN (SELECT id_receta FROM TReceta WHERE id_usuario IN (?))', [idsViejos, idsViejos]);
            await db.query('DELETE FROM TReceta WHERE id_usuario IN (?)', [idsViejos]);
            await db.query('DELETE FROM TUsuario WHERE id_usuario IN (?)', [idsViejos]);
            
            console.log(`✅ Limpieza completada (${idsViejos.length} usuarios eliminados).`);
        }

        // --- Configuración inicial ---
        const passwordHashed = await bcrypt.hash('password123', 10);
        const userIds: number[] = [];
        const recipeIds: number[] = [];

        // --- 1. GENERAR 50 USUARIOS ---
        console.log("👤 Generando 50 usuarios...");
        for (let i = 0; i < 50; i++) {
            const email = `test_${faker.string.alphanumeric(8)}@refrimancia.test`;
            const [u]: any = await db.query(
                `INSERT INTO TUsuario (nombre_usuario, contrasena, correo_electronico, nombre_completo, fecha_nac, imagen_perfil) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    faker.internet.username(), // userName con N mayúscula para versiones modernas de Faker
                    passwordHashed,
                    email,
                    faker.person.fullName(),
                    faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.uuid()}`
                ]
            );
            userIds.push(u.insertId);
        }

        // --- 2. GENERAR 50 RECETAS ---
        console.log("🥘 Generando 50 recetas...");
        const tipos = ['Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Snack'];
        for (let i = 0; i < 50; i++) {
            const idAutor = userIds[Math.floor(Math.random() * userIds.length)];
            const [r]: any = await db.query(
                `INSERT INTO TReceta (titulo_receta, descripcion, ingredientes, tipo_receta, imagen_receta, id_usuario) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    faker.food.dish(),
                    faker.food.description(),
                    `${faker.food.ingredient()}, ${faker.food.ingredient()}, ${faker.food.ingredient()}`,
                    tipos[Math.floor(Math.random() * tipos.length)],
                    `https://loremflickr.com/640/480/food?lock=${i}`,
                    idAutor
                ]
            );
            recipeIds.push(r.insertId);
        }

        // --- 3. GENERAR VALORACIONES AL AZAR ---
        console.log("⭐ Generando valoraciones...");
        for (const idReceta of recipeIds) {
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
        const frases = ["¡Increíble receta!", "Me encantó el sabor.", "Fácil y muy rico.", "A mi familia le flipó.", "La repetiré seguro.", "Súper saludable."];
        
        for (const idReceta of recipeIds) {
            const numComentarios = faker.number.int({ min: 0, max: 3 });
            for (let k = 0; k < numComentarios; k++) {
                const idComentarista = userIds[Math.floor(Math.random() * userIds.length)];
                await db.query(
                    `INSERT INTO TComentario (id_receta, id_usuario, mensaje) VALUES (?, ?, ?)`,
                    [idReceta, idComentarista, frases[Math.floor(Math.random() * frases.length)]]
                );
            }
        }

        res.json({ 
            status: "success", 
            message: "Base de datos refrescada con éxito. Se borró lo anterior y se crearon 100 registros nuevos (50 usuarios + 50 recetas) con interacciones." 
        });

    } catch (error: any) {
        console.error("❌ Error en el Seed:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const limpiarTablas = async (req: Request, res: Response) => {
    const { clave_secreta } = req.body;
    if (clave_secreta !== 'Sembrar2026!') return res.status(403).json({ message: "Clave incorrecta" });

    try {
        // 1. Buscamos los IDs usando un marcador de posición '?'
        // NOTA: Pasamos el valor en un array como segundo argumento
        const [usuarios]: any = await db.query(
            'SELECT id_usuario FROM TUsuario WHERE correo_electronico LIKE ?', 
            ['%@refrimancia.test']
        );
        
        if (!usuarios || usuarios.length === 0) {
            return res.json({ status: "success", message: "Nada que limpiar, no hay usuarios de prueba." });
        }

        const ids = usuarios.map((u: any) => u.id_usuario);

        // 2. BORRADO EN CASCADA
        // Importante: En mysql2, para la cláusula IN, el array debe ir dentro de otro array: [ [1,2,3] ]
        
        console.log(`🧹 Limpiando datos de ${ids.length} usuarios...`);

        // A. Borrar valoraciones
        await db.query('DELETE FROM TValoracion WHERE id_usuario IN (?)', [ids]);
        
        // B. Borrar comentarios de esos usuarios
        await db.query('DELETE FROM TComentario WHERE id_usuario IN (?)', [ids]);
        
        // C. Borrar comentarios y valoraciones que otros hayan hecho en las RECETAS de estos usuarios
        await db.query('DELETE FROM TComentario WHERE id_receta IN (SELECT id_receta FROM TReceta WHERE id_usuario IN (?))', [ids]);
        await db.query('DELETE FROM TValoracion WHERE id_receta IN (SELECT id_receta FROM TReceta WHERE id_usuario IN (?))', [ids]);
        
        // D. Borrar las recetas de esos usuarios
        await db.query('DELETE FROM TReceta WHERE id_usuario IN (?)', [ids]);

        // E. Finalmente, borrar los usuarios
        await db.query('DELETE FROM TUsuario WHERE id_usuario IN (?)', [ids]);

        res.json({ 
            status: "success", 
            message: `Limpieza total realizada. Se eliminaron ${ids.length} usuarios y todo su contenido.` 
        });

    } catch (error: any) {
        console.error("Error en la limpieza:", error);
        res.status(500).json({ 
            status: "error", 
            message: "No se pudo limpiar la base de datos.",
            detalle: error.message 
        });
    }
};