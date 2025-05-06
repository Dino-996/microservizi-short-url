require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urls = [];
let counter = 1;

app.get("/api/shorturl/:short", function (req, res) {
  let short_param = req.params.short;

  urls.forEach(url => {
    if (parseInt(url.short_url) === parseInt(short_param)) {
      res.redirect(url.original_url);
      return;
    }
  });

  res.json({ error: "No short URL found for the given input" });
});

app.post('/api/shorturl', function (req, res) {
  const url_input = req.body.url;
  const isUrlValida = (email) => { const regex = /^https?:\/\/[\w.-]+\.[a-z]{2,}(\/.*)?$/i; return regex.test(email); }

  if (!url_input) {
    res.status(404).json({ error: 'not found' })
  }

  if (!isUrlValida(url_input)) {
    res.json({ error: 'invalid url' });
    return;
  }

  urls.forEach(url => {
    if (url.original_url === url_input) {
      res.json({ original_url: url.url_input, short_url: url.short_url });
      return;
    }
  });

  const short_url = counter++;
  urls.push({ original_url: url_input, short_url: short_url });

  res.json({ original_url: url_input, short_url: short_url });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
