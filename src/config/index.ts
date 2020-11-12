/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { cosmiconfig } from 'cosmiconfig';
import allPluginsConfig from './allPlugins';
import {
  BasePluginConfig,
  defaultBasePluginConfig,
  PluginConfig,
  UserDefinedConfig,
} from './PluginConfig';

const moduleName = 'webpackBundleDelta';

const getUserConfig = async (): Promise<UserDefinedConfig> => {
  const searchedFor = await cosmiconfig(moduleName).search();
  return {
    ...(searchedFor && !searchedFor.isEmpty ? searchedFor.config : { filepath: '' }),
  };
};

// we don't want to override is `extends: null` for example
const useInternalDefaults = (userConfig: UserDefinedConfig) =>
  !Object.keys(userConfig).includes('extends');

const applyGlobals = (
  globals: BasePluginConfig,
  plugins: PluginConfig[],
  globalsOverrides = false
) =>
  (plugins || []).map((plugin) => {
    if (typeof plugin.config === 'object') {
      if (globalsOverrides) {
        // eslint-disable-next-line no-param-reassign
        plugin.config = {
          ...plugin.config,
          ...globals,
        };
      } else {
        // eslint-disable-next-line no-param-reassign
        plugin.config = {
          ...globals,
          ...plugin.config,
        };
      }
    } else if (typeof plugin.config === 'boolean' && plugin.config) {
      // eslint-disable-next-line no-param-reassign
      plugin.config = { ...defaultBasePluginConfig, ...globals };
    }

    return plugin;
  });

const mergePlugins = (
  basePlugins: PluginConfig[],
  extendingPlugins: PluginConfig[]
): PluginConfig[] => {
  const pluginMap = [basePlugins, extendingPlugins].reduce((mergedPlugins, plugins) => {
    plugins?.forEach(({ name, config }) => {
      let mergedConfig = mergedPlugins[name];
      if (typeof mergedConfig === 'object' && typeof config === 'object') {
        mergedConfig = { ...(mergedPlugins[name] as Record<string, unknown>), ...config };
      } else if (typeof config === 'object') {
        mergedConfig = { ...defaultBasePluginConfig, ...config };
      } else if (!config) {
        mergedConfig = false;
      } else {
        mergedConfig = defaultBasePluginConfig;
      }
      // eslint-disable-next-line no-param-reassign
      mergedPlugins[name] = mergedConfig;
    });
    return mergedPlugins;
  }, {} as { [pluginName: string]: unknown });

  return Object.entries(pluginMap).map(([name, config]) => ({ name, config } as PluginConfig));
};

const extendConfig = async (extendsPath: string): Promise<UserDefinedConfig> => {
  const [path, section] = extendsPath.split(':');
  let baseConfig: UserDefinedConfig = {};
  // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
  let extendingConfig: UserDefinedConfig = require(path);
  if (section) {
    extendingConfig = (extendingConfig as { [key: string]: UserDefinedConfig })[section];
  }
  if (!extendingConfig) {
    throw new Error(
      `Unable to find section "${section}" in config "${path}": is it a named export (i.e. module.exports = { ${section}: someConfig };)?`
    );
  }
  if (extendingConfig.extends) {
    baseConfig = await extendConfig(extendingConfig.extends);
  } else if (useInternalDefaults(extendingConfig) && !extendingConfig.plugins?.length) {
    baseConfig.plugins = applyGlobals(extendingConfig.globals, allPluginsConfig, true);
  }

  if (extendingConfig.globals) {
    baseConfig.plugins = applyGlobals(extendingConfig.globals, baseConfig.plugins, true);
  }

  return {
    extends: extendsPath,
    plugins: mergePlugins(
      applyGlobals(baseConfig.globals, baseConfig.plugins),
      applyGlobals(extendingConfig.globals, extendingConfig.plugins)
    ),
  };
};

const createConfig = async (): Promise<UserDefinedConfig> => {
  const userConfig = await getUserConfig();
  let baseConfig: UserDefinedConfig = {};

  if (userConfig.extends) {
    baseConfig = await extendConfig(userConfig.extends);
  } else if (useInternalDefaults(userConfig)) {
    baseConfig = {
      globals: defaultBasePluginConfig,
      plugins: applyGlobals(userConfig.globals, allPluginsConfig, true),
    };
  }

  return {
    ...userConfig,
    plugins: mergePlugins(
      applyGlobals(baseConfig.globals, baseConfig.plugins),
      applyGlobals(userConfig.globals, userConfig.plugins)
    ),
  };
};

export default createConfig;
