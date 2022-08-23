const bcrypt = require('bcrypt');
const { generateError } = require('../helpers');
const { getConnection } = require('./db');

// Email
const getUserByEmail = async (email) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(
            `
        SELECT * FROM users WHERE email = ?
        `,
        [email]
        );

    if(result.length === 0) {
        throw generateError('No hay ningún usuario con ese e-mail', 404);
    }

    return result[0];

    } finally {
        if(connection) connection.release();
    }
};


// Devuelve la información pública de un usuario por su id
const getUserById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(
            `
        SELECT id, name, email, created_at FROM users WHERE id=?
        `,
        [id]
        );

    if(result.length === 0) {
        throw generateError('No hay ningún usuario con esa id', 404);
    }

    return result[0];

    } finally {
        if(connection) connection.release();
    }
};

// Crea un usuario en la base de datos y devuelve su id
const createUser = async (name, email, password) => {
    let connection;

    try {
        connection = await getConnection();
        const [user] = await connection.query(
            `
        SELECT id FROM users WHERE email = ?
        `,
        [email]
        );

        if(user.length > 0) {
            throw generateError('Ya existe un usuario en la base de datos con ese e-mail', 409);
        }

        //Encriptar la contraseña con bcrypt
        const passwordHash = await bcrypt.hash(password, 8);

        //Crear el usuario
        const [newUser] = await connection.query(
            `
            INSERT INTO users (name, email, password) VALUES (?, ?, ?)
            `,
            [name, email, passwordHash]
            );

        //Devolver la id
        return newUser.insertID;

    } finally {
        if (connection) connection.release();
    }
}

// Editar usuario
const updateUser = async (userId, name, email, password) => {
    let connection;

    try {
        connection = await getConnection();
        const [editUser] = connection.query(
            `
            UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?
            `,
            [name, email, password, userId]
        ) ;
        return editUser;

    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
};