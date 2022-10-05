/* const { generateError } = require('../helpers');
 */ const { getConnection } = require('./db');

const getUserVotesForLink = async (userId, linkId) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `SELECT * FROM votes WHERE user_id=? AND link_id=?`,
      [userId, linkId]
    );

    return result;
  } finally {
    if (connection) connection.release();
  }
};

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

module.exports = {
  newVote,
  getUserVotesForLink,
};
