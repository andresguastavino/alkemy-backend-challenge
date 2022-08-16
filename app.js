require('dotenv').config();
const { PORT, NODE_ENV } = process.env;

const express = require('express');
const bodyParser = require('body-parser');

require('./database');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`App listening on port ${ PORT } and in ${ NODE_ENV } mode`);
});