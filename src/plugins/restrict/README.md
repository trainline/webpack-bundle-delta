# Restrict Plugin

Sometimes packages are created or consumed which bundle server side only code with it. This plugin can be used to help the team identify these files, preventing them from being bundled into your application and shipped to project.

As an example scenario... there are 2 common ways for dealing with translations:
1. Create JavaScript bundles for every locale the application must cater for. This would involve many webpack configurations to ensure the right bundles are produced.
2. Create 1 JavaScript bundle, and provide the translations from server side and set it as part of the page state.

In the case of the second scenario, we want to make sure the translations (other than the default/fallback language) is prevented from being bundled in, as this would result in all the different translation files being mistakenly bundled into the JavaScript bundle, rather than being split apart.

Why?

- Keep control of what ends up in your JavaScript bundle
- Files such as translations, if they are not necessary, really grows the JavaScript bundle even under compression because they're not repeatable strings.
- This plugin is kept quite generic as it requires an understanding of the application architecture

## Configuration

Refer to [./config.ts](./config.ts) for configuration details.

By default, this plugin is disabled as it requires in-depth knowledge of the application architecture.

Example configuration
``` javascript
{
  "webpackBundleDelta": {
    "plugins": [
      {
        "name": "restrict",
        "config": {
          "showExisting": false,
          "restrictions": [
            {
              "search": './src/server/.+',
              "responseType": 'error',
              "message": 'no server code to be bundled in client side',
            },
            { search: 'lodash.omitby', responseType: 'warn', message: 'no lodash.omitby allowed' },
          ],
        }
      }
    ]
  }
}
```
