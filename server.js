require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Importo las funciones de los controladores de rutas de users
const {
  newUserController,
  getUserController,
  getUserLinksController,
  editUserController,
  loginController,
  getMeController,
} = require('./controllers/users');

// Importo las funciones de los controladores de rutas de links
const {
  getLinksController,
  newLinkController,
  deleteLinkController,
  getSingleLinkController,
} = require('./controllers/links');

// Importo las funciones de los controladores de rutas de votes
const {
  newVoteController,
  repeatVoteController,
} = require('./controllers/votes');

const { authUser } = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

//ENDPOINTS
// Rutas de usuario
app.post('/users', newUserController);
app.get('/users/info/:id', getUserController);
app.get('/users/:id/links', getUserLinksController);
app.get('/users', authUser, getMeController);
app.post('/users/login', loginController);
app.put('/users/info', authUser, editUserController);

// Rutas de enlaces
app.post('/links', authUser, newLinkController);
app.get('/links', getLinksController);
app.get('/links/:id', getSingleLinkController);
app.delete('/links/:id', authUser, deleteLinkController);

// Rutas de voto
app.post('/votes/:id', authUser, repeatVoteController, newVoteController);

// Middleware de error 404
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Página no encontrada',
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
    message: 'Página no encontrada',
  });
});

const PORT = process.env.PORT;

// Finalmente lanzamos el servidor, cuyo puerto está indicado en las variables de entorno .env
app.listen(PORT, () => {
  console.log('Servidor funcionando en el puerto', PORT, '✅');
});
