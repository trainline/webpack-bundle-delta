/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { ChunkNamesToModules, ChunkModule } from '../../helpers/mapChunkNamesWithModules';
import percentageChange from '../../helpers/percentageChange';

export interface ChunkModulesChange {
  file: string;
  prevSize: number;
  currentSize: number;
  diff: number;
  diffPercent: number;
  prevModuleCount: number;
  currentModuleCount: number;
  moduleCountDiff: number;
}

export interface ChunkModulesChanges {
  [chunkName: string]: ChunkModulesChange[];
}

const removedModule = (chunkModule: ChunkModule): ChunkModulesChange => ({
  file: chunkModule.file,
  prevSize: chunkModule.size,
  currentSize: 0,
  diff: -chunkModule.size,
  diffPercent: -100,
  prevModuleCount: chunkModule.moduleCount,
  currentModuleCount: 0,
  moduleCountDiff: chunkModule.moduleCount ? -chunkModule.moduleCount : 0,
});

const addedModule = (chunkModule: ChunkModule): ChunkModulesChange => ({
  file: chunkModule.file,
  prevSize: 0,
  currentSize: chunkModule.size,
  diff: chunkModule.size,
  diffPercent: 100,
  prevModuleCount: 0,
  currentModuleCount: chunkModule.moduleCount,
  moduleCountDiff: chunkModule.moduleCount,
});

const changes = (
  baseChunkModules: ChunkNamesToModules,
  headChunkModules: ChunkNamesToModules
): ChunkModulesChanges => {
  let base = baseChunkModules;
  if (!base) {
    base = {};
  }

  let head = headChunkModules;
  if (!head) {
    head = {};
  }

  const removedChunks = Object.entries(base)
    .filter(([chunkName]) => !head[chunkName])
    .reduce((result, [chunkName, modules]) => {
      // eslint-disable-next-line no-param-reassign
      result[chunkName] = modules.map(removedModule);

      return result;
    }, {} as ChunkModulesChanges);

  const addedChunks = Object.entries(head)
    .filter(([chunkName]) => !base[chunkName])
    .reduce((result, [chunkName, modules]) => {
      // eslint-disable-next-line no-param-reassign
      result[chunkName] = modules.map(addedModule);

      return result;
    }, {} as ChunkModulesChanges);

  const chunkChanges = Object.entries(head)
    .filter(([chunkName]) => typeof base[chunkName] !== 'undefined')
    .reduce((result, [chunkName, modules]) => {
      const previous = base[chunkName];

      const removedModuleChanges = previous
        .filter((pm) => !modules.find((m) => m.file === pm.file))
        .map(removedModule);

      const moduleChanges = modules
        .map((module) => {
          const previousModule = previous.find((pm) => module.file === pm.file);
          if (!previousModule) {
            return addedModule(module);
          }
          if (
            module.size !== previousModule.size ||
            module.moduleCount !== previousModule.moduleCount
          ) {
            return {
              file: module.file,
              prevSize: previousModule.size,
              currentSize: module.size,
              diff: module.size - previousModule.size,
              diffPercent: +percentageChange(previousModule.size, module.size).toFixed(2),
              prevModuleCount: previousModule.moduleCount,
              currentModuleCount: module.moduleCount,
              moduleCountDiff: module.moduleCount - previousModule.moduleCount,
            } as ChunkModulesChange;
          }
          return null;
        })
        .filter((m) => !!m);

      const changedModules = [...removedModuleChanges, ...moduleChanges].sort((a, b) => {
        const aDiff = Math.abs(a.diff);
        const bDiff = Math.abs(b.diff);
        const aPercent = Math.abs(a.diffPercent);
        const bPercent = Math.abs(b.diffPercent);
        const aModuleCountDiff = Math.abs(a.moduleCountDiff);
        const bModuleCountDiff = Math.abs(b.moduleCountDiff);
        if (aDiff > bDiff) {
          return -1;
        }
        if (aDiff < bDiff) {
          return 1;
        }
        if (aPercent > bPercent) {
          return -1;
        }
        if (aPercent < bPercent) {
          return 1;
        }
        if (aModuleCountDiff > bModuleCountDiff) {
          return -1;
        }
        if (aModuleCountDiff < bModuleCountDiff) {
          return 1;
        }
        return 0;
      });
      if (changedModules.length) {
        // eslint-disable-next-line no-param-reassign
        result[chunkName] = changedModules;
      }

      return result;
    }, {} as ChunkModulesChanges);

  return {
    ...addedChunks,
    ...removedChunks,
    ...chunkChanges,
  };
};

export default changes;
