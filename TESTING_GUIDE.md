```markdown
# Guía para Ejecutar Pruebas Unitarias (Jest)

Esta guía te ayudará a ejecutar las pruebas unitarias en los proyectos de frontend y backend.

## Parte Frontend (React - portfolio-ejemplo)

El frontend utiliza `react-scripts` (parte de Create React App) para gestionar las pruebas con Jest.

**1. Navegar al Directorio Correcto:**
Abre tu terminal y asegúrate de estar en el directorio raíz del frontend:
```sh
cd C:\Users\kelvi\CascadeProjects\portfolio-ejemplo
```

**2. Ejecutar Todas las Pruebas (Una Sola Vez, Sin Modo Observación):**
Este es ahora el comportamiento principal del comando `npm test` para el frontend. Ejecutará todas las pruebas unitarias una vez y mostrará los resultados.
```sh
npm test
```

**3. Ejecutar Pruebas en Modo Observación (Watch Mode):**
Si necesitas que Jest observe los cambios en los archivos y re-ejecute las pruebas automáticamente, puedes usar el siguiente comando. Ten en cuenta que esto anulará temporalmente el comportamiento configurado en `package.json` para `npm test` solo para esta ejecución:
```sh
npm test -- --watch
```
(El doble `--` es para pasar el argumento `--watch` directamente a Jest).
Una vez en modo observación, tendrás varias opciones interactivas:
*   Pulsar `a`: Para ejecutar todas las pruebas (si no se ejecutaron todas al inicio del watch mode).
*   Pulsar `f`: Para ejecutar solo las pruebas que fallaron en la última ejecución.
*   Pulsar `p`: Para filtrar pruebas por el nombre de un archivo (expresión regular).
*   Pulsar `t`: Para filtrar pruebas por el nombre de un test específico (expresión regular).
*   Pulsar `q`: Para salir del modo observación.
*   Pulsar `Enter`: Para volver a ejecutar las pruebas con los filtros actuales.

**4. Ejecutar un Archivo de Pruebas Específico (Una Sola Vez):**
```sh
npm test -- src/components/WhatsAppButton.test.js --watchAll=false
```
Reemplaza `src/components/WhatsAppButton.test.js` con la ruta al archivo que quieras probar.

## Parte Backend (Node.js/Express - portfolio-ejemplo/backend)

El backend tiene su propia configuración de Jest.

**1. Navegar al Directorio Correcto:**
Abre tu terminal y asegúrate de estar en el directorio del backend:
```sh
cd C:\Users\kelvi\CascadeProjects\portfolio-ejemplo\backend
```

**2. Ejecutar Todas las Pruebas:**
```sh
npm test
```
Esto ejecutará todos los archivos `*.test.js` en el proyecto backend y mostrará los resultados.

**Nota sobre Pruebas de API y Base de Datos:**
Para las pruebas de API que interactúan con la base de datos, se utiliza una base de datos de prueba separada configurada mediante la variable de entorno `MONGODB_URI_TEST` en el archivo `.env`. Esto asegura que las pruebas no afecten a la base de datos de producción.

**3. Ejecutar un Archivo de Pruebas Específico:**
Para ejecutar solo un archivo de pruebas (por ejemplo, `auth.test.js` dentro del directorio `middleware`):
```sh
npm test -- middleware/auth.test.js
```
O si quieres ser más específico desde la raíz del backend:
```sh
npm test -- ./middleware/auth.test.js
```
(El doble `--` es importante para pasar el nombre del archivo como argumento a Jest).

**4. Ejecutar Solo Pruebas que Fallaron (Después de una ejecución fallida):**
Jest tiene una opción para esto, aunque su comportamiento puede variar si estás en modo observación o no.
Si no estás en modo observación, puedes intentar:
```sh
npm test -- --onlyFailures
```
(Requiere que Jest haya guardado un caché de fallos de una ejecución previa).
En el modo observación del frontend, la tecla `f` cumple esta función.

---

**Nota Importante:**
El comando `jest` por sí solo (como `jest -all`) probablemente no funcionará directamente en tu terminal si Jest no está instalado globalmente. Siempre es mejor usar `npm test` para que se utilice la versión de Jest especificada en el `package.json` de cada proyecto.
```

---

## End-to-End (E2E) Tests (Playwright)

El proyecto utiliza Playwright para las pruebas End-to-End, que simulan interacciones reales del usuario en el navegador.

**1. Navegar al Directorio Correcto:**
Abre tu terminal y asegúrate de estar en el directorio raíz del proyecto (donde está `playwright.config.js`):
```sh
cd C:\Users\kelvi\CascadeProjects\portfolio-ejemplo
```

**2. Ejecutar Todas las Pruebas E2E:**
Este comando ejecutará todas las pruebas E2E definidas en la configuración de Playwright (por defecto, en todos los navegadores configurados y en modo headless).
```sh
npx playwright test
```

**3. Ejecutar Pruebas E2E en un Navegador Específico y en Modo Headed (con UI):**
Para ver la ejecución en el navegador (por ejemplo, Chromium):
```sh
npx playwright test --headed --project=chromium
```

**4. Ejecutar un Archivo de Pruebas E2E Específico:**
Para ejecutar solo las pruebas de un archivo (por ejemplo, `contact-form.spec.js`):
```sh
npx playwright test tests/contact-form.spec.js
```
O con un navegador específico y modo headed:
```sh
npx playwright test tests/contact-form.spec.js --headed --project=chromium
```

**5. Abrir el Reporte HTML de Playwright:**
Después de ejecutar las pruebas, puedes ver un reporte detallado:
```sh
npx playwright show-report
```

---

## Listado de Test Suites y Archivos de Prueba

| Test Suite / Archivo           | Ubicación                                 | Tipo      | Escenarios de Prueba (Resumen)                                                                                                                               |
|-------------------------------|-------------------------------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| auth.test.js                  | backend/middleware/auth.test.js            | Backend   | - `authenticate`: token (válido/inválido/ausente/formato), usuario (activo/inactivo/no encontrado). (6) <br> - `authorize`: rol (requerido/no), auth (sí/no). (6) |
| security.test.js              | backend/middleware/security.test.js        | Backend   | - `secureHeaders`: config Helmet (prod/dev). (2) <br> - `sanitize`: config MongoSanitize (prod/dev), callback `onSanitize`. (3)                                  |
| contact.api.test.js           | backend/tests/api/contact.api.test.js      | Backend   | Pruebas de API para el endpoint `/api/contact`: envío correcto del formulario (validación de datos, respuesta HTTP 200, guardado en BD). (1)                     |
| WhatsAppButton.test.js        | src/components/WhatsAppButton.test.js      | Frontend  | Renderizado, `href` (teléfono, mensaje), atributos (`target`, `rel`, `aria-label`), imagen (`src`, `alt`), `className`. (7)                                    |
| App.test.js                   | src/App.test.js                           | Frontend  | Renderizado de logo en header (texto, clases, tags). (1)                                                                                                     |
| Navigation.test.js            | src/components/Navigation.test.js          | Frontend  | Logo (render, click), enlaces nav (render, click, activo), menú móvil (render, toggle, clase `menu-open`). (7)                                                 |
| Footer.test.js                | src/components/Footer.test.js              | Frontend  | Renderizado footer, logo, enlaces sociales (hrefs), copyright (año, nombre). (4)                                                                               |
| Portfolio.test.js             | src/components/Portfolio.test.js           | Frontend  | Renderizado (sección, título), filtros (botones, default, por categoría), detalles proyecto (título, categoría, descripción, enlaces). (5)                   |
| Contact.test.js               | src/components/Contact.test.js             | Frontend  | Renderizado (campos, info contacto), validación (vacíos, email, teléfono), envío (éxito, error fetch), enlaces sociales. (6)                                    |
| AboutMe.test.js               | src/components/AboutMe.test.js             | Frontend  | Renderizado (títulos, desc, img), botones (descarga CV, contacto), tarjetas de habilidades. (4)                                                                 |
| BackgroundElements.test.js    | src/components/BackgroundElements.test.js  | Frontend  | Renderizado (contenedor, triángulos, grupos de puntos, formas decorativas, líneas). (5)                                                                      |
| DonateButton.test.js          | src/components/DonateButton.test.js        | Frontend  | Botón flotante, modal (estado, interacción), contenido (PayPal, Stripe), lógica Stripe (montos, submit, errores). (16)                                         |
| Experience.test.js            | src/components/Experience.test.js          | Frontend  | Renderizado (sección, título, subtítulo), número de trabajos, detalles de cada trabajo (título, empresa, periodo, descripción), resaltado título. (5)             |
| contact-form.spec.js        | tests/contact-form.spec.js                | E2E       | - Visualización del formulario de contacto y navegación. (1) <br> - Envío exitoso del formulario con datos válidos y verificación del mensaje de éxito. (1) <br> - Verificación de errores de validación: nombre vacío, email vacío, formato de email inválido, mensaje vacío. (4) |

**Notas:**
- Los archivos `auth.test.js` y `security.test.js` cubren middleware del backend.
- El archivo `contact.api.test.js` prueba la API del formulario de contacto.
- Los archivos en `src/components` y `src/` cubren componentes React (frontend).
- Puedes ejecutar un test suite específico usando `npm test -- <ruta/al/archivo.test.js> --watchAll=false`.
- Para las pruebas de API, asegúrate de que `MONGODB_URI_TEST` esté configurado en el archivo `.env`.

