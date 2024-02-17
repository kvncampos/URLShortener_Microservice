require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./DB/db');
const Routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', Routes);


app.listen(3000, () => {
  console.log('Server started on port 3000');
});