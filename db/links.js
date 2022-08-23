const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const createLink = async (userId, url, title, description) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
        INSERT INTO links (user_id, url, title, description)
        VALUES (?,?,?,?)
        `, [userId, url, title, description]);

        return result.insertId;

    } finally {
        if (connection) connection.release();
    }
};

const getLinkById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
        SELECT * FROM links WHERE id = ?
        `, [id]);

        if(result.length === 0) {
            throw generateError(`El link con id: ${id} no existe`, 404);
        }

        return result[0];

    } finally {
        if(connection) connection.release();
    }
};

const getAllLinks = async () => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
        SELECT * FROM links ORDER BY created_at DESC
        `);

        return result;
    } finally {
        if(connection) connection.release();
    }
};

const deleteLinkById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
        DELETE FROM links WHERE id = ?
        `, [id]);

        return result[0];

    } finally {
        if(connection) connection.release();
    }
};

module.exports = {
    createLink,
    getAllLinks,
    getLinkById,
    deleteLinkById,
}