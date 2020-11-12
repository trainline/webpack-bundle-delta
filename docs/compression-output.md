# Compression Output

So that `webpack-bundle-delta` can provide more meaningful comparisons closer to what the end user would be receiving we advise that you also include `gzip` and `brotli` compressions to your webpack output.

To get the compressed versions, you can use [`CompressionWebpackPlugin`](https://webpack.js.org/plugins/compression-webpack-plugin/).

## Getting started

Install [`CompressionWebpackPlugin`](https://webpack.js.org/plugins/compression-webpack-plugin/):
``` bash
# npm
$ npm install compression-webpack-plugin --save-dev
# yarn
$ yarn add compression-webpack-plugin --dev
```

## Configuring webpack

Configuring webpack to produce the output is relatively straightforward

``` js
# webpack.config.js
const { StatsWriterPlugin } = require('webpack-stats-plugin');

module.exports = {
  plugins: [
    // build gzip assets
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|mjs|css)$/,
    }),
    // build brotli assets
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|mjs|css)$/,
    }),
  ]
}
```

It is worth taking a read of the documentation for more details as to how to best configure the compressed output for your needs.
