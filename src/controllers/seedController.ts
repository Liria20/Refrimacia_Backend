import { Request, Response } from 'express';
import db from '../../db.js';
import bcrypt from 'bcryptjs';
import { fakerES as faker } from '@faker-js/faker'; 

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

        // --- DICCIONARIOS PROPIOS EN ESPAÑOL ---
        const titulosPlatos = [
            "Tortilla de Patatas", "Paella Valenciana", "Gazpacho Fresco", "Croquetas Caseras", 
            "Lentejas con Chorizo", "Pollo al Horno", "Macarrones con Queso", "Ensalada Mixta", 
            "Tacos al Pastor", "Sopa de Fideos", "Huevos Rotos con Jamón", "Salmón a la Plancha", 
            "Tarta de Queso", "Bizcocho de Limón", "Tostadas de Aguacate", "Macedonia de Frutas"
        ];
        
        const descripciones = [
            "Una receta tradicional, llena de sabor y perfecta para disfrutar en familia.",
            "Plato rápido y sencillo de preparar, ideal para cuando tienes poco tiempo.",
            "Un clásico de la cocina casera. Te recordará a las comidas de tu abuela.",
            "Receta saludable y ligera, perfecta para cuidarte sin perder el sabor.",
            "Un plato contundente y delicioso, espectacular para mojar pan.",
            "El toque dulce perfecto que dejará a todos tus invitados con ganas de más."
        ];
        
        const listaIngredientes = [
            "Tomate", "Cebolla", "Ajo", "Aceite de Oliva", "Sal", "Patatas", "Huevos", 
            "Pimienta", "Pollo", "Queso", "Jamón", "Arroz", "Pasta", "Zanahoria", "Pimiento"
        ];

        // --- 2. GENERAR 50 RECETAS ---
        console.log("🥘 Generando 50 recetas en riguroso español...");
        const tipos = ['Desayuno', 'Almuerzo', 'Comida', 'Merienda', 'Cena', 'Postre', 'Snack'];
        
        for (let i = 0; i < 50; i++) {
            const idAutor = userIds[Math.floor(Math.random() * userIds.length)];
            const tiempoAzar = faker.number.int({ min: 10, max: 150 });

            // Seleccionamos datos aleatorios de nuestros diccionarios
            const tituloAzar = titulosPlatos[Math.floor(Math.random() * titulosPlatos.length)];
            const descAzar = descripciones[Math.floor(Math.random() * descripciones.length)];
            
            // Cogemos 3 ingredientes al azar y los juntamos
            const ing1 = listaIngredientes[Math.floor(Math.random() * listaIngredientes.length)];
            const ing2 = listaIngredientes[Math.floor(Math.random() * listaIngredientes.length)];
            const ing3 = listaIngredientes[Math.floor(Math.random() * listaIngredientes.length)];
            const ingredientesAzar = `${ing1}, ${ing2}, ${ing3}`;

            const [r]: any = await db.query(
                `INSERT INTO TReceta (titulo_receta, descripcion, ingredientes, tipo_receta, tiempo_preparacion, imagen_receta, id_usuario) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [
                    tituloAzar,
                    descAzar,
                    ingredientesAzar,
                    tipos[Math.floor(Math.random() * tipos.length)],
                    tiempoAzar,
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

        res.json({ status: "success", message: "Base de datos reseteada con datos 100% en español." });

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