const pool = require('../config/database');

class db {
  select = selectQuery => {
    return new Promise(function(resolve, reject) {
      pool.query(selectQuery, (err, data) => {
        if (err || data.length === 0) {
          reject('Data not found.');
        } else {
          resolve(data);
        }
      });
    });
  };

  delete = deleteQuery => {
    return new Promise(function(resolve, reject) {
      pool.query(deleteQuery, (err, data) => {
        if (err) {
          reject('Delete error.');
        } else {
          resolve(data);
        }
      });
    });
  };

  insert = insertQuery => {
    return new Promise(function(resolve, reject) {
      pool.query(insertQuery, (err, data) => {
        if (err) {
          reject('Insert error.');
        } else {
          resolve(data);
        }
      });
    });
  };
}

module.exports = new db();
