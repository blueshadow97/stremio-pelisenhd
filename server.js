const express = require('express');
const addonInterface = require('./index'); // This must export your addon
const app = express();

// Serve the manifest
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(addonInterface.manifest));
});

// Serve addon resources
app.get('/:resource/:type/:id?.json', (req, res) => {
  addonInterface.get(req.params).then(resp => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(resp));
  }).catch(err => {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  });
});

// ✅ THIS is what Vercel expects
module.exports = (req, res) => app(req, res);

// ✅ For local testing only
if (require.main === module) {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log(`PelisenHD Addon running at http://localhost:${PORT}`);
  });
}
