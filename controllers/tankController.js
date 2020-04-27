const mysql = require('mysql');
const db = require('./databaseController');

class tank {
  //To verify if the Post body have the parameters necessary
  checkBody_tank(req, res, next) {
    if (!req.body.model || !req.body.country) {
      return res.status(500).json({
        status: 'failure',
        message: 'Data missing'
      });
    }
    next();
  }

  //TODO: No arduino deve-se remover o json na função getVolumeCurvedata() e acrescentar os parametros no url para poupar memoria no ESP8266.
  //TODO: Ao receber os dados devem adquirar os dados de "data" e não de "message".
  //Adquirir a informação do tanque individual (127.0.0.1:4000/api/v1/tanks/tank/:model(Oli-76)/:country(POR)/)
  getTankInfo(req, res) {
    const selectTankIDQuery = `SELECT * FROM modeltank WHERE model=? AND country=?`;

    const formatTankIdSelectQuery = mysql.format(selectTankIDQuery, [
      req.query.model,
      req.query.country
    ]);

    db.select(formatTankIdSelectQuery)
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
      });
  }

  //Inserir um novo tanque na base de dados ({"model": "Oli-78", "country": "POR", "sf_target": 4, "ff_target": 6})
  insertNewTank(req, res) {
    const insertNewTankStatment = `INSERT INTO modeltank (model, country, sf_volume_target, ff_volume_target) SELECT ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM modeltank WHERE model = ? AND country =?);`;
    const insertNewTankQuery = mysql.format(insertNewTankStatment, [
      req.body.model,
      req.body.country,
      req.body.sf_target,
      req.body.ff_target,
      req.body.model,
      req.body.country
    ]);

    db.insert(insertNewTankQuery)
      .then(data => {
        if (data.affectedRows == 1) {
          res.status(201).json({
            status: 'sucess'
          });
        } else {
          res.status(204).json({
            status: 'sucess'
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failure',
          message: err
        });
      });
  }

  //Eliminar um tanque já presente na base de dados (127.0.0.1:4000/api/v1/tanks/tank/:model(Oli-78)/:country(POR)/)
  deleteTank(req, res) {
    const deleteTankInfoData = `DELETE FROM modeltank WHERE model=? AND country=?;`;

    const deleteTankInfoDataQuery = mysql.format(deleteTankInfoData, [
      req.body.model,
      req.body.country
    ]);

    db.delete(deleteTankInfoDataQuery)
      .then(data => {
        res.status(202).json({
          status: 'sucess'
        });
      })
      .catch(err => {
        res.status(404).json({
          status: 'failure',
          message: err
        });
      });
  }

  //Adquir os dados de todos os tanques.
  getAllTanksData(req, res) {
    const selectAllDataQuery = `SELECT * FROM modeltank;`;
    db.select(mysql.format(selectAllDataQuery))
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
      });
  }

  //Adquirir os dados relacionados com o mapeamento do tanque X (127.0.0.1:4000/api/v1/tanks/tankMap/:model(Oli-76)/:country(POR)/)
  getTankMapInfo(req, res) {
    const selectTankMapInfoData = `SELECT * FROM tankmapping WHERE ref_id_model_tank = (SELECT id FROM modeltank WHERE model=? AND country=?);`;

    const selectTankMapInfoDataQuery = mysql.format(selectTankMapInfoData, [
      req.query.model,
      req.query.country
    ]);

    db.select(selectTankMapInfoDataQuery)
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
      });
  }

  async insertTankMap(req, res) {
    const insertStatement = `INSERT INTO tankmapping(volume,waterlevel,ref_id_model_tank) values ?`;
    const selectStatement = `SELECT id FROM modeltank WHERE model=? AND country=?`;

    try {
      const selectQuery = mysql.format(selectStatement, [
        req.body.model,
        req.body.country
      ]);

      const arduinoId = await db.select(selectQuery);

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
      await db.insert(insertQuery);

      res.status(201).json({
        status: 'sucess'
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: 'failure',
        message: err
      });
    }
  }

  //Elimiar o maping do tank selecionado ()
  async deleteTankMap(req, res) {
    const deleteTankMapData = `DELETE FROM tankmapping WHERE ref_id_model_tank = (SELECT id FROM modeltank WHERE model=? AND country=?);`;

    const deleteTankMapDataQuery = mysql.format(deleteTankMapData, [
      req.body.model,
      req.body.country
    ]);

    db.delete(deleteTankMapDataQuery)
      .then(data => {
        res.status(202).json({
          status: 'sucess'
        });
      })
      .catch(err => {
        res.status(500).json({
          status: 'failure',
          message: err
        });
      });
  }
}

module.exports = new tank();
