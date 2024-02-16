require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./DB/db');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);


app.listen(3000, () => {
  console.log('Server started on port 3000');
});