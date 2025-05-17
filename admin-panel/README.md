# Panel de Administración - Sistema de Gestión de Mensajes

Este panel de administración es parte del sistema de gestión de mensajes para un portafolio web. Proporciona una interfaz de usuario intuitiva para administrar los mensajes recibidos a través del formulario de contacto del portafolio.

## Características

- **Autenticación segura**: Sistema de inicio de sesión con JWT
- **Dashboard interactivo**: Visualización de estadísticas y mensajes recientes
- **Gestión de mensajes**: Vista detallada, etiquetado, marcado como leído/destacado
- **Exportación a CSV**: Exportación de mensajes con filtros personalizables
- **Interfaz responsive**: Diseñada para funcionar en dispositivos móviles y de escritorio
- **Función de respuesta rápida**: Respuesta directa por correo electrónico o WhatsApp

## Tecnologías utilizadas

- React 18
- Material UI 5
- React Query para gestión de estado y caché
- React Router para navegación
- Netlify para despliegue y funciones serverless

## Requisitos previos

- Node.js (v16.0.0 o superior)
- npm (v8.0.0 o superior)
- Backend configurado y en funcionamiento

## Instalación

```bash
# Clonar el repositorio (si aún no lo has hecho)
git clone <url-del-repositorio>
cd portfolio-ejemplo/admin-panel

# Instalar dependencias
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Scripts disponibles

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Estructura del proyecto

```
admin-panel/
├── netlify/               # Configuración de Netlify y funciones serverless
│   └── functions/         # Funciones serverless para la API
├── public/                # Archivos públicos
├── src/                   # Código fuente
│   ├── components/        # Componentes reutilizables
│   ├── context/           # Contextos de React, incluido AuthContext
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios para comunicación con la API
│   ├── styles/            # Estilos y temas
│   └── utils/             # Utilidades y funciones auxiliares
├── .env                   # Variables de entorno locales
├── netlify.toml           # Configuración de Netlify
└── package.json           # Dependencias y scripts
```

## Despliegue en Netlify

Este proyecto está configurado para ser desplegado en Netlify con funciones serverless que actúan como proxy para la API backend.

### Configuración de Netlify

1. Crea una cuenta en [Netlify](https://www.netlify.com/) si aún no la tienes
2. Conecta tu repositorio de GitHub a Netlify
3. Configura las siguientes variables de entorno en Netlify:
   - `BACKEND_URL`: URL completa de tu API backend

### Despliegue manual

```bash
# Instalar CLI de Netlify si no lo tienes
npm install -g netlify-cli

# Iniciar sesión en Netlify
netlify login

# Desplegar en Netlify
netlify deploy --prod
```

## Seguridad

El panel de administración implementa varias medidas de seguridad:

- Autenticación basada en JWT
- Caducidad de sesiones
- Protección de rutas para usuarios no autenticados
- Validación de entradas
- HTTPS para todas las comunicaciones en producción

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactar al equipo de desarrollo.
