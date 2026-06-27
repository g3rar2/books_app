# Books App API

API REST de ejemplo para gestionar libros con autenticacion JWT y conexion a MySQL. Este repositorio esta pensado como proyecto de portafolio y no incluye credenciales reales.

## Tecnologias

- Node.js
- Express
- MySQL
- JWT
- bcrypt

## Configuracion

1. Instalar dependencias:

```bash
npm install
```

2. Crear un archivo `.env` usando `.env.example` como referencia.

3. Iniciar el servidor:

```bash
npm run server
```

## Seguridad

Las variables sensibles se manejan con `.env`, que no debe subirse al repositorio. Si alguna credencial real fue publicada antes, debe rotarse y reemplazarse.
