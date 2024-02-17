require('dotenv').config();
const express = require('express');
const shortUrlModel = require('./DB/Schemas/shortUrl');
const bodyParser = require('body-parser');
const router = express.Router();
const Counter = require('./DB/Schemas/counterModel')
const dns = require('dns');
const cors = require('cors');

router.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204
router.use('/public', express.static(`${process.cwd()}/public`));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// Welcome Page
router.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/urlShortener_View.html');
});

// Your first API endpoint
router.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// -------------------------------------------------------------------------------------------------------------------------------------

// Get All DB Data
router.get('/api/shorturl/all', async (req, res) => {
  try {
    const data = await shortUrlModel.find().select({ original_url: 1, short_url: 1 , _id: 0});
    if (data && data.length > 0) {
      console.log(data);
      res.send(data);
    } else {
      console.error(404);
      res.status(404).json({ "Code 404": 'Database is Empty.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// -------------------------------------------------------------------------------------------------------------------------------------
router.post('/api/shorturl', async (req, res) => {
  //Post url from user input
  const url = req.body.url;
  try {
      const parsedUrl = new URL(url);
      let something = dns.lookup(parsedUrl.hostname, async (err, address, family) => {
          console.log({
            "URL": `${url}`,
            "IP": address
          })
          if (!address) {
              console.error({'HTTP/400': `Invalid URL: ${parsedUrl}`});
              // return res.status(400).json({ error: 'Invalid URL' });
              res.json({ error: 'Invalid URL' });
          } else {

              console.log({'HTTP/200': `Valid Url Request ${url}`});

              // Check if document with the given original_url exists
              const exist_url = await shortUrlModel.findOne({"original_url": url});
              if (exist_url === null || exist_url.length === 0) {

                  // No documents with the given original_url found, continue
                  console.log({
                      'HTTP/201': `Valid Url Request ${url}`,
                      'Info': 'No Documents with That URL in Database, Created New Document Entry!'
                  });

                  // Create short URL and save it to database
                  try {
                      const counter = await Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
                      const shortUrlValue = counter.count || 1;
                      const shortUrl = new shortUrlModel({
                          "original_url": url,
                          "short_url": shortUrlValue,
                      });
                      await shortUrl.save();
                      return res.status(200).json({
                        "original_url": url, 
                        "short_url": shortUrlValue
                      });
                  } catch (error) {
                      console.error(error);
                      return res.status(500).send(error);
                  }
              } else {
                  // Documents with the given original_url found
                  console.log('Documents found with original_url:', url);
                  return res.status(200).json({
                      "HTTP/200": 'Email already in Database.',
                      "Message": 'Please Try Another URL or Delete Record',
                  }).end();
              }
          }
      });
  } catch (error) {
    console.error({'HTTP/400': `Invalid URL ${url}`});
    // return res.status(400).json({ error: 'Invalid URL' })
    res.json({ error: 'Invalid URL' })

  }
});


// -------------------------------------------------------------------------------------------------------------------------------------
// Get all users
router.get('/api/shorturl/:code', async (req, res) => {
  let id = req.params['code'] 
  try {
    const exist_url = await shortUrlModel.findOne({"short_url": id});
    if (exist_url === null || exist_url.length === 0) {
      res.json({'HTTP/400': "No ShortCodes Exist."});
    }
    else {
      console.log({"HTTP/301": `Redirecting to ${exist_url.original_url}`})
      res.redirect(exist_url.original_url)
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  };
});

// Update a user
router.put('/api/shorturl/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const { short_url } = req.body;

  try {
    const user = await shortUrlModel.findByIdAndUpdate(shortcode, { short_url }, { new: true });
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Delete a user
router.delete('/api/shorturl/:shortcode', async (req, res) => {
  const { url } = req.params;

  try {
    const user = await shortUrlModel.findByIdAndDelete(url);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

router.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status);
  res.render('error');
});


module.exports = router;