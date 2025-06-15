const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const cheerio = require("cheerio");

const manifest = require("./manifest.json");
const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async () => {
  const res = await axios.get("https://pelisenhd.org/peliculas/");
  const $ = cheerio.load(res.data);

  const metas = [];

  $(".TPostMv article").each((_, el) => {
    const title = $(el).find(".Title").text().trim();
    const poster = $(el).find("img").attr("data-src");
    const href = $(el).find("a").attr("href");

    metas.push({
      id: href,
      name: title,
      type: "movie",
      poster
    });
  });

  return { metas };
});

builder.defineStreamHandler(({ id }) => {
  return Promise.resolve({
    streams: [
      {
        title: "PelisenHD (Open in browser)",
        externalUrl: id
      }
    ]
  });
});

module.exports = builder.getInterface();
