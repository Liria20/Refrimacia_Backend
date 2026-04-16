import { Request, Response } from 'express';
import db from '../../db.js'; // Aquí sí funciona el import normal
import bcrypt from 'bcryptjs';
// 🟢 CAMBIO 1: Cambiamos { faker } por { fakerES as faker } para que todo salga en español
import { fakerES as faker } from '@faker-js/faker'; 
import pool from '../../db.js';

export const ejecutarSeed = async (req: Request, res: Response) => {
    const { clave_secreta } = req.body;

    // 🛡️ SEGURIDAD
    if (clave_secreta !== 'Sembrar2026!') {
        return res.status(403).json({ message: "Error de clave" });
    }

    try {
        // --- 0. AUTO-LIMPIEZA ---
        console.log("🧹 Buscando datos de prueba antiguos para limpiar...");
        const [usuariosViejos]: any = await db.query(
            'SELECT id_usuario FROM TUsuario WHERE correo_electronico LIKE ?',
            ['%@refrimancia.test']
        );

        if (usuariosViejos.length > 0) {
            const idsViejos = usuariosViejos.map((u: any) => u.id_usuario);
            await db.query('DELETE FROM TValoracion WHERE id_usuario IN (?) OR id_receta IN (SELECT id_receta FROM TReceta WHERE id_usuario IN (?))', [idsViejos, idsViejos]);
            await db.query('DELETE FROM TComentario WHERE id_usuario IN (?) OR id_receta IN (SELECT id_receta FROM TReceta WHERE id_usuario IN (?))', [idsViejos, idsViejos]);
            await db.query('DELETE FROM TReceta WHERE id_usuario IN (?)', [idsViejos]);
            await db.query('DELETE FROM TUsuario WHERE id_usuario IN (?)', [idsViejos]);
            console.log(`✅ Limpieza completada.`);
        }

        // --- Configuración inicial ---
        const passwordHashed = await bcrypt.hash('password123', 10);
        const userIds: number[] = [];
        const recipeIds: number[] = [];

        // --- 1. GENERAR 50 USUARIOS ---
        for (let i = 0; i < 50; i++) {
            const email = `test_${faker.string.alphanumeric(8)}@refrimancia.test`;
            const [u]: any = await db.query(
                `INSERT INTO TUsuario (nombre_usuario, contrasena, correo_electronico, nombre_completo, fecha_nac, imagen_perfil) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [faker.internet.username(), passwordHashed, email, faker.person.fullName(), faker.date.birthdate({ min: 18, max: 65, mode: 'age' }), `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.uuid()}`]
            );
            userIds.push(u.insertId);
        }

        // --- 2. GENERAR 50 RECETAS (Actualizado con tiempo_preparacion) ---
        console.log("🥘 Generando 50 recetas con tiempos...");
        
        // 🟢 CAMBIO 2: Añadimos la lista completa para que coja de todos los tipos
        const tipos = ['Desayuno', 'Almuerzo', 'Comida', 'Merienda', 'Cena', 'Postre', 'Snack'];
        
        for (let i = 0; i < 50; i++) {
            const idAutor = userIds[Math.floor(Math.random() * userIds.length)];
            
            // Generamos un tiempo aleatorio entre 10 y 150 minutos
            const tiempoAzar = faker.number.int({ min: 10, max: 150 });

            const [r]: any = await db.query(
                `INSERT INTO TReceta (titulo_receta, descripcion, ingredientes, tipo_receta, tiempo_preparacion, imagen_receta, id_usuario) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`, // <-- Añadido un '?' extra
                [
                    faker.food.dish(),
                    faker.food.description(),
                    `${faker.food.ingredient()}, ${faker.food.ingredient()}`,
                    tipos[Math.floor(Math.random() * tipos.length)],
                    tiempoAzar, // Pasamos el tiempo a la base de datos
                    `https://loremflickr.com/640/480/food?lock=${i}`,
                    idAutor
                ]
            );
            recipeIds.push(r.insertId);
        }

        // --- 3. VALORACIONES ---
        for (const idReceta of recipeIds) {
            const numVotos = faker.number.int({ min: 1, max: 5 });
            for (let j = 0; j < numVotos; j++) {
                const idVotante = userIds[Math.floor(Math.random() * userIds.length)];
                await db.query(`INSERT IGNORE INTO TValoracion (id_receta, id_usuario, puntuacion) VALUES (?, ?, ?)`, [idReceta, idVotante, faker.number.int({ min: 1, max: 5 })]);
            }
        }

        // --- 4. COMENTARIOS ---
        const frases = ["¡Increíble!", "Riquísimo.", "Fácil de hacer.", "A mi familia le encantó.", "La repetiré.", "Súper sana."];
        for (const idReceta of recipeIds) {
            const numComentarios = faker.number.int({ min: 0, max: 3 });
            for (let k = 0; k < numComentarios; k++) {
                const idComentarista = userIds[Math.floor(Math.random() * userIds.length)];
                await db.query(`INSERT INTO TComentario (id_receta, id_usuario, mensaje) VALUES (?, ?, ?)`, [idReceta, idComentarista, frases[Math.floor(Math.random() * frases.length)]]);
            }
        }

        res.json({ status: "success", message: "Base de datos reseteada con datos en español y todos los tipos de receta incluidos." });

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