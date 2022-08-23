require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require("express-fileupload");

// Importo las funciones de los controladores de rutas de users
const {
    newUserController,
    getUserController,
    editUserController,
    loginController,
} = require('./controllers/users');

// Importo las funciones de los controladores de rutas de links
const {
    getLinkController,
    newLinkController,
    deleteLinkController,
} = require ('./controllers/links');

// Importo las funciones de los controladores de rutas de votes
const {
    newVoteController,
} = require ('./controllers/votes');

const { authUser } = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(fileUpload());

//ENDPOINTS
// Rutas de usuario
app.post('/users', newUserController);
app.get('/users/info/:id', getUserController);
app.put('/users/info/', authUser, editUserController);
app.post('/users/login', loginController);

// Rutas de enlaces
app.post('/links', authUser, newLinkController);
app.get('/links', getLinkController);
app.delete('/links/:id', authUser, deleteLinkController);

// Rutas de voto
app.post('/votes/:id', authUser, newVoteController);

// Middleware de error 404
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

// Middleware de gestión de errores
app.use((error, req, res, next) => {
    console.error(error);

    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: error.message,
    });
});

/*
Entidades:

- User
    - id
    - name
    - email
    - password
    - created_at
- Link
    - id
    - user_id (o id do usuario que creou o link)
    - url
    - title
    - description
    - created_at

- Vote
    - id
    - user_id
    - link_id
    - create_at

Rutas:

- POST /users - crea un novo usuario (rexistro)
- GET /users/info/:id - devolve a información dun usuario (id, name, email, created_at)
- PUT /users/info/:id - edita a inforación dun usuario (NECESITA TOKEN e só podes editar o teu usuario)
- POST /users/login - envias email e password e devolve token

- GET /links - devolve todos os links ordenados por created_at (descendente)
- POST /links - crea un novo link (enviando no body os datos necesarios) NECESITA TOKEN
- DELETE /links/:id - borra un link (NECESITA TOKEN e só podes borrar os links creados por ti)

- POST /votes/:link_id - engade un voto a un link (NECESITA TOKEN e só podes votar links que non sexan creados por ti)
*/



app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: 'error.message',
    });
});

const PORT = process.env.PORT;

// Finalmente lanzamos el servidor, cuyo puerto está indicado en las variables de entorno .env
app.listen(PORT, () => {
    console.log('Servidor funcionando en el puerto', PORT, "✅");
});
