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
        )

    } finally {
        if (connection) connection.release();
    }
}

module.exports = { newVote,}