/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import bytes from 'bytes';
import { ChunkNamesToModules } from '../../helpers/mapChunkNamesWithModules';
import { DuplicationDetectionConfig } from './config';

export interface ModulePaths {
  path: string;
  existing: boolean;
}

export interface ModuleDuplication {
  nodeModule: string;
  paths: ModulePaths[];
}

export interface ChunkModuleDuplication {
  [chunkName: string]: ModuleDuplication[];
}

const findDuplicateModules = (
  config: DuplicationDetectionConfig,
  chunkModules: ChunkNamesToModules,
  baseDuplicates: ChunkModuleDuplication = null
): ChunkModuleDuplication => {
  if (!chunkModules) {
    return {};
  }
  const minSizeBytes = config ? bytes.parse(config.minSize) : 0;

  return Object.entries(chunkModules).reduce((result, [chunkName, modules]) => {
    const nodeModulesCount = modules.reduce((moduleResult, module) => {
      const nodeModuleMatch = /(.+)\/node_modules\/([^/]+)\/([^/]+)?/.exec(module.file);
      if (nodeModuleMatch) {
        const [, pathToNodeModule, nodeModuleName, nodeModuleScopedName] = nodeModuleMatch;
        const moduleName = `${nodeModuleName}${
          nodeModuleName.startsWith('@') ? `/${nodeModuleScopedName}` : ''
        }`;
        const modulePath = `${pathToNodeModule}/node_modules/${moduleName}`;
        const trimmedModulePath = modulePath.substr('./node_modules/'.length);
        const moduleSize = modules
          .filter(({ file }) => file.startsWith(modulePath))
          .reduce((totalSize, { size }) => totalSize + size, 0);
        const modulePaths = moduleResult[moduleName] || [];

        if (
          !modulePaths.includes(trimmedModulePath) &&
          !config?.ignore?.includes(moduleName) &&
          !config?.ignore?.includes(trimmedModulePath) &&
          moduleSize >= minSizeBytes
        ) {
          modulePaths.push(trimmedModulePath);
        }
        // eslint-disable-next-line no-param-reassign
        moduleResult[moduleName] = modulePaths;
      }
      return moduleResult;
    }, {} as { [module: string]: string[] });

    const filteredNodeModulesCount = Object.entries(nodeModulesCount)
      .filter(([, paths]) => paths.length > 1)
      .map(
        ([nodeModule, paths]) =>
          ({
            nodeModule,
            paths: paths.map((path) => ({
              path,
              existing: !!(
                baseDuplicates &&
                baseDuplicates[chunkName]
                  ?.find(({ nodeModule: baseNodeModule }) => baseNodeModule === nodeModule)
                  ?.paths.find((p) => p.path === path)
              ),
            })),
          } as ModuleDuplication)
      );

    if (filteredNodeModulesCount.length) {
      // eslint-disable-next-line no-param-reassign
      result[chunkName] = filteredNodeModulesCount;
    }
    return result;
  }, {} as ChunkModuleDuplication);
};

const duplicationDetection = (
  config: DuplicationDetectionConfig,
  baseChunkModules: ChunkNamesToModules,
  headChunkModules: ChunkNamesToModules
): ChunkModuleDuplication => {
  const baseDuplicates = findDuplicateModules(config, baseChunkModules);
  const headDuplicates = findDuplicateModules(config, headChunkModules, baseDuplicates);

  return headDuplicates;
};

export default duplicationDetection;
