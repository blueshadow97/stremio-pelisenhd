const express = require("express");
const app = express();
const addonInterface = require("./index");

app.get("/manifest.json", (req, res) => {
  res.send(addonInterface.manifest);
});

app.get("/:resource/:type/:id.json", (req, res) => {
  addonInterface.get(req, res);
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log("PelisenHD Addon running at http://localhost:" + PORT);
});
