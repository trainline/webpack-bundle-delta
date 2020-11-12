/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import bytes from 'bytes';
import mapChunkNamesWithModules from '../../helpers/mapChunkNamesWithModules';
import BasePlugin, { BasePluginOptions } from '../BasePlugin';
import changes, { ChunkModulesChanges } from './changes';

const NODE_MODULES_PATH = './node_modules/';
export const NO_CHANGES = 'No changes';

export default class TraceChangesPlugin extends BasePlugin {
  private changes: ChunkModulesChanges;

  constructor(options: BasePluginOptions) {
    super(options);

    const baseChunkNamesWithModules = mapChunkNamesWithModules(options.baseCompilationStats);
    const headChunkNamesWithModules = mapChunkNamesWithModules(options.headCompilationStats);

    this.changes = changes(baseChunkNamesWithModules, headChunkNamesWithModules);
  }

  output(): string {
    const trace = Object.entries(this.changes)
      .map(([chunkName, modules]) => {
        const chunkChanges = modules
          .map(
            ({
              file,
              currentSize,
              prevSize,
              diff,
              diffPercent,
              currentModuleCount,
              moduleCountDiff,
            }) => {
              let details = `${bytes(diff)} / ${diffPercent}%`;
              if (!prevSize && currentSize) {
                details = 'ADDED';
              }
              if (prevSize && !currentSize) {
                details = `REMOVED ${bytes(prevSize)}`;
              }
              let trimmedFile = file;
              if (trimmedFile.startsWith(NODE_MODULES_PATH)) {
                trimmedFile = trimmedFile.substr(NODE_MODULES_PATH.length);
              }
              if (currentModuleCount) {
                trimmedFile += ` + ${currentModuleCount} module${
                  currentModuleCount !== 1 ? 's' : ''
                }`;
              }
              if (moduleCountDiff !== 0) {
                details += `, ${moduleCountDiff > 0 ? '+' : ''}${moduleCountDiff} module${
                  moduleCountDiff !== 1 ? 's' : ''
                }`;
              }

              return `- ${trimmedFile}: ${bytes(currentSize)} (${details})`;
            }
          )
          .join('\n');
        return `${chunkName}\n\n${chunkChanges}`;
      })
      .join('\n\n');

    return `## Trace changes\n\n${trace || 'No changes found'}`;
  }

  dangerOutput(): string {
    return this.output().replace(/- (.+):/g, '- `$1`:');
  }

  cliOutput(): string {
    return this.output();
  }
}
