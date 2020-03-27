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
    const selectTankIDQuery = `SELECT * FROM model_tank WHERE model=? AND country=?`;

    const formatTankIdSelectQuery = mysql.format(selectTankIDQuery, [
      req.params.model,
      req.params.country
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
        if (global.gConfig.config_id === 'Development') throw err;
      });
  }

  //Inserir um novo tanque na base de dados ({"model": "Oli-78", "country": "POR", "sf_target": 4, "ff_target": 6})
  async insertNewTank(req, res) {
    const insertNewTankStatment = `INSEaT INTO model_tank (model, country, sf_volume_target, ff_volume_target) SELECT ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM model_tank WHERE model = ? AND country =?);`;
    const insertNewTankQuery = mysql.format(insertNewTankStatment, [
      req.body.model,
      req.body.country,
      req.body.sf_target,
      req.body.ff_target,
      req.body.model,
      req.body.country
    ]);
    try {
      const x = await db.insert(insertNewTankQuery);
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
      if (global.gConfig.config_id === 'Development') throw err;
    }
  }

  //Eliminar um tanque já presente na base de dados (127.0.0.1:4000/api/v1/tanks/tank/:model(Oli-78)/:country(POR)/)
  async deleteTank(req, res) {
    const deleteTankInfoData = `DELETE FROM model_tank WHERE id = (SELECT id FROM model_tank WHERE model=? AND country=?);`;

    const deleteTankInfoDataQuery = mysql.format(deleteTankInfoData, [
      req.params.model,
      req.params.country
    ]);

    try {
      const x = await db.delete(deleteTankInfoDataQuery);
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
      if (global.gConfig.config_id === 'Development') throw err;
    }
  }

  //Adquir os dados de todos os tanques.
  getAllTanksData(req, res) {
    const selectAllDataQuery = `SELECT * FROM model_tank`;
    db.select(selectAllDataQuery)
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
        if (global.gConfig.config_id === 'Development') throw err;
      });
  }

  //Adquirir os dados relacionados com o mapeamento do tanque X (127.0.0.1:4000/api/v1/tanks/tankMap/:model(Oli-76)/:country(POR)/)
  getTankMapInfo(req, res) {
    const selectTankMapInfoData = `SELECT * FROM tank_mapping WHERE ref_id_model_tank = (SELECT id FROM model_tank WHERE model=? AND country=?);`;

    const selectTankMapInfoDataQuery = mysql.format(selectTankMapInfoData, [
      req.params.model,
      req.params.country
    ]);

    db.select(selectTankMapInfoDataQuery)
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
        if (global.gConfig.config_id === 'Development') throw err;
      });
  }

  async insertTankMap(req, res) {
    const insertStatement = `INSERT INTO tank_mapping(volume,waterlevel,ref_id_model_tank) values ?`;
    const selectStatement = `SELECT id FROM model_tank WHERE model=? AND country=?`;

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
      res.status(500).json({
        status: 'failure',
        message: err
      });
      if (global.gConfig.config_id === 'Development') throw err;
    }
  }

  //Elimiar o maping do tank selecionado ()
  async deleteTankMap(req, res) {
    const deleteTankMapData = `DELETE FROM tank_mapping WHERE ref_id_model_tank = (SELECT id FROM model_tank WHERE model=? AND country=?);`;

    const deleteTankMapDataQuery = mysql.format(deleteTankMapData, [
      req.params.model,
      req.params.country
    ]);

    try {
      const x = await db.delete(deleteTankMapDataQuery);
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
      if (global.gConfig.config_id === 'Development') throw err;
    }
  }
}

module.exports = new tank();
