const _ = require('lodash');

// Environment variables
const config = require('../config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'Development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);
global.gConfig = finalConfig;
