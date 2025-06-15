// index.js
const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const cheerio = require("cheerio");

const manifest = {
    id: "org.pelisenhd.addon",
    version: "1.0.0",
    name: "PelisenHD Español",
    description: "Películas y series en español latino desde pelisenhd.org",
    resources: ["catalog", "stream"],
    types: ["movie", "series"],
    catalogs: [
        {
            type: "movie",
            id: "pelisen-movies",
            name: "PelisenHD Películas"
        },
        {
            type: "series",
            id: "pelisen-series",
            name: "PelisenHD Series"
        }
    ],
    idPrefixes: ["pelisen"]
};

const builder = new addonBuilder(manifest);

const scrapePelisenCatalog = async (type) => {
    const url = type === 'movie' ? 'https://pelisenhd.org/peliculas/' : 'https://pelisenhd.org/series/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const items = [];

    $('.MovieList .TPost').each((i, el) => {
        const title = $(el).find(".Title").text().trim();
        const poster = $(el).find("img").attr("src");
        const href = $(el).find("a").attr("href");
        const id = "pelisen:" + encodeURIComponent(href);

        items.push({
            id,
            name: title,
            poster,
            type
        });
    });

    return items;
};

builder.defineCatalogHandler(async ({ type, id }) => {
    if (id !== `pelisen-${type}`) return { metas: [] };
    const metas = await scrapePelisenCatalog(type);
    return { metas };
});

builder.defineStreamHandler(async ({ type, id }) => {
    if (!id.startsWith("pelisen:")) return { streams: [] };
    const decodedUrl = decodeURIComponent(id.replace("pelisen:", ""));
    try {
        const { data } = await axios.get(decodedUrl);
        const $ = cheerio.load(data);
        const streams = [];

        $('iframe').each((i, el) => {
            const src = $(el).attr('src');
            if (src && src.startsWith('https://')) {
                streams.push({
                    title: `Servidor ${i + 1}`,
                    url: src
                });
            }
        });

        return { streams };
    } catch (err) {
        console.error("Error scraping stream:", err.message);
        return { streams: [] };
    }
});

module.exports = builder.getInterface();
