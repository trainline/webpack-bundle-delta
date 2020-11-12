/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import fs from 'fs';
import path from 'path';
import BasePlugin from './BasePlugin';
import { UserDefinedConfig } from '../config/PluginConfig';

const plugins = async (
  userDefinedConfig: UserDefinedConfig,
  baseCompilationStats: webpack.Stats.ToJsonOutput,
  headCompilationStats: webpack.Stats.ToJsonOutput
): Promise<BasePlugin[]> => {
  return (userDefinedConfig.plugins || [])
    .map(({ name, config }) => {
      if (config === false) {
        return null;
      }

      // strategy 1: exists in the `plugins` folder
      const pluginPath = path.normalize(path.join(__dirname, name));
      let module: unknown;
      let Plugin: BasePlugin = null;
      if (fs.existsSync(pluginPath)) {
        // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
        Plugin = require(pluginPath).default as BasePlugin;
      }

      if (!Plugin) {
        // strategy 2: exists as a node module
        try {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          module = require(name);
        } catch (error) {
          // noop
        }
      }

      if (!module) {
        // strategy 3: relative to config file
        try {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          module = require(path.join(path.dirname(userDefinedConfig.filepath), name));
        } catch (error) {
          // noop
        }
      }

      if (!module) {
        // strategy 4: relative to process.cwd
        try {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          module = require(path.join(process.cwd(), name));
        } catch (error) {
          // noop
        }
      }

      if (!Plugin && module) {
        const esModule = module as { __esModule: boolean; default: unknown };
        // eslint-disable-next-line no-underscore-dangle
        if (esModule.__esModule) {
          Plugin = esModule.default as BasePlugin;
        } else {
          Plugin = module as BasePlugin;
        }
      }

      if (Plugin) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return new Plugin({ baseCompilationStats, headCompilationStats, config });
      }
      throw new Error(`Cannot find plugin "${name}"`);
    })
    .filter((plugin) => plugin);
};

export default plugins;
