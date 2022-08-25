const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const { createUser, getUserById, getUserByEmail, updateUser } = require("../db/users");
const { authSchema } = require('../middlewares/authRoute');

// Controlador para crear/registrar un nuevo usuario
const newUserController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        console.log(password);

        // Importamos el objeto con las restricciones de Joi
        const result = await authSchema.validateAsync(req.body);
        console.log(result);

         if (!name || !email || !password) {
            throw generateError ("Debes enviar un nombre, un e-mail y una contraseña", 400); 
        }

        const id = await createUser(name, email, password);
        console.log(id);

        res.send({
            status: 'ok',
            message: `Usuario creado con id: ${id}`,
        });
    } catch(error) {
        next(error);
    }
};

// Controlador que devuelve la información de un usuario
const getUserController = async (req, res, next) => {
    try {
        const {id} = req.params;

        const user = await getUserById(id);

        res.send({
            status: 'ok',
            data: user, 
        });
    } catch(error) {
        next(error);
    }
};

// Controlador para login de un usuario
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            throw generateError('Debes enviar un e-mail y una constraseña', 400);
        }

        // Recojo los datos de la base de datos del usuario con ese e-mail
        const user = await getUserByEmail(email);

        // Compruebo que las constraseñas coinciden
        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword) {
            throw generateError('La contraseña no coincide', 401);
        }

        // Creo el payload del token
        const payload = { id: user.id };

        // Firmo el token
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '30d',
        });

        // Envío el token
        res.send({
            status: 'ok',
            data: token,
        });
    } catch(error) {
        next(error);
    }
};

// Controlador para editar los datos de usuario
const editUserController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        const editUser = await updateUser(req.userId, name, email, password);

        res.send({
            status: 'ok',
            data: editUser,
        });
    } catch(error) {
        next(error);
    }
}

// Exportamos las funciones de controladores de las rutas de users
module.exports = {
    newUserController,
    getUserController,
    loginController,
    editUserController,
};