# Guía de Implementación en Producción

Este documento contiene instrucciones detalladas para implementar el proyecto de portafolio y el panel de administración en un entorno de producción.

## Estructura del Proyecto

El proyecto consta de dos partes principales:

1. **Backend**: API REST desarrollada con Node.js y Express
2. **Admin Panel**: Interfaz de administración desarrollada con React y Material UI

## Requisitos Previos

- **Backend**: Servidor VPS (Contabo) con Node.js y PostgreSQL
- **Frontend**: [Netlify](https://www.netlify.com/)

### 1. Preparación del Backend (VPS)

1. **Configurar el servidor**:
   - Conéctate vía SSH: `ssh kelvin@86.48.24.125`
   - Clona el repositorio y configura el archivo `.env`.
   - Inicializa la base de datos PostgreSQL.

2. **Gestión de procesos**:
   - Usa **PM2** para mantener el servidor activo: `pm2 start backend/index.js --name portfolio-backend`

3. **Proxy Inverso**:
   - Configura **Nginx** para redirigir el tráfico del puerto 80 al puerto 5000 de tu aplicación Node.js.

### 2. Implementación del Panel de Administración en Netlify

1. **Preparar el build de producción**:
   ```bash
   # Navegar a la carpeta del admin panel
   cd admin-panel
   
   # Asegurarse de que las dependencias estén instaladas
   npm install
   
   # Crear build de producción
   npm run build:prod
   ```

2. **Subir a Netlify**:
   - Desde la interfaz de Netlify, arrastra la carpeta `build` para un despliegue manual, o
   - Configura la implementación automática conectando tu repositorio de GitHub

3. **Configuración en Netlify**:
   - Configura la redirección de todas las rutas a `index.html` (ya está en el archivo `netlify.toml`)
   - En "Site settings > Build & deploy > Environment", agrega las variables de entorno:
     - `REACT_APP_API_URL`: URL completa de tu API backend (con https://)
     - `REACT_APP_CONTACT_PHONE`: Tu número de teléfono para WhatsApp
     - `REACT_APP_DEFAULT_WHATSAPP_MESSAGE`: Mensaje predeterminado para WhatsApp

### 3. Verificación Post-Implementación

1. **Comprobar la conexión frontend-backend**:
   - Accede a tu sitio publicado en Netlify
   - Intenta iniciar sesión con las credenciales de administrador
   - Verifica que puedas ver y gestionar los mensajes

2. **Verificar funcionalidades críticas**:
   - Respuestas por WhatsApp
   - Exportación de mensajes
   - Notificaciones por correo electrónico

## Solución de Problemas Comunes

### CORS (Cross-Origin Resource Sharing)
Si encuentras errores de CORS, asegúrate de que el backend esté configurado correctamente:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Problemas de conexión con MongoDB
Si el backend no puede conectarse a MongoDB Atlas, verifica:
- Lista blanca de IP en MongoDB Atlas (o usa 0.0.0.0/0 para permitir todas las IPs)
- Credenciales correctas en el archivo .env
- Formato correcto de la URL de conexión

### Error 404 al recargar páginas en Netlify
Asegúrate de que las redirecciones estén configuradas correctamente en `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Mantenimiento

- **Backups**: Los backups automáticos de la base de datos están configurados en el backend
- **Actualizaciones**: Programa actualizaciones regulares de dependencias
- **Monitoreo**: Considera implementar una solución de monitoreo como Sentry o LogRocket

## Contacto y Soporte

Para cualquier problema o consulta, contacta al desarrollador:
- **Email**: kelvinc0219@gmail.com
