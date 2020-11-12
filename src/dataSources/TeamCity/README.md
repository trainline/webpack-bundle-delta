# TeamCity Data Source

The TeamCity Data Source allows you to connect to your build pipeline to retrieve the artifacts stored.

## Setting up your build pipeline

1. Set up the compilation stats as a [build artifact](https://www.jetbrains.com/help/teamcity/build-artifact.html#Artifacts+Storage)
2. Take note of the `Build configuration ID` (refer to [Configuring General Settings](https://www.jetbrains.com/help/teamcity/configuring-general-settings.html))

## Setting up Danger pipeline

Note:
- If you run danger in the same as the build pipeline, you'll need to use the ~~[MixedDataSource](../Mixed)~~ (TODO, currently not supported)
- If you have a separate danger pipeline, ensure it is execute AFTER the build pipeline (as the build artifact needs to be available)
- The `%system.teamcity.auth.userId%` and `%system.teamcity.auth.password%` values mentioned below are automatically created for TeamCity agents to communicate back with TeamCity server

Set up the following [build parameters](https://www.jetbrains.com/help/teamcity/configuring-build-parameters.html):
- `env.TC_USER` with value `%system.teamcity.auth.userId%`
- `env.TC_PASSWORD` with value `%system.teamcity.auth.password%`
- `env.TC_SERVER_URL` with the value of your TeamCity server (for example, `https://teamcity.company.com`)

In your `dangerfile.js`:

``` javascript
import { danger as wbdDanger, TeamCityDataSource } from 'webpack-bundle-delta';

const { TC_USER, TC_PASSWORD, TC_SERVER_URL } = process.env;

wbdDanger({
  dataSource: new TeamCityDataSource({
    buildType: 'YourBuildId' /* from the build pipeline, the value on step 2 */,
    serverUrl: TC_SERVER_URL,
    username: TC_USER,
    password: TC_PASSWORD,
  }),
  baseSha: danger.github.pr.base.sha,
  headSha: danger.github.pr.head.sha,
});
```
