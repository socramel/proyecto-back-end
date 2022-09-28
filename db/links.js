const { generateError } = require('../helpers');
const { getConnection } = require('./db');

// Controlador para crear un nuevo link
const createLink = async (userId, url, title, description) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        INSERT INTO links (user_id, url, title, description)
        VALUES (?,?,?,?)
        `,
      [userId, url, title, description]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

// Controlador para obtener un link por su id
const getLinkById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        SELECT * FROM links WHERE id = ?
        `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`El link con id: ${id} no existe`, 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

// Controlador para obtener links por id de usuario
const getLinksByUserId = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
            SELECT links.*, users.email FROM links LEFT JOIN users on links.user_id = users.id WHERE links.user_id = ?
            `,
      [id]
    );

    return result;
  } finally {
    if (connection) connection.release();
  }
};

// Controlador para obtener los links creados
const getAllLinks = async () => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(`
        SELECT * FROM links ORDER BY created_at DESC
        `);

    return result;
  } finally {
    if (connection) connection.release();
  }
};

// Controlador para borrar un link (cada usuario sólo los creados por él mismo)
const deleteLinkById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
        DELETE FROM links WHERE id = ?
        `,
      [id]
    );

    return;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createLink,
  getAllLinks,
  getLinkById,
  getLinksByUserId,
  deleteLinkById,
};
