const mysql = require('mysql');
let pool = require('../config/database');

//Queries to the database.
//TODO: optimizar/eliminar duplicados
const getTankInfo_db = getTankInfoQuery => {
  return new Promise(function(resolve, reject) {
    pool.query(getTankInfoQuery, (err, data) => {
      if (err || data.length === 0) {
        reject('Tanks not found');
      } else {
        resolve(data);
      }
    });
  });
};

const insertNewTank_db = insertNewTankQuery => {
  return new Promise(function(resolve, reject) {
    pool.query(insertNewTankQuery, (err, data) => {
      if (err) {
        reject('It failed to and a new tank');
      } else {
        resolve(data);
      }
    });
  });
};

const removeTankData_db = deleteTankInfoDataQuery => {
  return new Promise(function(resolve, reject) {
    pool.query(deleteTankInfoDataQuery, (err, data) => {
      if (err) {
        reject('It failed to delete a existed tank');
      } else {
        resolve(data);
      }
    });
  });
};

const getAllTankData_db = selectAllDataQuery => {
  return new Promise(function(resolve, reject) {
    pool.query(selectAllDataQuery, (err, data) => {
      if (err || data.length === 0) {
        reject('Data not found');
      } else {
        resolve(data);
      }
    });
  });
};

const getTankMap = formartdataselectquery => {
  return new Promise(function(resolve, reject) {
    pool.query(formartdataselectquery, (err, data) => {
      if (err || data.length === 0) {
        reject('This model for this country doesnt have data');
      } else {
        resolve(data);
      }
    });
  });
};

class tank {
  //TODO: No arduino deve-se remover o json na função getVolumeCurvedata() e acrescentar os parametros no url para poupar memoria no ESP8266.
  //TODO: Ao receber os dados devem adquirar os dados de "data" e não de "message".
  //Adquirir a informação do tanque individual (127.0.0.1:4000/api/v1/tanks/tank/:model(Oli-76)/:country(POR)/)
  getTankInfo(req, res) {
    const selectTankIDQuery = `SELECT * FROM model_tank WHERE model=? AND country=?`;

    if (req.params.model && req.params.country) {
      const formatTankIdSelectQuery = mysql.format(selectTankIDQuery, [
        req.params.model,
        req.params.country
      ]);

      getTankInfo_db(formatTankIdSelectQuery)
        .then(data => {
          res.status(200).json({
            status: 'sucess',
            results: data.length,
            data: data[0]
          });
        })
        .catch(err => {
          res.status(404).json({
            status: 'failure',
            message: err
          });
          throw err;
        });
    } else {
      res.status(500).json({
        status: 'failure',
        message: 'Data missing'
      });
    }
  }

  //Inserir um novo tanque na base de dados ({"model": "Oli-78", "country": "POR", "sf_target": 4, "ff_target": 6})
  async insertNewTank(req, res) {
    const insertNewTankStatment = `INSERT INTO model_tank (model, country, sf_volume_target, ff_volume_target) SELECT ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM model_tank WHERE model = ? AND country =?);`;
    if (req.body.model && req.body.country) {
      const insertNewTankQuery = mysql.format(insertNewTankStatment, [
        req.body.model,
        req.body.country,
        req.body.sf_target,
        req.body.ff_target,
        req.body.model,
        req.body.country
      ]);
      try {
        const x = await insertNewTank_db(insertNewTankQuery);
        if (x.affectedRows == 1) {
          res.status(201).json({
            status: 'sucess'
          });
        }
        res.status(204).json({
          status: 'sucess'
        });
      } catch (err) {
        res.status(500).json({
          status: 'failure',
          message: err
        });
        throw err;
      }
    }
  }

  //Eliminar um tanque já presente na base de dados (127.0.0.1:4000/api/v1/tanks/tank/:model(Oli-78)/:country(POR)/)
  async deleteTank(req, res) {
    const deleteTankInfoData = `DELETE FROM model_tank WHERE id = (SELECT id FROM model_tank WHERE model=? AND country=?);`;
    if (req.params.model && req.params.country) {
      const deleteTankInfoDataQuery = mysql.format(deleteTankInfoData, [
        req.params.model,
        req.params.country
      ]);

      try {
        const x = await removeTankData_db(deleteTankInfoDataQuery);
        if (x.affectedRows === 0) {
          res.status(400).json({
            status: 'failure',
            message: 'Data not found'
          });
        }
        res.status(202).json({
          status: 'sucess'
        });
      } catch (err) {
        res.status(500).json({
          status: 'failure'
        });
        throw err;
      }
    }
  }

  //Adquir os dados de todos os tanques.
  getAllTanksData(req, res) {
    const selectAllDataQuery = `SELECT * FROM model_tank`;
    getAllTankData_db(selectAllDataQuery)
      .then(data => {
        res.status(200).json({
          status: 'sucess',
          results: data.length,
          data: data
        });
      })
      .catch(err => {
        res.status(404).json({
          status: 'failure',
          message: err
        });
        throw err;
      });
  }

  //Adquirir os dados relacionados com o mapeamento do tanque X (127.0.0.1:4000/api/v1/tanks/tankMap/:model(Oli-76)/:country(POR)/)
  getTankMapInfo(req, res) {
    const selectTankMapInfoData = `SELECT * FROM tank_mapping WHERE ref_id_model_tank = (SELECT id FROM model_tank WHERE model=? AND country=?);`;
    if (req.params.model && req.params.country) {
      const selectTankMapInfoDataQuery = mysql.format(selectTankMapInfoData, [
        req.params.model,
        req.params.country
      ]);

      getTankMap(selectTankMapInfoDataQuery)
        .then(data => {
          console.log(data);
          res.status(200).json({
            status: 'sucess',
            results: data.length,
            data: data
          });
        })
        .catch(err => {
          res.status(404).json({
            status: 'failure',
            message: err
          });
          throw err;
        });
    }
  }

  async insertTankMap(req, res) {
    const insertStatement = `INSERT INTO tank_mapping(volume,waterlevel,ref_id_model_tank) values ?`;
    const selectStatement = `SELECT id FROM model_tank WHERE model=? AND country=?`;

    if (req.body.model && req.body.country) {
      try {
        const selectQuery = mysql.format(selectStatement, [
          req.body.model,
          req.body.country
        ]);

        const arduinoId = await getTankInfo_db(selectQuery);

        let result = [];

        for (let i in req.body.data) result.push([i, req.body.data[i]]);

        result = result.sort();

        let insertvalues = [];
        for (let i in result) {
          let values = [];
          values.push(result[i][0]);
          values.push(result[i][1]);
          values.push(arduinoId[0].id);
          insertvalues.push(values);
        }

        const insertQuery = mysql.format(insertStatement, [insertvalues]);
        await insertNewTank_db(insertQuery);

        res.status(201).json({
          status: 'sucess'
        });
      } catch (err) {
        res.status(500).json({
          status: 'failure',
          message: err
        });
        throw err;
      }
    } else {
      res.status(404).json({
        status: 'failure',
        message: 'Data missing'
      });
    }
  }

  //Elimiar o maping do tank selecionado ()
  async deleteTankMap(req, res) {
    const deleteTankMapData = `DELETE FROM tank_mapping WHERE ref_id_model_tank = (SELECT id FROM model_tank WHERE model=? AND country=?);`;
    if (req.params.model && req.params.country) {
      const deleteTankMapDataQuery = mysql.format(deleteTankMapData, [
        req.params.model,
        req.params.country
      ]);

      try {
        const x = await removeTankData_db(deleteTankMapDataQuery);
        if (x.affectedRows === 0) {
          res.status(404).json({
            status: 'failure',
            message: 'Data not found'
          });
        }
        res.status(202).json({
          status: 'sucess'
        });
      } catch (err) {
        res.status(500).json({
          status: 'failure'
        });
        throw err;
      }
    } else {
      res.status(500).json({
        status: 'failure',
        message: 'Data missing'
      });
    }
  }
}

module.exports = new tank();
