# Plugin: Size Changes

This plugin produces a table based on the changes between two compilation stats, and can be used to ensure files stay within a set budget (similar to [bundlesize](https://github.com/siddharthkp/bundlesize)).

As an example, to compare 2 compilation stats JSON files, you could do the following

```
webpack-bundle-delta local ./path-to/base-stats.json ./path-to/head-stats.json
```

With an example table output

```
| File                     |         Stat size         |         Gzip size         |        Brotli size        |
| :----------------------- | :-----------------------: | :-----------------------: | :-----------------------: |
| sgpStationPage.mjs       | 588.11KB (+541B / +0.09%) |  157.31KB (+165B / +0.1%) | 120.09KB (+171B / +0.14%) |
| sgpTrainTimesPage.js     | 638.41KB (+544B / +0.08%) |  170.85KB (+87B / +0.05%) |  131.53KB (+17B / +0.01%) |
```

## Configuration

Refer to [./config.ts](./config.ts) for configuration details:
- `significance` will split the output into 2 tables, a *significant* table, and *insignificant* table
- `budget` can be used to ensure files do not exceed an allowed budget, causing a warning or error to occur if budget is close/exceeded
- `hideMinorChanges` can be set to true if the dangerjs content is too long, or you feel the table isn't valuable

Example configuration
``` json
{
  "webpackBundleDelta": {
    "plugins": [
      {
        "name": "size-changes",
        "config": {
          "significance": {
            "sizeDiffBytes": 300,
            "sizeDiffPercent": 4,
            "gzSizeDiffBytes": 100,
            "gzSizeDiffPercent": 5,
            "brSizeDiffBytes": 80,
            "brSizeDiffPercent": 6,
          },
          "budget": [
            {
              "chunkName": "vendors.js",
              "size": "500KB",
              "brSize": "50KB"
            },
            {
              "chunkName": "App.js",
              "gzSize": "100KB"
            }
          ]
        }
      }
    ]
  }
}
```

