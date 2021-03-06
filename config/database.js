const mysql = require('mysql');
const util = require('util');
const config = require('./config');

const pool = mysql.createPool({
  connectionLimit: 50,
  host: global.gConfig.db_host,
  user: global.gConfig.db_user,
  password: global.gConfig.db_password,
  database: global.gConfig.database,
  debug: false,
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }
  if (connection) connection.release();
  return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;
