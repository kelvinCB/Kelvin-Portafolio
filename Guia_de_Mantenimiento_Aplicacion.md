# Guía de Mantenimiento y Actualización de la Aplicación

## Índice
1. [Configuración del Entorno Local](#1-configuración-del-entorno-local)
2. [Desarrollo y Pruebas Locales](#2-desarrollo-y-pruebas-locales)
3. [Actualización del Backend](#3-actualización-del-backend)
4. [Actualización del Frontend](#4-actualización-del-frontend)
5. [Despliegue en Producción](#5-despliegue-en-producción)
6. [Mantenimiento Continuo](#6-mantenimiento-continuo)
7. [Solución de Problemas Comunes](#7-solución-de-problemas-comunes)

---

## 1. Configuración del Entorno Local

portfolio-ejemplo/          # Carpeta raíz (frontend principal)
├── src/
├── public/
├── package.json
├── admin-panel/           # Panel de administración
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/               # Servidor backend
    ├── routes/
    ├── models/
    └── package.json

### Backend (Node.js/Express)

1. **Instalar dependencias**:
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno**:
   - Asegúrate de tener un archivo `.env` en la carpeta `backend` con la siguiente estructura:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@clusterportafolio.xxxxx.mongodb.net/portfolio-contactos
   JWT_SECRET=tu_secreto_jwt
   ENCRYPTION_KEY=tu_clave_encriptacion
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_password_app
   STRIPE_SECRET_KEY=sk_test_xxx
   FRONTEND_URL=http://localhost:3000
   SUCCESS_URL=http://localhost:3000?success=true
   CANCEL_URL=http://localhost:3000?canceled=true
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=admin@example.com
   ```

3. **Iniciar el servidor en modo desarrollo**:
   ```bash
   cd backend
   npm run dev
   ```
   Esto iniciará el servidor con Nodemon para actualización automática.

### Frontend Principal (React)

1. **Instalar dependencias**:
   ```bash
   # Asegúrate de estar en la carpeta raíz del proyecto (portfolio-ejemplo)
   # Si estabas en la carpeta backend, sal de ella primero:
   cd .. 
   npm install
   ```

2. **Configurar variables de entorno**:
   - Crea un archivo `.env` en la raíz del proyecto:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_CONTACT_PHONE=18299698254
   REACT_APP_DEFAULT_WHATSAPP_MESSAGE="Hola, vi tu portafolio y me gustaria hablar contigo"
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm start
   ```
   Esto abrirá la aplicación en http://localhost:3000

### Panel de Administración (React)

1. **Instalar dependencias**:
   ```bash
   cd admin-panel
   npm install
   ```

2. **Configurar variables de entorno**:
   - Crea un archivo `.env` en la carpeta `admin-panel`:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   cd admin-panel
   npm start
   ```
   Esto abrirá el panel de administración en http://localhost:3001

---

## 2. Desarrollo y Pruebas Locales

### Flujo de Trabajo Recomendado

1. **Crear una rama de desarrollo**:
   ```bash
   git checkout -b feature/nombre-de-la-caracteristica
   ```

2. **Realizar cambios** en el código según sea necesario.

3. **Probar los cambios localmente**:
   - Backend: `npm run dev` (en la carpeta backend)
   - Frontend: `npm start` (en la raíz del proyecto)
   - Admin Panel: `npm start` (en la carpeta admin-panel)

4. **Commit de los cambios**:
   ```bash
   git add .
   git commit -m "Add feature: description of changes"
   ```
   Recuerda: Los mensajes de commit deben estar en inglés.

5. **Pruebas finales** asegurándote de que todo funciona correctamente.

### Pruebas Importantes

- **Formulario de contacto**: Verifica que los mensajes se envían correctamente y se almacenan en la base de datos.
- **Panel de administración**: Comprueba que puedes iniciar sesión y gestionar los mensajes.
- **Responsividad**: Prueba la aplicación en diferentes tamaños de pantalla.
- **Botón de WhatsApp**: Verifica que funciona y redirige correctamente.
- **Donaciones**: Si está implementado, verifica el flujo de Stripe.

---

## 3. Actualización del Backend

### Actualización de Dependencias

1. **Verificar actualizaciones disponibles**:
   ```bash
   cd backend
   npm outdated
   ```

2. **Actualizar dependencias**:
   ```bash
   npm update
   ```
   Para actualizaciones mayores:
   ```bash
   npm install package-name@latest
   ```

3. **Probar después de actualizaciones** para asegurar que todo sigue funcionando.

### Modificación de Rutas o Controladores

1. **Seguir la estructura existente** para mantener la consistencia:
   - Controladores en `/controllers`
   - Rutas en `/routes`
   - Modelos en `/models`

2. **Actualizar la documentación** si se añaden nuevos endpoints o se modifican los existentes.

3. **Probar exhaustivamente** cualquier cambio en la API.

---

## 4. Actualización del Frontend

### Actualización de Dependencias

1. **Verificar actualizaciones disponibles**:
   ```bash
   npm outdated
   ```
   Y en el panel admin:
   ```bash
   cd admin-panel
   npm outdated
   ```

2. **Actualizar dependencias** en ambos proyectos.

### Modificación de Componentes

1. **Seguir la estructura de carpetas** existente:
   - Componentes en `/src/components`
   - Estilos en `/src/styles`
   - Servicios en `/src/services`

2. **Mantener consistencia** en el diseño y la experiencia de usuario.

3. **Probar en distintos navegadores** para asegurar compatibilidad.

---

## 5. Despliegue en Producción

### Backend (Render)

1. **Preparar cambios para producción**:
   - Asegúrate de que el archivo `.env.production` en la carpeta `backend` tiene las variables correctas.
   - Verificar que `bcryptjs` está siendo utilizado en lugar de `bcrypt`.

2. **Commit y push al repositorio**:
   ```bash
   git add .
   git commit -m "Update backend: description of changes"
   git push origin main
   ```

3. **Verificar el despliegue automático** en el dashboard de Render:
   - Si el despliegue automático está configurado, Render iniciará la compilación automáticamente.
   - Si no, inicia manualmente un despliegue desde el dashboard.

4. **Monitorear logs** en Render para detectar posibles errores.

5. **Implementar UptimeRobot** para mantener el servicio activo:
   - Crea una cuenta en UptimeRobot.com
   - Configura un monitor HTTP(S) para tu URL de backend
   - Establece un intervalo de 5 minutos

### Frontend Principal (Netlify)

1. **Preparar cambios para producción**:
   - Verifica el archivo `netlify.toml` en la raíz.
   - Asegúrate de que las variables de entorno en Netlify apuntan al backend en producción.

2. **Commit y push al repositorio**:
   ```bash
   git add .
   git commit -m "Update frontend: description of changes"
   git push origin main
   ```

3. **Verificar el despliegue** en el dashboard de Netlify.

4. **Probar la aplicación desplegada** para asegurar que todo funciona correctamente.

### Panel de Administración (Netlify)

1. **Actualizar variables de entorno** en el dashboard de Netlify para el sitio del panel admin.

2. **Verificar que el despliegue se ha completado** y probar el inicio de sesión.

---

## 6. Mantenimiento Continuo

### Copias de Seguridad

1. **Base de datos MongoDB**:
   - Configura copias de seguridad automatizadas en MongoDB Atlas.
   - Descarga copias manuales periódicamente como respaldo adicional.

2. **Código fuente**:
   - Mantén siempre el repositorio actualizado.
   - Considera crear releases estables con tags:
     ```bash
     git tag -a v1.0.0 -m "Version 1.0.0"
     git push origin v1.0.0
     ```

### Monitoreo

1. **Configurar alertas en Render** para notificaciones de errores.

2. **Implementar UptimeRobot** para monitorear la disponibilidad.

3. **Revisar periódicamente los logs** en Render y Netlify.

---

## 7. Solución de Problemas Comunes

### Problemas en el Backend

1. **El servidor no arranca**:
   - Verifica las variables de entorno.
   - Comprueba los logs de error.
   - Asegúrate de que los puertos no están siendo utilizados por otra aplicación.

2. **Error de conexión a MongoDB**:
   - Verifica la cadena de conexión.
   - Asegúrate de que la IP desde la que te conectas está permitida en MongoDB Atlas.

3. **Problemas con bcrypt en Render**:
   - Asegúrate de usar `bcryptjs` en lugar de `bcrypt`.

### Problemas en el Frontend

1. **Error de CORS**:
   - Verifica que el backend permite solicitudes desde la URL del frontend.
   - En desarrollo: `http://localhost:3000`
   - En producción: URL de Netlify

2. **Error de conexión al backend**:
   - Comprueba que la variable `REACT_APP_API_URL` apunta a la URL correcta.
   - Verifica que el backend está funcionando.

3. **Errores de ESLint en Netlify**:
   - Corrige las advertencias de ESLint antes de desplegar.
   - Añade `CI=false` a las variables de entorno en Netlify si quieres ignorar las advertencias.

---

## Recursos Adicionales

- [Documentación de Netlify](https://docs.netlify.com/)
- [Documentación de Render](https://render.com/docs)
- [Documentación de MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Documentación de Express](https://expressjs.com/es/)
- [Documentación de React](https://es.reactjs.org/docs/getting-started.html)
