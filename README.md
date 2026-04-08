# 🍎 Refrimancia API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

Backend modular para la gestión de recetas y usuarios de la aplicación **Refrimancia**.

---

## 🚀 Despliegue con Docker

Para levantar el servidor y la base de datos (con tablas automáticas):

```bash
Instalaciones:

-- Librerias para generar tokens y encriptar contraseñas
yarn add jsonwebtoken bcryptjs
yarn add -D @types/jsonwebtoken @types/bcryptjs



docker-compose up 

--------- Si se cambia algo:
# 1. Detener y borrar contenedores y redes
docker-compose down -v

# 2. Borrar la imagen de la app para que no use la versión vieja
docker rmi refrimancia-app

# 3. Volver a levantar todo desde cero
docker-compose up --build

## 📦 Gestión de Paquetes
Este proyecto utiliza **Yarn 4 (Berry)**. 
Para trabajar en local sin Docker, asegúrate de tener Corepack habilitado:
```bash
corepack enable
yarn install

## 🗄️ Acceso a la DB de Producción
Para gestionar los datos manualmente desde MySQL Workbench:
- **Host:** mysql-2de887c3-evagr4121-e4f8.d.aivencloud.com
- **Puerto:** 20045
- **Usuario:** avnadmin
- **SSL:** Requerido

Método,Endpoint,Descripción,Body JSON (Ejemplo)
GET ,/api/usuarios/listar,Ver todos los usuarios,(Ninguno)
POST ,/api/usuarios/crear,Registrar nuevo usuario,"{""nombre_usuario"": ""neo"", ""contrasena"": ""123"", ""correo_electronico"": ""a@a.com""}"
POST ,/api/usuarios/login,Validar credenciales,"{""nombre_usuario"": ""neo"", ""contrasena"": ""123""}"
PUT ,/api/usuarios/modificar/:id,Actualizar perfil,"{""nombre_completo"": ""Neo Martínez"", ""imagen_perfil"": ""url...""}"

Método,Endpoint,Descripción,Body JSON (Ejemplo)
GET ,/api/recetas/listar,Ver todas las recetas,(Sin parámetros)
POST ,/api/recetas/nueva,Publicar receta,"{""titulo_receta"": ""Pasta"", ""id_usuario"": 1, ...}"
