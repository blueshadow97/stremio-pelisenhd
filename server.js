const express = require('express');
const addonInterface = require('./index'); // this must export the addon
const app = express();

// Serve the manifest
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(addonInterface.manifest));
});

// Serve addon resources (catalog, stream)
app.get('/:resource/:type/:id?.json', (req, res) => {
  addonInterface.get(req.params).then(resp => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(resp));
  }).catch(err => {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  });
});

// Export for Vercel
module.exports = app;

// For local testing
if (require.main === module) {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log(`PelisenHD addon running at http://localhost:${PORT}`);
  });
}
