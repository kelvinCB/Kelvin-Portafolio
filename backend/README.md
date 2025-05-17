# Sistema de Gestión de Mensajes para Portfolio

Este sistema extiende tu portafolio web con una base de datos MongoDB para almacenar los mensajes recibidos a través del formulario de contacto.

## Características Implementadas

- **Almacenamiento en MongoDB**: Todos los mensajes se guardan en una base de datos, además de enviarse por correo.
- **Encriptación de datos**: La información sensible (email, teléfono, mensaje) se almacena encriptada.
- **Panel de administración**: Gestiona todos los mensajes recibidos.
- **Exportación a CSV**: Exporta todos los mensajes a formato CSV para análisis.
- **Seguridad**: Implementación de rate limiting, sanitización de datos y protección contra ataques comunes.
- **Paginación y filtrado**: Para gestionar grandes volúmenes de mensajes.
- **Backups automáticos**: La base de datos se respalda diariamente.

## Requisitos

- Node.js >= 14.x
- MongoDB >= 4.4
- Herramientas de MongoDB (para backups)

## Instalación

1. **Instalar dependencias**:
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno**:
   Copia el archivo `.env-example` a `.env` y configura las variables necesarias:
   ```bash
   cp .env-example .env
   # Edita el archivo .env con tu editor preferido
   ```

3. **Iniciar MongoDB** (si es local):
   ```bash
   # Ejemplo para iniciar MongoDB localmente
   mongod --dbpath=/ruta/a/data
   ```

4. **Crear usuario administrador**:
   ```bash
   npm run create-admin
   ```

5. **Iniciar el servidor**:
   ```bash
   npm start
   # Para desarrollo con recarga automática:
   npm run dev
   ```

## Panel de Administración

Para acceder al panel de administración, inicia sesión en:
```
http://localhost:5000/admin
```

Con las credenciales creadas en el paso 4.

## Respaldos

Los respaldos se realizan automáticamente cada 24 horas y se almacenan en la carpeta `backups`.

Para realizar un respaldo manual:
```bash
npm run backup
```

## Despliegue en Netlify

Para desplegar en Netlify, necesitarás:

1. Configurar una base de datos MongoDB en la nube (MongoDB Atlas)
2. Configurar las variables de entorno en Netlify
3. Configurar las funciones serverless para el backend

## Estructura del proyecto

```
backend/
├── config/           # Configuración (base de datos, etc.)
├── controllers/      # Controladores de la API
├── middleware/       # Middleware (auth, seguridad)
├── models/           # Modelos de datos
├── routes/           # Rutas de la API
├── scripts/          # Scripts de utilidad
├── backups/          # Respaldos de la base de datos
├── exports/          # Archivos CSV exportados
└── index.js          # Punto de entrada
```
