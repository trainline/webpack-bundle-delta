# Plugins

Plugins are used to perform computations against the retrieved webpack bundle stats, with the main focus being on surfacing issues between base and head stats.

## Usage

Refer to [../config](../config) for how to set up the configuration `webpack-bundle-delta`.

By default, plugins are configured to run based on [../config/allPlugins.ts](../config/allPlugins.ts). The idea is to make use of all the plugins available to ensure maximum utility and details are given to the user.

As an example of how to configure `size-changes` plugin, here is an example

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

The `plugins` option takes an array of objects with the following properties:
- `name`: name of the plugin, this will also act as a resolver in the following order (if it cannot find it, it moves to the next strategy):
  - In `webpack-bundle-delta`'s plugins folder
  - require it (assuming it is a node module)
  - require it based on the established `config` location file (name then can be relative path to plugin)
  - require it based on the `process.cwd()` (name then can be relative path to plugin)
- `config`: configuration object to be passed to the plugin
  - if plugin does not require any configurations, set to `true`
  - if you wish to disable the plugin, set to `false`

For more information about the appropriate `config` values, refer to the individual plugin's documentation.

## Creating a plugin

Every plugin should do the following:

- Create a class extending the [`BasePlugin`](BasePlugin.ts) implementing the necessary methods:
  - `constructor`: extend the `BasePluginOptions` where `config` will be the configuration of your plugin (passed to it by [`index.ts`](index.ts))
    - Be sure to parse both the `baseCompilationStats` and `headCompilationStats` provided to the constructor
  - `summaryOutput`: short output (with no markdown content) to describe the result
    - If this isn't necessary for the plugin, return `null` or `''`
  - `dangerOutput`: output to be placed within the collapsed content of the PR comment which includes greater detail as ot the result of the plugin
    - Ensure that the output adheres to [GitHub Markdown guidelines](https://guides.github.com/features/mastering-markdown/)
  - `cliOutput`: output to be included in the CLI content
    - Keep markdown to a minimum (for example do not backtick (`) things)
  - `warningMessages` and `errorMessages` (both optional): messages that will appear as a warning/error. If errorMessages is provided, it will cause the application to error out.
- If your plugin offers configurations, create a `config.ts` file:
  - export interface with the name `PluginNameConfig` (for example `SizeChangesConfig`)
  - Document your configuration (suggest using the [Visual Studio Extension `Document This`](https://marketplace.visualstudio.com/items?itemName=oouo-diogo-perdigao.docthis))
  - Export a default configuration (to be used if the consuming application does not specify one)
  - The nature of plugins should focus on "the delta", meaning only what has been introduced/changed/removed. However, it can be useful to also highlight existing behaviour too. But these should be hidden by a config flag `showExisting` (aligning with other plugins).
- Add the default configuration to [../config/allPlugins.ts](../config/allPlugins.ts)
  - If the plugin does not require configuration, set `config` to `true`
  - If the plugin should not be run without application knowledge (such as the [Restrict Plugin](./restrict)), set `config` to `false` (which will negate its usage)
- When parsing webpack compilation stats files, it is best to do so with the following template (which ensure both webpack single AND multi-compile parsing support):
  ``` javascript
  import { extractStats } from 'webpack-bundle-delta';

  const yourPluginLogic = (compilationStats: webpack.Stats.ToJsonOutput) => {
    const statsToParse: webpack.Stats.ToJsonOutput[] = extractStats(compilationStats);
    // use `statsToParse` to determine logic - map, reduce, etc.
  };
  ```

If you wish to create your own plugin, you can either publish it as a node package or have the code simply live somewhere within your repo. Then refer to it in the `name` property on the Usage (documented above).

Note: Defaults can be done within the plugin by checking if the `config` property of the constructor options is `undefined`, and if it is apply the default options. However, this usage cannot be merged together with the configuration manager.
