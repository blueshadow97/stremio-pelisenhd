const { addonBuilder } = require('stremio-addon-sdk');

const manifest = {
  id: 'org.pelisenhd',
  version: '1.0.0',
  name: 'PelisenHD Latino',
  description: 'Latino movies from PelisenHD.org',
  resources: ['catalog', 'stream'],
  types: ['movie'],
  catalogs: [
    {
      type: 'movie',
      id: 'main',
      name: 'PelisenHD Movies'
    }
  ]
};

const builder = new addonBuilder(manifest);

// Dummy catalog handler
builder.defineCatalogHandler(() => {
  return Promise.resolve({
    metas: [
      {
        id: 'example-id-1',
        type: 'movie',
        name: 'Example Movie',
        poster: 'https://via.placeholder.com/200x300?text=PelisenHD'
      }
    ]
  });
});

// Dummy stream handler
builder.defineStreamHandler(({ id }) => {
  return Promise.resolve({
    streams: [
      {
        title: 'Stream Link',
        url: 'https://example.com/video.mp4'
      }
    ]
  });
});

module.exports = builder.getInterface();
