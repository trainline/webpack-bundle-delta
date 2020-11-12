/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import BasePlugin, { BasePluginOptions } from '../BasePlugin';
import duplicationDetection, { ChunkModuleDuplication } from './duplicationDetection';
import { DuplicationDetectionConfig } from './config';
import mapChunkNamesWithModules from '../../helpers/mapChunkNamesWithModules';

export interface DuplicationDetectionPluginOptions extends BasePluginOptions {
  config: DuplicationDetectionConfig;
}

export default class DuplicationDetectionPlugin extends BasePlugin<
  DuplicationDetectionPluginOptions
> {
  private duplicates: ChunkModuleDuplication;

  constructor(options: DuplicationDetectionPluginOptions) {
    super(options);

    const baseChunkNamesWithModules = mapChunkNamesWithModules(options.baseCompilationStats);
    const headChunkNamesWithModules = mapChunkNamesWithModules(options.headCompilationStats);

    const duplicates = duplicationDetection(
      options.config,
      baseChunkNamesWithModules,
      headChunkNamesWithModules
    );

    if (!this.options.config?.showExisting) {
      Object.entries(duplicates).forEach(([chunkName, moduleDuplication]) => {
        const modulesWithAddedPaths = moduleDuplication.filter(({ paths }) =>
          paths.some(({ existing }) => !existing)
        );
        if (modulesWithAddedPaths.length) {
          duplicates[chunkName] = modulesWithAddedPaths;
        } else {
          delete duplicates[chunkName];
        }
      });
    }

    this.duplicates = duplicates;
  }

  summaryOutput(): string {
    const {
      config: { showExisting },
    } = this.options;

    let chunkCount = 0;
    const duplicationCount = Object.values(this.duplicates).reduce((count, modules) => {
      const duplicateModulesCount = modules.length;
      if (duplicateModulesCount) {
        chunkCount += 1;
      }
      return count + duplicateModulesCount;
    }, 0);
    if (chunkCount && duplicationCount) {
      return `${duplicationCount} duplicate module${duplicationCount !== 1 ? 's' : ''} ${
        showExisting ? 'detected' : 'added'
      } across ${chunkCount} file${chunkCount !== 1 ? 's' : ''}`;
    }
    return '';
  }

  output(): string {
    const {
      config: { showExisting },
    } = this.options;

    const lines = Object.entries(this.duplicates).map(([chunkName, duplicates]) => {
      const duplicateLines = duplicates.map(({ nodeModule, paths }) => {
        return [`- ${nodeModule}`]
          .concat(
            paths.map(({ path, existing }) => `  - ${path} (${existing ? 'existing' : 'ADDED'})`)
          )
          .join('\n');
      });
      return `${chunkName}\n\n${duplicateLines.join('\n\n')}`;
    });

    const noMessage = showExisting
      ? 'No duplicate dependencies found'
      : 'No duplicate dependencies introduced';

    return `## Duplication detection\n\n${lines.length ? lines.join('\n\n') : noMessage}`;
  }

  dangerOutput(): string {
    return this.output()
      .replace(/- ([^\s]+)/g, '- `$1`')
      .replace(/\((ADDED)\)/g, '(**$1**)');
  }

  cliOutput(): string {
    return this.output();
  }
}
