# Plugin: Duplication detection

This plugin will detect when a node module has multiple instances within the same chunk.

Why?

- Overlapping functionality
- Shipping multiple copies of the same code results in larger bundle size, and unnecessary work for the JavaScript engine
- Certain libraries (such as React and jQuery) should only ever have 1 instance

Why you may need the duplicates?
- Different functionality between major versions
- You're using a library that hasn't yet upgraded but isn't a major problem having duplicates

As an example, to compare 2 compilation stats JSON files, you could do the following

```
webpack-bundle-delta local ./path-to/base-stats.json ./path-to/head-stats.json
```

With an example output

```
## Duplication detection

sgpStationPage.js

- intersection-observer
  - intersection-observer (ADDED)
  - @fleet-components/sgp-footer/node_modules/intersection-observer (ADDED)

- rc-collapse
  - rc-collapse (ADDED)
  - @fleet-components/accordion/node_modules/rc-collapse (ADDED)

sgpTrainTimesPage.js

- intersection-observer
  - intersection-observer (existing)
  - @fleet-components/sgp-footer/node_modules/intersection-observer (existing)

- react-transition-group
  - @fleet-components/cookies-policy-banner/node_modules/react-transition-group (existing)
  - @fleet-components/base-popup/node_modules/react-transition-group (existing)
  - @fleet-components/carriers/node_modules/react-transition-group (existing)

- query-string
  - @fleet-components/autocomplete-sgp-stations/node_modules/query-string (existing)
  - query-string (existing)
```

## Configuration

Refer to [./config.ts](./config.ts) for configuration details.

Example configuration
``` javascript
{
  "webpackBundleDelta": {
    "plugins": [
      {
        "name": "duplication-detection",
        "config": {
          "minSize": "1KB",
          "ignore": ["react-intl", "lodash"],
          "showExisting": true
        }
      }
    ]
  }
}
```
