/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { BasePluginConfig, defaultBasePluginConfig } from '../../config/PluginConfig';
import { AliasRemap } from './AliasRemap';
import lodashSuggestion from './suggestions/lodash';

/**
 * Resolve alias remap configuration
 *
 * @export
 * @interface ResolveAliasRemapConfig
 */
export interface ResolveAliasRemapConfig extends BasePluginConfig {
  /**
   * Keep default remap
   *
   * By default, when configurations are specified, they'll override the default values
   * Specifying this flag ensures the default remap is kept whilst the ones specified are also used
   *
   * @type {boolean}
   * @memberof ResolveAliasRemapConfig
   */
  keepDefaultRemap: boolean;
  /**
   * An array of remap logic used to determine suggestions
   *
   * @type {AliasRemap[]}
   * @memberof ResolveAliasRemapConfig
   */
  remap: AliasRemap[];
}

export const defaultResolveAliasRemapConfig: ResolveAliasRemapConfig = {
  ...defaultBasePluginConfig,
  keepDefaultRemap: false,
  remap: [lodashSuggestion],
};
