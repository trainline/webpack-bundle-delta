# Plugin: Trace Changes

This plugin will produce a trace of file changes that have occurred for each chunk that is produced.

Use this in combination with the [`size-changes`](../size-changes) plugin to understand how chunks are changing.

Example output

```
changes-1.mjs
  - module-1a.js 9.77KB (ADDED)
  - module-1b.js 0B (REMOVED)

changes-2.js
  - module-2c.js 10B (-40B / -0.44%)
```

## Configuration

There aren't any configurations for this plugin. Simply add it and you're done.

Example configuration
``` javascript
{
  "webpackBundleDelta": {
    "plugins": [
      {
        "name": "trace-changes"
      }
    ]
  }
}
```
