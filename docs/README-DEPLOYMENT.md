# Guía de Implementación en Producción

Este documento contiene instrucciones detalladas para implementar el proyecto de portafolio y el panel de administración en un entorno de producción.

## Estructura del Proyecto

El proyecto consta de dos partes principales:

1. **Backend**: API REST desarrollada con Node.js y Express
2. **Admin Panel**: Interfaz de administración desarrollada con React y Material UI

## Requisitos Previos

- Cuenta en [Netlify](https://www.netlify.com/) para el frontend
- Servidor para el backend (puede ser [Render](https://render.com/), [Heroku](https://www.heroku.com/), [DigitalOcean](https://www.digitalocean.com/), etc.)
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (ya configurada)

## Pasos para la Implementación

### 1. Preparación del Backend

1. **Configurar variables de entorno**:
   - Edita el archivo `.env.production` en la carpeta `/backend`
   - Actualiza `FRONTEND_URL`, `SUCCESS_URL` y `CANCEL_URL` con tu dominio real
   - Si es necesario, actualiza las credenciales de administrador

2. **Implementar en el servidor**:
   ```bash
   # Navegar a la carpeta del backend
   cd backend
   
   # Instalar dependencias de producción
   npm ci --production
   
   # Iniciar el servidor en modo producción
   NODE_ENV=production node index.js
   ```

3. **Importantes consideraciones de seguridad**:
   - Asegúrate de que el firewall del servidor permita conexiones en el puerto configurado
   - Configura un certificado SSL para HTTPS (recomendado Let's Encrypt)
   - Considera usar un proxy inverso como Nginx para manejar SSL y balanceo de carga

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
