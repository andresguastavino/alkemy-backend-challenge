require('dotenv').config();
const { PORT, NODE_ENV } = process.env;

const express = require('express');
const bodyParser = require('body-parser');

const router = require('./routes');
require('./database');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);
app.use((req, res, next) => {
    res.status(404).json({ result: 'error', errors: [ 'Requested route not found' ]});
});

app.listen(PORT, () => {
    console.log(`App listening on port ${ PORT } and in ${ NODE_ENV } mode`);
});