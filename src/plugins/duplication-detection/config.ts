/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { BasePluginConfig, defaultBasePluginConfig } from '../../config/PluginConfig';

export interface DuplicationDetectionConfig extends BasePluginConfig {
  /**
   * Minimum size of the module for duplication detection
   *
   * Value in format of "<number><measurement>"
   * If size of the whole module (i.e. sum of all individual files within the module) is less than specified value
   * It will not be counted into the list of duplicates
   *
   * @type {string}
   * @memberof Duplication
   * @example
   * "150KB"
   * "1.52MB"
   */
  minSize: string;
  /**
   * List of modules to ignore
   *
   * Either module name or package sub module path
   * Ignoring sub modules may be necessary if a module is using a different version that isn't compatible with other versions within the application
   * This can occur when the module isn't upgraded to the newer version
   *
   * @type {string[]}
   * @memberof Duplication
   * "lodash"
   * "some-module/node_modules/lodash"
   */
  ignore: string[];
}

export const defaultDuplicationDetectionConfig: DuplicationDetectionConfig = {
  ...defaultBasePluginConfig,
  minSize: '5KB',
  ignore: null,
};
