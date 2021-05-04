# webpack-bundle-delta Data Sources

Data sources provide a uniform way of consuming the webpack compilation statistics, as well as reporting back to them (todo).

As not all teams/organisations will have the same approach, having a uniform way allows for greatly flexibility for this plugin to be used.

## Implementing and extending

Every data source should do the following:

- Create a class extending the [`BaseDataSource`](BaseDataSource.ts):
  - implement `getCompilationStats()` in the extending base class
    - Failure to do so will cause an error to be thrown
    - Use `this.validateCompilationStats` to validate the data (ensuring the correct webpack stats properties are there)
    - Return the stats
  - make this the default export in the folder's `index.ts` file
- Implement a `cli.ts` which follows the [`CliProgram`](../CliProgram.ts) interface:
  - Refer to [`commander`'s Action handler (sub)commands](https://github.com/tj/commander.js#action-handler-subcommands) for setting up your command
  - Use the `execAction` callback as the means to provide the necessary options back to the main [`cli` program](../cli.ts)
  - Register your CLI to the [`cliIndex.ts`](./cliIndex.ts) file

If a data source requires extending, or a new data source is needed please feel free to raise a PR (more the merrier).

Present data sources:

- [LocalFile](LocalFile.ts)
- [TeamCity](TeamCity.ts)

## Usage

All data sources are accessible via the root import, as `<name>DataSource` (i.e. [TeamCity](./TeamCity) is available as `TeamCityDataSource`):

``` javascript
import { TeamCityDataSource } from 'webpack-bundle-delta';
```

Create an instance of the data source passing it the necessary options, and pass it to the `danger` command.
