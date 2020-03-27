process.env.NODE_ENV = 'development'; //[development, testing, production]

const app = require('./app');
const pool = require('./config/database');
require('./config/config.js');

const port = global.gConfig.node_port;

app.listen(port, () => {
  pool
    .query(
      `SELECT count(*) as x FROM information_schema.tables WHERE table_schema = 'smac' AND table_name = 'model_tank'`
    )
    .then(data => {
      if (data[0].x === 0) {
        console.log(
          'Some tables were not detected, please run the sql file in /usr before running the API.'
        );
        process.exit(1);
      }

      console.log(
        '\n ------------- ' +
          '\nSoftware Name: \t\t' +
          global.gConfig.app_name +
          '\nSoftware State: \t' +
          global.gConfig.config_id +
          '\nInformation: \t\t' +
          global.gConfig.app_desc +
          '\nListening on port: \t' +
          global.gConfig.node_port +
          '\n ------------- \n'
      );
    })
    .catch(err => {
      console.log('Failed to connect with the database!');
      if (global.gConfig.config_id === 'Development') throw err;
    });
});
