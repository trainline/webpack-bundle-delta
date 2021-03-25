/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { Stats } from '../types';

/**
 * Options for MergeCompilationStatsWebpackPlugin
 *
 * @interface MergeCompilationStatsWebpackPluginOptions
 */
interface MergeCompilationStatsWebpackPluginOptions {
  /**
   * Folder path of the compilation stats to be merged together
   *
   * @type {string}
   * @memberof MergeCompilationStatsWebpackPluginOptions
   */
  assetsPath: string;

  /**
   * The names of the files to read and merge together
   *
   * @type {string[]}
   * @memberof MergeCompilationStatsWebpackPluginOptions
   */
  inputFiles: string[];

  /**
   * The output file name (will save to the `assetsPath` folder)
   *
   * @type {string}
   * @memberof MergeCompilationStatsWebpackPluginOptions
   */
  filename: string;
}

export default class MergeCompilationStatsWebpackPlugin {
  private options: MergeCompilationStatsWebpackPluginOptions;

  constructor(options: MergeCompilationStatsWebpackPluginOptions) {
    this.options = options;
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler: webpack.Compiler): void {
    const { assetsPath, inputFiles, filename } = this.options;

    compiler.hooks.done.tap('Merge Compiled Stats Plugin', () => {
      const allStats: Stats = webpack.version.startsWith('4.')
        ? {
            _showErrors: false,
            _showWarnings: false,
            errors: [],
            warnings: [],
            children: [],
          }
        : {};
      inputFiles.forEach((file) => {
        const filePath = join(assetsPath, file);
        if (existsSync(filePath)) {
          const stats = JSON.parse(readFileSync(filePath, 'utf8'));
          // eslint-disable-next-line no-underscore-dangle
          allStats._showErrors = stats._showErrors;
          // eslint-disable-next-line no-underscore-dangle
          allStats._showWarnings = stats._showWarnings;
          if (stats.errors) {
            allStats.errors.push(...stats.errors);
          }
          if (stats.warnings) {
            allStats.warnings.push(...stats.warnings);
          }
          allStats.children.push(stats);
        }
      });

      writeFileSync(join(assetsPath, filename), JSON.stringify(allStats, null, 2));
    });
  }
}
