const express = require('express');
const addonInterface = require('./index'); // index.js must export the addon
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

// ✅ This part is essential for Vercel
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log(`PelisenHD Addon running at http://localhost:${PORT}`);
  });
}


