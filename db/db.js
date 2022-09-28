const mysql = require('mysql2/promise');

// Desestructuro las variables de entorno definidas en el archivo .env y las asigno al objeto process.env
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

let pool;

// Establezco la función para crear una conexión a la base de datos mediante el pool de conexiones
const getConnection = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        connectionLimit: 10,
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        timezone: 'Z',
      });
    }

    return await pool.getConnection();
  } catch {
    throw new Error('Error conectando a MySQL o base de datos no encontrada');
  }
};

module.exports = {
  getConnection,
};
