const mysql = require('mysql');
const pool = require('../config/database');
const miscellaneous = require('../miscellaneous/date');
const os = require('os');

const getMicroPId_db = selectQuery => {
  return new Promise(function(resolve, reject) {
    pool.query(selectQuery, (err, data) => {
      if (err || data.length === 0) {
        reject('Micro processor not found');
      } else {
        resolve(data[0].id);
      }
    });
  });
};

const insert_db = insertQuery => {
  return new Promise(function(resolve, reject) {
    pool.query(insertQuery, (err, data) => {
      if (err) {
        reject('Insertion error');
      } else {
        resolve();
      }
    });
  });
};

class data {
  // The data is sent by a json object.
  async insertDataFromMicroProc(req, res) {
    if (req.body.Client_id) {
      //Micro Processor data
      const clientMACId = req.body.Client_id;
      //const clientName = req.body.Client_name;

      const time = req.body.Time; //Tempo em milisegundos do momento da descarga
      const udp_sendTime = req.body.udp_sendTime; //Tempo em milisegundos do momento que a informação foi enviada para a API.

      let arduinoId, oldvalue;
      let actualtimemillis = Math.floor(Date.now()); //Tempo em milisegundos do momento que se recebe o pedeido
      let flushtime = actualtimemillis - udp_sendTime; //Para adquirir o tempo real da descarga.

      //TODO: Verify if the micro information is present in the database PODE SER COLOCADO EM UM MIDDLEWARE!!!
      const selectGet_mp_id_statement = `SELECT id FROM arduinos WHERE client_macaddress=?`;
      const selectGet_mp_id_query = mysql.format(selectGet_mp_id_statement, [
        clientMACId
      ]);

      try {
        arduinoId = await getMicroPId_db(selectGet_mp_id_query);
      } catch (err) {
        res.status(404).json({
          success: 'failure',
          message: err
        });
        throw err;
      }

      //Inserir informação do nivel da água.
      let aux = parseInt(flushtime);
      let arduino_millis = time;

      //console.log('----- FLUSH -----');

      let groupValues = [];

      for (let i = 0; i < req.body.Flush.length; i++) {
        //BUG: Para eliminar o 0 na primeira iteração TEM DE SER RESOLVIDO NO SENSOR
        if (i == 0 && req.body.Flush[i] == '0') {
          console.log('º------');

          req.body.Flush[i] = '300';
        }

        aux = aux + 100; //Incrementos de 100 millis em cada iteração de tempo
        // real
        arduino_millis = arduino_millis + 100; //Incrementos de 100 millis em cada iteração do tempo
        // arduino
        let mydate_aux = new Date(aux);
        let flush_actualdate =
          mydate_aux.toLocaleString('pt-PT', { hour12: false }) +
          '.' +
          mydate_aux.getMilliseconds();

        let time = miscellaneous.formatDate(flush_actualdate); //Formato do return: YYYY-MM-DD hh:mm:ss.ssz

        if (i == 0) {
          oldvalue = time;
        }

        let sendtime_f = miscellaneous.millisecondsFix(time, oldvalue, 100);

        oldvalue = time;

        let dateAux;
        if (os.platform() === 'Linux') {
          dateAux = miscellaneous.reformDate(sendtime_f);
        } else {
          //win32
          dateAux = sendtime_f;
        }

        // console.log(
        //   `milliseconds: ${arduino_millis}; realtime: ${dateAux}; Level: ${req.body.Flush[i]}; Arduino id: ${arduinoId}`
        // );

        let values = [];
        values.push(arduino_millis);
        values.push(dateAux);
        values.push(0); //flush
        values.push(req.body.Flush[i]);
        values.push(arduinoId);

        groupValues.push(values);
      }
      try {
        //TODO: testar esta query em linux
        // ter atenção ao %Y-%m-%d %H:%i:%s.%f TEM DE SER IGUAL EM linux e windows
        let insertQuery = `INSERT INTO waterlevel (milliseconds,realtime,refill,value,ref_arduino) VALUES ?`;
        let query = mysql.format(insertQuery, [groupValues]);
        await insert_db(query);
      } catch (err) {
        res.status(500).json({
          success: 'failure',
          message: err
        });
        throw err;
      }

      //console.log('----- REFILL -----');

      groupValues = [];

      for (let i = 0; i < req.body.Refill.length; i++) {
        let time; //Para guardar a data para inserir na base de dados

        aux = aux + 180; //Incrementos de 180 millis em cada iteração de tempo

        arduino_millis = arduino_millis + 180; //Incrementos de 180 millis em cada iteração do tempo
        // arduino

        let mydate_aux = new Date(aux);
        let flush_actualdate =
          mydate_aux.toLocaleString('pt-PT', { hour12: false }) +
          '.' +
          mydate_aux.getMilliseconds();

        time = miscellaneous.formatDate(flush_actualdate); //Formato do return: YYYY-MM-DD hh:mm:ss.ssz
        let sendtime = miscellaneous.millisecondsFix(time, oldvalue, 180);
        oldvalue = time;

        //let dateAux = miscellaneous.reformDate(sendtime);
        let dateAux;
        if (os.platform() === 'Linux') {
          dateAux = miscellaneous.reformDate(sendtime);
        } else {
          //win32
          dateAux = sendtime;
        }

        // console.log(
        //   `milliseconds: ${arduino_millis}; realtime: ${dateAux}; Level: ${req.body.Refill[i]}`
        // );

        let values = [];
        values.push(arduino_millis);
        values.push(dateAux);
        values.push(1); //refill
        values.push(req.body.Refill[i]);
        values.push(arduinoId);

        groupValues.push(values);
      }

      try {
        let insertQuery = `INSERT INTO waterlevel (milliseconds,realtime,refill,value,ref_arduino) VALUES ?`;
        let query_refill = mysql.format(insertQuery, [groupValues]);
        await insert_db(query_refill);
      } catch (err) {
        res.status(500).json({
          success: 'failure',
          message: err
        });
        throw err;
      }

      //TODO: Check for new configurations _ REFACTORING THIS CODE.
      // let getNewChanges = 0;
      // let outuputjson = "";
      // try {
      //     let checkNewChanges = "SELECT new_changes FROM arduinos WHERE client_name=? AND client_macaddress=?";
      //     let query = mysql.format(checkNewChanges, [req.body.Client_name, req.body.Client_id]);
      //     getNewChanges = await pool.query(query);
      // } catch (err) {
      //     outputmsg = "Fail to check for new config!";
      //     miscellaneous.callStatus(req, 500, outputmsg);
      //     return res.status(500).json({
      //         success: false,
      //         message: outputmsg,
      //     });
      // }

      // if (getNewChanges[0].new_changes == 1) { //Ainda tem de se verificar se funciona.
      //     let selectConfig = "SELECT * FROM arduinos_config INNER JOIN model_tank ON arduinos_config.ref_id_modelTank=model_tank.id WHERE ref_id_arduino=(SELECT id FROM arduinos WHERE client_macaddress=? AND client_name=?);";
      //     let selectConfigquery = mysql.format(selectConfig, [req.body.Client_id, req.body.Client_name]);
      //     getNewChanges = await pool.query(selectConfigquery);
      //     outuputjson = getNewChanges[0];

      //     outputmsg = "There is a new configuration!";
      //     miscellaneous.callStatus(req, 200, outputmsg);

      //     let updateSelectConfig = "UPDATE arduinos SET new_changes = 0 WHERE client_name=? AND client_macaddress=?";
      //     let updateSelectConfigquery = mysql.format(updateSelectConfig, [req.body.Client_name, req.body.Client_id]);
      //     await pool.query(updateSelectConfigquery);
      //     outputmsg = "Configuration flag changed!";
      //     miscellaneous.callStatus(req, 200, outputmsg);
      // }

      res.status(200).json({
        success: 'success'
      });
    }
  }
}

module.exports = new data();
