# Trabajo final CoderHouse Backend

Este proyecto es el compendio final de todos los contenidos del curso de Backend en Coderhouse.
Se trata de un Backend para administración completa de un ecommerce, copn un pequeño frontend SSR realiado con Handlebars.
El pŕoyecto se encuentra realizado en su totalidad con express y las librerías citadas posteriormente.

Este proyecto se encuentra desplegado en "RAILWAY" y se puede visitar en el siguiente enlace: [INFUZION MARKET](https://backend-coder-production-dfae.up.railway.app)

## 🚀 Características

- **Gestión de Productos**: Añadir, editar, eliminar y visualizar productos.
- **Gestión de Carritos**: Añadir productos a carritos, actualizarlos y eliminarlos.
- **Autenticación de Usuarios**: Registro, inicio de sesión y gestión de roles.
- **Integración con GitHub**: Inicio de sesión a través de GitHub.
- **Envío de Correos Electrónicos**: Notificaciones y recuperación de contraseñas.
- **Documentación API**: Swagger para una fácil comprensión de los endpoints disponibles.

## 📚 Librerías Utilizadas

- Express.js para el servidor web.
- Mongoose para la interacción con MongoDB.
- Passport y Passport-GitHub2 para la autenticación.
- Nodemailer para el envío de correos electrónicos.
- Swagger-ui-express y swagger-jsdoc para la documentación de la API.
- Socket.io para la comunicación en tiempo real.
- Faker para la generación de datos de prueba.

## 🛠️ Comandos para Ejecutar el Proyecto

Para iniciar el proyecto, asegúrate de tener Docker y Node.js instalados. Luego, ejecuta los siguientes comandos:

```sh
# Para iniciar el servidor en modo desarrollo
npm run dev

# Para iniciar el servidor en modo producción
npm start

# Para ejecutar los tests (Para ejecutar los test debe estar corriendo el server inicialmente ya que se usa supertest para hacer llamdos a distintos endpoints)
npm test

# Para ejecutar un contenedor docker de desarrollo
docker compose -f docker-compose.dev.yml up

# Para ejecutar un contendor docker de producción
docker compose -f docker-compose.yml up
```

## 📖 Documentación del Proyecto

Se puede consultar la documentación de la api en el siguiente enlace

[SWAGGER DOCS](https://backend-coder-production-dfae.up.railway.app/apidocs/)

## 🧑‍💻 Usuarios/Roles por Defecto

## A los fine de poder probar las diferentes funcionalidades de la app referente a los diferentes roles de usuario, se encuentran creados en la base de datos los siguientes usuarios de prueba:

### Admin

- **Correo**: admin@gmail.com
- **Contraseña**: 123123

### Premium

- **Correo**: premium@gmail.com
- **Contraseña**: 123123

### User

- **Correo**: regularuser@gmail.com
- **Contraseña**: 123123
