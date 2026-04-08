import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configuramos Cloudinary con tus llaves del .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Le decimos a Multer que use Cloudinary en lugar de tu carpeta local
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'refrimancia_uploads', // Se creará esta carpeta en tu nube
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos seguros
    } as any
});

// 3. Exportamos para usar en las rutas
export const upload = multer({ storage: storage });