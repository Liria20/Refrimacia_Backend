import { Request, Response } from 'express';
import db from '../../db.js';
import bcrypt from 'bcryptjs';
import { fakerES as faker } from '@faker-js/faker';
import { getRandomReceta } from '../helpers/elementosGenerador/Recetas.js';
import { getComentarioCongruente } from '../helpers/elementosGenerador/Comentarios.js';

export const ejecutarSeed = async (req: Request, res: Response) => {
    const { clave_secreta } = req.body;

    if (clave_secreta !== 'Sembrar2026!') {
        return res.status(403).json({ message: "Error de clave" });
    }

    try {
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

        const passwordHashed = await bcrypt.hash('password123', 10);
        const userIds: number[] = [];
        
        // 🟢 CAMBIO: Guardamos el ID y el Título para luego saber qué comentarios poner
        const recetasCreadas: { id: number, titulo: string }[] = [];

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

        // --- 2. GENERAR 50 RECETAS ---
        console.log("🥘 Generando 50 recetas con mis datos reales y coherentes...");

        for (let i = 0; i < 50; i++) {
            const idAutor = userIds[Math.floor(Math.random() * userIds.length)];
            const tiempoAzar = faker.number.int({ min: 10, max: 150 });

            const recetaPerfecta = getRandomReceta();

            // 🟢 CAMBIO AQUÍ: Añadimos todos los campos nutricionales y la dificultad al INSERT
            const [r]: any = await db.query(
                `INSERT INTO TReceta 
                 (titulo_receta, descripcion, ingredientes, tipo_receta, tiempo_preparacion, imagen_receta, id_usuario, 
                  kcal, proteinas, carbohidratos, grasas, fibra, semaforo, consumo_habitual, dificultad) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    recetaPerfecta.titulo,
                    recetaPerfecta.descripcion,
                    recetaPerfecta.ingredientes,
                    recetaPerfecta.tipo,
                    recetaPerfecta.tiempo_preparacion || tiempoAzar, // Usa el del array, si no existe usa el azar
                    recetaPerfecta.imagen,
                    idAutor,
                    recetaPerfecta.kcal || 0,
                    recetaPerfecta.proteinas || 0,
                    recetaPerfecta.carbohidratos || 0,
                    recetaPerfecta.grasas || 0,
                    recetaPerfecta.fibra || 0,
                    recetaPerfecta.semaforo || 'gris',
                    recetaPerfecta.consumo_habitual || 'No disponible',
                    recetaPerfecta.dificultad || 'Media'
                ]
            );
            
            // 🟢 CAMBIO: Metemos el objeto a nuestro array
            recetasCreadas.push({ id: r.insertId, titulo: recetaPerfecta.titulo });
        }

        // --- 3. VALORACIONES ---
        for (const receta of recetasCreadas) {
            // 🟢 CAMBIO: Aumentadas las valoraciones (ahora entre 5 y 15 por receta)
            const numVotos = faker.number.int({ min: 5, max: 15 });
            for (let j = 0; j < numVotos; j++) {
                const idVotante = userIds[Math.floor(Math.random() * userIds.length)];
                await db.query(`INSERT IGNORE INTO TValoracion (id_receta, id_usuario, puntuacion) VALUES (?, ?, ?)`, [receta.id, idVotante, faker.number.int({ min: 1, max: 5 })]);
            }
        }

        // --- 4. COMENTARIOS CONGRUENTES ---
        for (const receta of recetasCreadas) {
            // Subimos un pelín los comentarios para que haya más actividad
            const numComentarios = faker.number.int({ min: 1, max: 4 });
            for (let k = 0; k < numComentarios; k++) {
                const idComentarista = userIds[Math.floor(Math.random() * userIds.length)];
                
                // 🟢 CAMBIO: Usamos tu función inteligente
                const comentarioElegido = getComentarioCongruente(receta.titulo);
                
                await db.query(`INSERT INTO TComentario (id_receta, id_usuario, mensaje) VALUES (?, ?, ?)`, [receta.id, idComentarista, comentarioElegido]);
            }
        }

        res.json({ status: "success", message: "Base de datos reseteada con datos 100% en español, congruentes y con más valoraciones." });

    } catch (error: any) {
        console.error("❌ Error en el Seed:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const limpiarTablas = async (req: Request, res: Response) => {
    const { clave_secreta } = req.body;
    if (clave_secreta !== 'Sembrar2026!') return res.status(403).json({ message: "Clave incorrecta" });

    try {
        const [usuarios]: any = await db.query(
            'SELECT id_usuario FROM TUsuario WHERE correo_electronico LIKE ?',
            ['%@refrimancia.test']
        );

        if (!usuarios || usuarios.length === 0) {
            return res.json({ status: "success", message: "Nada que limpiar, no hay usuarios de prueba." });
        }

        const ids = usuarios.map((u: any) => u.id_usuario);

        console.log(`🧹 Limpiando datos de ${ids.length} usuarios...`);

        await db.query('DELETE FROM TValoracion WHERE id_usuario IN (?)', [ids]);
        await db.query('DELETE FROM TComentario WHERE id_usuario IN (?)', [ids]);
        await db.query('DELETE FROM TComentario WHERE id_receta IN (SELECT id_receta FROM TReceta WHERE id_usuario IN (?))', [ids]);
        await db.query('DELETE FROM TValoracion WHERE id_receta IN (SELECT id_receta FROM TReceta WHERE id_usuario IN (?))', [ids]);
        await db.query('DELETE FROM TReceta WHERE id_usuario IN (?)', [ids]);
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