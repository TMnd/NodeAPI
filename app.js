const express = require('express');
const morgan = require('morgan');

const authRouter = require('./routes/authsRoute');
const dataRouter = require('./routes/datasRoute');
const tankRouter = require('./routes/tanksRoute');

const app = express();

//Middleware
app.use(morgan('dev'));
app.use(express.json());

//Check if the database have the tables

// app.use('/api/v1/auths', authRouter);
app.use('/api/v1/data', dataRouter);
app.use('/api/v1/tanks', tankRouter);

module.exports = app;
