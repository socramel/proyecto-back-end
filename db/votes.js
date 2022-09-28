const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const newVote = async (myId, link) => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(
            `
            INSERT INTO votes (user_id, link_id)
            VALUES (?, ?)`,
            [myId, link]
        );

    } finally {
        if (connection) connection.release();
    }
};


// Nuevo controller para el voto repetido de usuario al mismo link
const repeatVote = async (myId, link) => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query (
            `SELECT (user_id, link_id) FROM votes`,
            [myId, link]
        );
        if (myId === link) {
            throw generateError ("No puede votar el link más de una vez")
        }
    } finally {
        if (connection) connection.release();
    }
};


module.exports = { 
    newVote,
    repeatVote,
}