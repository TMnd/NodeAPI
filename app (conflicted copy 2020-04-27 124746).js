const express = require('express');
const morgan = require('morgan');

// const authRouter = require('./routes/authsRoute');
const dataRouter = require('./routes/datasRoute');
const tankRouter = require('./routes/tanksRoute');

const app = express();

//Middleware
app.use(morgan('dev'));
app.use(express.json());

// app.use('/api/v1/auths', authRouter);
app.use('/api_v2/data', dataRouter);
app.use('/api_v2/tanks', tankRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
