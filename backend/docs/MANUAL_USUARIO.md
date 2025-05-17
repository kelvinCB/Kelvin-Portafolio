# Manual de Usuario - Sistema de Gestión de Mensajes

## Índice
- [Introducción](#introducción)
- [Acceso al Sistema](#acceso-al-sistema)
- [Panel de Administración](#panel-de-administración)
- [Gestión de Mensajes](#gestión-de-mensajes)
- [Exportación de Datos](#exportación-de-datos)
- [Respaldos de la Base de Datos](#respaldos-de-la-base-de-datos)
- [Seguridad](#seguridad)
- [Solución de Problemas](#solución-de-problemas)
- [Referencia de API](#referencia-de-api)

## Introducción

El Sistema de Gestión de Mensajes para tu Portafolio Web es una solución completa que permite almacenar, gestionar y exportar todos los mensajes recibidos a través del formulario de contacto. Además de enviar los mensajes por correo electrónico, el sistema guarda toda la información en una base de datos MongoDB con encriptación de datos sensibles.

### Características Principales

- **Almacenamiento seguro**: Todos los mensajes se guardan en MongoDB Atlas con encriptación de datos personales.
- **Panel de administración**: Interfaz intuitiva para gestionar mensajes recibidos.
- **Filtrado y búsqueda**: Encuentra rápidamente mensajes específicos.
- **Exportación a CSV**: Crea respaldos de tus mensajes en formato CSV.
- **Respaldos automáticos**: La base de datos se respalda diariamente.
- **Seguridad avanzada**: Protección contra ataques comunes, rate limiting y sanitización de datos.

## Acceso al Sistema

### Iniciar el Servidor

Para iniciar el sistema en modo desarrollo (con recarga automática):

```bash
cd backend
npm run dev
```

Para iniciar el servidor en modo producción:

```bash
cd backend
npm start
```

### Autenticación de Administrador

Para acceder a las funcionalidades de administración, necesitas autenticarte:

1. Realiza una solicitud POST a `/api/users/login` con tus credenciales:
   ```json
   {
     "email": "tu_email@ejemplo.com",
     "password": "tu_contraseña"
   }
   ```

2. Guarda el token JWT devuelto:
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR...",
     "user": {
       "id": "...",
       "username": "tu_nombre_usuario",
       "email": "tu_email@ejemplo.com",
       "role": "admin"
     }
   }
   ```

3. Incluye este token en las cabeceras de tus solicitudes:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
   ```

## Panel de Administración

> Nota: El panel de administración visual está pendiente de implementación. Actualmente, puedes gestionar todos los mensajes a través de la API REST.

## Gestión de Mensajes

### Listar Todos los Mensajes

**Endpoint**: `GET /api/messages`

Parámetros de consulta disponibles:
- `page`: Número de página (por defecto: 1)
- `limit`: Cantidad de mensajes por página (por defecto: 10)
- `read`: Filtrar por estado de lectura (`true`/`false`)
- `starred`: Filtrar mensajes destacados (`true`/`false`) 
- `tag`: Filtrar por etiqueta específica
- `search`: Buscar texto en nombre, email o mensaje
- `dateFrom`: Filtrar desde fecha (formato ISO)
- `dateTo`: Filtrar hasta fecha (formato ISO)

Ejemplo:
```
GET /api/messages?page=1&limit=20&read=false&search=proyecto
```

### Ver un Mensaje Específico

**Endpoint**: `GET /api/messages/:id`

Ejemplo:
```
GET /api/messages/60d21b4667d0d8992e610c85
```

### Marcar como Leído/No Leído

**Endpoint**: `PATCH /api/messages/:id/read`

Cuerpo de la solicitud:
```json
{
  "read": true
}
```

### Destacar/Quitar Destacado

**Endpoint**: `PATCH /api/messages/:id/star`

Cuerpo de la solicitud:
```json
{
  "starred": true
}
```

### Gestionar Etiquetas

**Endpoint**: `PATCH /api/messages/:id/tags`

Acciones disponibles:
- `add`: Añadir etiquetas
- `remove`: Eliminar etiquetas
- `set`: Establecer lista completa de etiquetas

Ejemplo para añadir etiquetas:
```json
{
  "tags": ["importante", "cliente", "proyecto"],
  "action": "add"
}
```

### Eliminar un Mensaje

**Endpoint**: `DELETE /api/messages/:id`

> Nota: Esta acción requiere permisos de administrador y es irreversible.

## Exportación de Datos

### Exportar Mensajes a CSV

**Endpoint**: `GET /api/messages/export`

Este endpoint soporta los mismos parámetros de filtrado que el listado de mensajes. El resultado es un archivo CSV descargable.

Ejemplo:
```
GET /api/messages/export?dateFrom=2025-01-01&dateTo=2025-05-01&starred=true
```

## Respaldos de la Base de Datos

### Backups Automáticos

El sistema realiza respaldos automáticos diarios de la base de datos MongoDB. Estos respaldos se almacenan en la carpeta `backend/backups` y se conservan los 7 más recientes.

### Backup Manual

Para realizar un respaldo manual:

```bash
cd backend
npm run backup
```

El backup se guardará en formato `.gz` con la fecha y hora actual.

## Seguridad

### Medidas de Seguridad Implementadas

- **Encriptación de datos**: Emails, teléfonos y mensajes se almacenan encriptados en la base de datos.
- **Rate limiting**: Protección contra ataques de fuerza bruta.
- **Sanitización de datos**: Prevención de inyección NoSQL.
- **Tokens JWT**: Autenticación segura con tiempo de expiración.
- **Contraseñas hasheadas**: Almacenamiento seguro de contraseñas con bcrypt.

### Cambiar Contraseña de Administrador

**Endpoint**: `PUT /api/users/password`

Cuerpo de la solicitud:
```json
{
  "currentPassword": "contraseña_actual",
  "newPassword": "nueva_contraseña"
}
```

> Importante: Se recomienda cambiar la contraseña del administrador después del primer inicio de sesión.

## Solución de Problemas

### El servidor no inicia

Verifica:
- La conexión a MongoDB está correctamente configurada en `.env`
- Todas las dependencias están instaladas (`npm install`)
- No hay otro servicio usando el mismo puerto

### Error de autenticación

Si recibes errores de autenticación:
- Verifica que el token JWT no ha expirado (validez: 24 horas)
- Asegúrate de que el formato del header es correcto: `Authorization: Bearer <token>`
- Verifica que las credenciales son correctas

### Recuperar contraseña de administrador

Si has olvidado la contraseña:

1. Detén el servidor
2. Elimina el usuario administrador actual:
   ```bash
   node scripts/deleteAdminUser.js
   ```
3. Edita el archivo `.env` con nuevas credenciales
4. Crea un nuevo usuario administrador:
   ```bash
   npm run create-admin
   ```

## Referencia de API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | `/api/users/login` | Iniciar sesión como administrador |
| GET    | `/api/users/profile` | Ver perfil del usuario actual |
| PUT    | `/api/users/password` | Cambiar contraseña |
| POST   | `/api/users/register` | Registrar nuevo administrador (solo admins) |

### Mensajes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | `/api/messages` | Crear nuevo mensaje (público) |
| GET    | `/api/messages` | Listar mensajes (con filtros) |
| GET    | `/api/messages/:id` | Ver un mensaje específico |
| PATCH  | `/api/messages/:id/read` | Actualizar estado de lectura |
| PATCH  | `/api/messages/:id/star` | Actualizar estado destacado |
| PATCH  | `/api/messages/:id/tags` | Gestionar etiquetas |
| DELETE | `/api/messages/:id` | Eliminar mensaje |
| GET    | `/api/messages/export` | Exportar mensajes a CSV |
