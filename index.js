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

// Dummy catalog response
builder.defineCatalogHandler(() => {
  return Promise.resolve({
    metas: [
      {
        id: 'dummy1',
        name: 'Example Movie 1',
        type: 'movie',
        poster: 'https://via.placeholder.com/200x300?text=PelisenHD'
      }
    ]
  });
});

// Dummy stream response
builder.defineStreamHandler(({ id }) => {
  return Promise.resolve({
    streams: [
      {
        title: 'Latino Stream',
        url: 'https://example.com/stream.mp4'
      }
    ]
  });
});

module.exports = builder.getInterface();
