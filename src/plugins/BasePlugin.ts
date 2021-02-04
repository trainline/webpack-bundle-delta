/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import { ExtractedStats } from '../helpers/extractStats';

export interface BasePluginOptions {
  baseCompilationStats: ExtractedStats;
  headCompilationStats: ExtractedStats;
  config: unknown;
}

/* eslint-disable class-methods-use-this */
export default abstract class BasePlugin<T extends BasePluginOptions = BasePluginOptions> {
  protected options: T;

  constructor(options: T) {
    this.options = options;
  }

  warningMessages(): string[] | Promise<string[]> {
    return null;
  }

  errorMessages(): string[] | Promise<string[]> {
    return null;
  }

  summaryOutput(): string | Promise<string> {
    return null;
  }

  abstract dangerOutput(): string | Promise<string>;

  abstract cliOutput(): string | Promise<string>;
}
