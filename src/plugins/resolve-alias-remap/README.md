# Plugin: Resolve alias remap

This plugin can help suggest remapping of certain node modules which are considered duplicates of what you may already have in your bundle already.

Current coverage:

- Convert `lodash.*` to `lodash/*`

Why?

- Overlapping functionality
- Shipping multiple copies of the same code results in larger bundle size, and unnecessary work for the JavaScript engine

As an example, to compare 2 compilation stats JSON files, you could do the following

```
webpack-bundle-delta local ./path-to/base-stats.json ./path-to/head-stats.json
```

With an example output

```
## Resolve Alias Remap

The following suggestions may be added to the webpack resolve.alias section to reduce duplicated functionality:
- `"lodash.isequal": "lodash/isEqual"`
- `"lodash.omitby": "lodash/omitBy"`
```

## Configuration

Refer to [./config.ts](./config.ts) for configuration details.

Example configuration
``` javascript
{
  "webpackBundleDelta": {
    "plugins": [
      {
        "name": "resolve-alias-remap",
        "config": {
          "showExisting": false,
          "remap": [{ "searchFor": "lodash.([^/]+)", "aliasEntry": "lodash.$1: lodash/$1" }],
        }
      }
    ]
  }
}
```
