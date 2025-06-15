const express = require('express');
const addonInterface = require('./index'); // your index.js must export the addon
const app = express();

app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(addonInterface.manifest));
});

app.get('/:resource/:type/:id?.json', (req, res) => {
  addonInterface.get(req.params).then(resp => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(resp));
  }).catch(err => {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  });
});

module.exports = (req, res) => app(req, res);

