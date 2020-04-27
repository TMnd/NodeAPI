const pool = require('../config/database');

class db {
  select = selectQuery => {
    return new Promise(function(resolve, reject) {
      pool.query(selectQuery, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
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
          console.log(err);
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
          console.log(err);
          reject('There was a error inserting the data');
        } else {
          resolve(data);
        }
      });
    });
  };
}

module.exports = new db();
