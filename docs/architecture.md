# Architecture

![Architecture Diagram](./images/architecture.drawio.svg)

## Data Sources

Data Sources provide a uniform way of consuming the webpack compilation statistics, as well as reporting back to them (todo).

More details can be found in the [data sources readme.md file](../src/dataSources).

## Plugins

Plugins are used to perform computations against the retrieved webpack bundle stats, with the main focus being on surfacing issues between base and head stats.

More details can be found in the [plugins readme.md file](../src/plugins).

## Core

The core is the primary piece that pulls the use of an data source together with the plugins. This includes:

- Providing a CLI
- Providing the ability to post to PRs using [danger js](https://danger.systems/js/)
- Consuming the application configuration to override default configurations

## Config

`webpack-bundle-delta` is zero-config out of the box, but you can customise each plugin accordingly.

More details can be found in the [config readme.md file](../src/config).
