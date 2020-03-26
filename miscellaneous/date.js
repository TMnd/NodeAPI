const pool = require('../config/database');
const mysql = require('mysql');
const os = require('os');
const fs = require('fs');

class miscellaneous {
  reformDate(date) {
    let splitDate = date.split(' ');
    let splitData_ymd = splitDate[0].split('-');
    let splitData_hms = splitDate[1].split(':');
    let splitData_sf = splitData_hms[2].split('.');
    let output =
      splitData_ymd[0] +
      ',' +
      splitData_ymd[2] +
      ',' +
      splitData_ymd[1] +
      ' ' +
      splitData_hms[0] +
      ',' +
      splitData_hms[1] +
      ',' +
      splitData_sf[0] +
      ',' +
      splitData_sf[1];
    return output;
  }

  /**
   *
   * @param date
   * @returns {string}
   */
  formatDate(date) {
    if (os.platform() === 'win32') {
      return date;
    }

    let datacompleta = date.toLocaleString().split(',');
    let elemetnosDataCompleta = datacompleta[0].split('/');

    return (
      elemetnosDataCompleta[2] +
      '-' +
      elemetnosDataCompleta[0] +
      '-' +
      elemetnosDataCompleta[1] +
      datacompleta[1]
    );
  }

  /**
   * A razão pela qual esta função é necessaria é devido ao seguinte problema:
   *  na situação que a data é 2019-07-09 12:17:19.890 e estivermos no contexto do refill que se tem de incrementar 180
   *  milesegundos o resultado devia ser 2019-07-09 12:17:20.070, mas resulta em 2019-07-09 12:17:20.70 que posteriormente
   *  cria problemas no grafico que me o ponto está mais avançado que o ponto anterior e o ponto seguinte.
   *  Parameter:
   *    - dateanterior => valor em data
   *    - valor a incrementar (100 para o flush, 180 para o refill)
   */
  millisecondsFix(dataactual, dateanterior, valor) {
    let dataactual_aux,
      dataactual_aux_split,
      dateanterior_aux_split,
      dateanterior_aux,
      output,
      milli_correctos;
    dataactual_aux_split = dataactual.split('.');
    dataactual_aux = dataactual_aux_split[1];
    if (dataactual_aux.length < 3) {
      dateanterior_aux_split = dateanterior.split('.');
      dateanterior_aux = parseInt(dateanterior_aux_split[1]) + parseInt(valor);
      output = dateanterior_aux.toString();
      milli_correctos = output.slice(0, 0) + output.slice(1, output.length);
      return dataactual_aux_split[0] + '.' + milli_correctos;
    }
    return dataactual;
  }

  /**
   *
   * @param dest
   * @param msg
   */
  createFile(dest, msg) {
    fs.access(dest, fs.F_OK, err => {
      if (err) {
        fs.writeFile(dest, msg + '\n', { flag: 'w' }, function(err) {
          if (err) throw err;
        });
      } else {
        fs.appendFile(dest, msg + '\n', function(err) {
          if (err) throw err;
        });
      }
    });
  }
}

module.exports = new miscellaneous();
