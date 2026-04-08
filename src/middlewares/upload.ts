import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Asegurarnos de que la carpeta existe para que no pete
const dir = './uploads/recetas';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir); // Los archivos irán aquí
    },
    filename: (req, file, cb) => {
        // Nombre único: timestamp + extensión original
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ storage });