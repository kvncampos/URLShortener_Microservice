require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// ---------------------------------------------------------------------------------------------------------

// /api/shorturl; Returns Original URL and shortcode for it. Need to first check if URL is Valid

const dns = require('node:dns');
const { error } = require('node:console');
const options = {
  family: 4,
  // hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

app.post('/api/:shorturl', (req, res) => {
    dns.lookup(req.params.shorturl, options, (err, address, family) => {
      if (err) {
        return console.log(err)
      }
      console.log('address: %j family: IPv%s', address, family)
      console.log(err)
  });
});

// ---------------------------------------------------------------------------------------------------------
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
