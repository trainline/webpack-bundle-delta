/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import { BasePluginConfig } from '../../config/PluginConfig';

export interface Restriction {
  /**
   * What to search for in the given module name
   *
   * The value will be passed to `RegExp` for verification
   *
   * @type {(string | RegExp)}
   * @memberof Restriction
   */
  search: string | RegExp;
  /**
   * Action to take
   *
   * @type {('info' | 'warn' | 'error')}
   * @memberof Restriction
   */
  responseType: 'info' | 'warn' | 'error';
  /**
   * Message to display when matched
   *
   * @type {string}
   * @memberof Restriction
   */
  message: string;
}

/**
 * Restrict configuration
 *
 * @export
 * @interface RestrictConfig
 */
export interface RestrictConfig extends BasePluginConfig {
  /**
   * Array of restrictions to be applied
   *
   * @type {Restriction[]}
   * @memberof RestrictConfig
   */
  restrictions: Restriction[];
}

/** default is set to false as we don't want to enable this plugin by default */
export const defaultRestrictConfig: RestrictConfig | boolean = false;
