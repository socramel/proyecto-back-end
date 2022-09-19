require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
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
app.use(cors());
app.use(fileUpload());

//ENDPOINTS
// Rutas de usuario
app.post('/users', newUserController);
app.get('/users/info/:id', getUserController);
app.post('/users/login', loginController);
app.put('/users/info', authUser, editUserController);

// Rutas de enlaces
app.post('/links', authUser, newLinkController);
app.get('/links', authUser, getLinkController);
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

app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

/* app.use((error, req, res, next) => {
    console.error(error);

    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: 'error.message',
    });
}); */

const PORT = process.env.PORT;

// Finalmente lanzamos el servidor, cuyo puerto está indicado en las variables de entorno .env
app.listen(PORT, () => {
    console.log('Servidor funcionando en el puerto', PORT, "✅");
});
