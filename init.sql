CREATE DATABASE IF NOT EXISTS RefriMancia;
USE RefriMancia;

CREATE TABLE TUsuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    imagen_perfil VARCHAR(255),
    nombre_completo VARCHAR(100),
    fecha_nac DATE,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    ultimo_token TEXT DEFAULT NULL,
    codigo_verificacion VARCHAR(6) DEFAULT NULL
);

CREATE TABLE TReceta (
    id_receta INT AUTO_INCREMENT PRIMARY KEY,
    imagen_receta VARCHAR(255),
    titulo_receta VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    ingredientes TEXT NOT NULL,
    tipo_receta VARCHAR(50) NOT NULL,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,

    CONSTRAINT fk_receta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES TUsuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE TComentario (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    mensaje TEXT NOT NULL,
    fecha_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_receta INT NOT NULL,

    CONSTRAINT fk_comentario_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES TUsuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_comentario_receta
        FOREIGN KEY (id_receta)
        REFERENCES TReceta(id_receta)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE TValoracion (
    id_valoracion INT AUTO_INCREMENT PRIMARY KEY,
    puntuacion TINYINT NOT NULL CHECK (puntuacion BETWEEN 0 AND 5),
    fecha_valoracion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_receta INT NOT NULL,

    CONSTRAINT fk_valoracion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES TUsuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_valoracion_receta
        FOREIGN KEY (id_receta)
        REFERENCES TReceta(id_receta)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT unique_usuario_receta
        UNIQUE (id_usuario, id_receta)
);