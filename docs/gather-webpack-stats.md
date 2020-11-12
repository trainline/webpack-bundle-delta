# Gather Webpack Stats

There are a few ways to get webpack stats.

## Webpack CLI `--profile --json` output

Webpack can output compilation stats by passing the `--profile --json` flags.

```
webpack --profile --json > stats.json
```

This file can then be used by `webpack-bundle-delta` to analyse and compare.

## Using a Stats plugin

An alternate approach is to use a webpack plugin to produce compilation stats. This gives more granular control as you can pick and choose what stats to gather, and should allow for reduced impact on the build (as compared to default configuration).

Install and use [FormidableLabs/webpack-stats-plugin](https://github.com/FormidableLabs/webpack-stats-plugin) or [stats-webpack-plugin](https://github.com/unindented/stats-webpack-plugin) as part of your webpack config.

As documented by [`webpack-stats-plugin`'s basic example](https://www.npmjs.com/package/webpack-stats-plugin#basic)

``` js
# webpack.config.js
const { StatsWriterPlugin } = require('webpack-stats-plugin');
 
module.exports = {
  plugins: [
    // Everything else **first**.
 
    // Write out stats file to build directory.
    new StatsWriterPlugin({
      filename: 'stats.json' // Default
    })
  ]
}
```

If you do desire more granular control, please ensure to set the following `stats` options to `true` as to align with what the default webpack stats outputs:
``` js
    new StatsWriterPlugin({
      stats: {
        assets: true,
        entrypoints: true,
        chunks: true,
        modules: true,
      }
    }),
```

## Working with Parallel Webpack

[Trivago's `parallel-webpack`](https://github.com/trivago/parallel-webpack) is a great tool to help speed up multiple webpack compilations.

When using `--profile --json` with `parallel-webpack`, the output isn't exactly aligned with what `webpack` itself would produced, but we have catered for that with the [`extractStats.ts` helper](../src/helpers/extractStats.ts).

However, when used with a Stats Plugin such as `webpack-stats-plugin`, there is a good chance the only output for it will be the compilation which finished last. This is because each plugin is executed at the end of the compile step.

To overcome this problem, you can make use of [`MergeCompilationStatsWebpackPlugin`](../src/helpers/MergeCompilationStatsWebpackPlugin.ts).

Enhancing [the basic example](https://github.com/trivago/parallel-webpack#basic-example)

``` js
# webpack.config.js
const path = require('path');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const { MergeCompilationStatsWebpackPlugin } = require('webpack-bundle-delta');

const outputPath: path.resolve(__dirname, './dist');

// this will look in the `assetsPath` folder for all `inputFiles` and output a file with the `filename` containing all the stats
const mergeStats = new MergeCompilationStatsWebpackPlugin({
  assetsPath: outputPath,
  inputFiles: ['statsA.json', 'statsB.json'],
  filename: 'statsAll.json',
});

module.exports = [
  {
    entry: './pageA.js',
    output: {
      path: outputPath,
      filename: 'pageA.bundle.js',
    },
    plugins: [
      // Everything else **first**.
  
      // Write out stats file to build directory.
      new StatsWriterPlugin({
        filename: 'statsA.json' // Default
      }),
      mergeStats,
    ]
  },
  {
    entry: './pageB.js',
    output: {
      path: outputPath,
      filename: 'pageB.bundle.js'
    }
    plugins: [
      // Everything else **first**.
  
      // Write out stats file to build directory.
      new StatsWriterPlugin({
        filename: 'statsB.json' // Default
      }),
      mergeStats,
    ]
  }
];
```
