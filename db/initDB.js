require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;

  try {
    connection = await getConnection();

    console.log('Borrando tablas existentes');
    await connection.query('DROP TABLE IF EXISTS links');
    await connection.query('DROP TABLE IF EXISTS votes');
    await connection.query('DROP TABLE IF EXISTS users');

    console.log('Creando tablas');

    //Creo las tablas de las entidades definidas

    // Usuarios
    await connection.query(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

    // Links
    await connection.query(`
    CREATE TABLE links (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER NOT NULL,
        url VARCHAR(300) NOT NULL,
        title VARCHAR(200) NOT NULL,
        description VARCHAR(400),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

    // Votes
    await connection.query(`
    CREATE TABLE votes (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER NOT NULL,
        link_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id)
            REFERENCES users(id),
        FOREIGN KEY (link_id)
            REFERENCES links(id)
    );
`);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main().catch((error) => console.error(error));