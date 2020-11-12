/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import { BasePluginConfig, defaultBasePluginConfig } from '../../config/PluginConfig';

export interface SignificanceThreshold {
  /**
   * Stat size difference in bytes
   * Number > 0
   *
   * @type {number}
   * @memberof SignificanceThreshold
   */
  sizeDiffBytes?: number;
  /**
   * Stat size difference as a percentage
   * Number > 0
   * example: 15 means 15%
   *
   * @type {number}
   * @memberof SignificanceThreshold
   */
  sizeDiffPercent?: number;
  /**
   * Gzip size difference in bytes
   * Number > 0
   *
   * @type {number}
   * @memberof SignificanceThreshold
   */
  gzSizeDiffBytes?: number;
  /**
   * Gzip size difference as a percentage
   * Number > 0
   * example: 15 means 15%
   *
   * @type {number}
   * @memberof SignificanceThreshold
   */
  gzSizeDiffPercent?: number;
  /**
   * Brotli size difference in bytes
   * Number > 0
   *
   * @type {number}
   * @memberof SignificanceThreshold
   */
  brSizeDiffBytes?: number;
  /**
   * Brotli size difference as a percentage
   * Number > 0
   * example: 15 means 15%
   *
   * @type {number}
   * @memberof SignificanceThreshold
   */
  brSizeDiffPercent?: number;
}

/**
 * An array of budget configurations
 *
 * @export
 * @interface Budget
 * @extends {Array<BudgetConfig>}
 */
export type Budget = Array<BudgetConfig>;

/**
 * Budget configuration
 *
 * At least 1 size option is required for budget comparison
 *
 * If the budget is exceeded:
 * - In CLI: error message will be outputted and exit code > 0
 * - In DangerJS: error message will be reported
 *
 * @export
 * @interface BudgetConfig
 */
export interface BudgetConfig {
  /**
   * Chunk name to compute against.
   *
   * String is either the chunk name or a regular expression string
   *
   * @type {string}
   * @memberof BudgetConfig
   * @example
   * "App.mjs"
   * "chunk-group-(.+).js"
   */
  chunkName: string;
  /**
   * Stat size budget
   *
   * Value in format of "<number><measurement>"
   *
   * @type {string}
   * @memberof BudgetConfig
   * @example
   * "150KB"
   * "1.52MB"
   */
  size?: string;
  /**
   * Gzip size budget
   *
   * Value in format of "<number><measurement>"
   *
   * @type {string}
   * @memberof BudgetConfig
   * @example
   * "150KB"
   * "1.52MB"
   */
  gzSize?: string;
  /**
   * Brotli size budget
   *
   * Value in format of "<number><measurement>"
   *
   * @type {string}
   * @memberof BudgetConfig
   * @example
   * "150KB"
   * "1.52MB"
   */
  brSize?: string;
  /**
   * Warning threshold as a percentage value (0 to 100)
   *
   * When specified and computed to be a warning (and not over specified size):
   * - in CLI: warning message will be produced, but exit code will remain 0
   * - in DangerJS: warning message will be reported
   *
   * @type {number}
   * @memberof BudgetConfig
   * @example
   * // 10 percent would be
   * 10
   * // 86 percent would be
   * 86
   */
  warnPercentage?: number;
}

export interface SizeChangesConfig extends BasePluginConfig {
  significance: SignificanceThreshold;
  budget?: Budget;
  hideMinorChanges?: boolean;
}

export const defaultSizeChangesConfig: SizeChangesConfig = {
  ...defaultBasePluginConfig,
  significance: {
    sizeDiffBytes: 1000,
    sizeDiffPercent: 5,
    gzSizeDiffPercent: 5,
    brSizeDiffPercent: 5,
  },
  budget: null,
  hideMinorChanges: false,
};
