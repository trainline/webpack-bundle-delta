/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

export interface BasePluginConfig {
  chunkFilename: string;
  showExisting: boolean;
}

export interface PluginConfig<T extends BasePluginConfig = BasePluginConfig> {
  name: string;
  config: boolean | T;
}

export interface UserDefinedConfig {
  filepath?: string;
  extends?: string;
  globals?: BasePluginConfig;
  plugins?: PluginConfig[];
}

export const defaultBasePluginConfig: BasePluginConfig = {
  chunkFilename: '[id].[ext]',
  showExisting: false,
};
