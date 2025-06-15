const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const cheerio = require("cheerio");

const manifest = {
    id: "org.pelisenhd.addon",
    version: "1.0.0",
    name: "PelisenHD Español",
    description: "Películas y series en español latino desde pelisenhd.org",
    types: ["movie", "series"],
    resources: ["catalog", "stream"],
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

// Helper: scrape PelisenHD
async function scrape(type) {
    const url = type === "movie" ? "https://pelisenhd.org/peliculas/" : "https://pelisenhd.org/series/";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const metas = [];

    $(".TPost").each((_, el) => {
        const name = $(el).find(".Title").text().trim();
        const poster = $(el).find("img").attr("src");
        const link = $(el).find("a").attr("href");
        if (name && poster && link) {
            metas.push({
                id: "pelisen:" + encodeURIComponent(link),
                name,
                poster,
                type
            });
        }
    });

    return metas;
}

// Catalog handler
builder.defineCatalogHandler(async ({ type, id }) => {
    if (id !== `pelisen-${type}`) return { metas: [] };
    const metas = await scrape(type);
    return { metas };
});

// Stream handler
builder.defineStreamHandler(async ({ id }) => {
    if (!id.startsWith("pelisen:")) return { streams: [] };
    const url = decodeURIComponent(id.replace("pelisen:", ""));
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const streams = [];

        $("iframe").each((i, el) => {
            const src = $(el).attr("src");
            if (src?.startsWith("https://")) {
                streams.push({
                    title: `Servidor ${i + 1}`,
                    url: src
                });
            }
        });

        return { streams };
    } catch (err) {
        console.error("Stream scrape error:", err.message);
        return { streams: [] };
    }
});

// 🚀 Final export for Stremio
module.exports = builder.getInterface();
