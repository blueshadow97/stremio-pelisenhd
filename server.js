const express = require('express');
const addonInterface = require('./index'); // index.js must export the addon
const app = express();

// Manifest route for Stremio
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(addonInterface.manifest));
});

// Stream/catalog route for Stremio
app.get('/:resource/:type/:id?.json', (req, res) => {
  addonInterface.get(req.params).then(resp => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(resp));
  }).catch(err => {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  });
});

// Required for Vercel serverless function
module.exports = (req, res) => app(req, res);
