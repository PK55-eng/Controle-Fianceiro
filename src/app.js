const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errors = require('./middlewares/errorHandler');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50kb' }));
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '../public')));
app.use(errors);

module.exports = app;
