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

// Storage
const urls = [];
let counter = 1;

// GET short URL
app.get("/api/shorturl/:short", function (req, res) {
  const shortParam = parseInt(req.params.short);
  const found = urls.find(url => url.short_url === shortParam);

  if (found) {
    return res.redirect(found.original_url);
  } else {
    return res.json({ error: "No short URL found for the given input" });
  }
});

// POST new URL
app.post('/api/shorturl', function (req, res) {
  const url_input = req.body.url;

  const isUrlValid = (url) => {
    const regex = /^https?:\/\/[\w.-]+\.[a-z]{2,}(\/.*)?$/i;
    return regex.test(url);
  }

  if (!url_input) {
    return res.status(400).json({ error: 'not found' });
  }

  if (!isUrlValid(url_input)) {
    return res.json({ error: 'invalid url' });
  }

  // Check if URL already exists
  const existing = urls.find(url => url.original_url === url_input);
  if (existing) {
    return res.json({ original_url: existing.original_url, short_url: existing.short_url });
  }

  // Save new URL
  const short_url = counter++;
  urls.push({ original_url: url_input, short_url: short_url });

  res.json({ original_url: url_input, short_url: short_url });
});

// Start
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
