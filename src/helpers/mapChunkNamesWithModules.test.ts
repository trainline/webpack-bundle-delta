/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import mapChunkNamesWithModules from './mapChunkNamesWithModules';
import compilationStats from '../../test/fixtures/head-compilation-stats.json';
import { Stats4 } from '../types';
import extractStats from './extractStats';

const stats = (compilationStats as unknown) as Stats4;

describe('mapChunkNamesWithModules', () => {
  it('returns null when assets are not specified in webpack stats', () => {
    const extractedStats = extractStats({
      errors: [],
      warnings: [],
      _showErrors: false,
      _showWarnings: false,
      modules: stats.modules,
    });

    expect(mapChunkNamesWithModules(extractedStats)).toBeNull();
  });

  it('returns null when assets is empty in webpack stats', () => {
    const extractedStats = extractStats({
      errors: [],
      warnings: [],
      _showErrors: false,
      _showWarnings: false,
      assets: [],
      modules: stats.modules,
    });

    expect(mapChunkNamesWithModules(extractedStats)).toBeNull();
  });

  it('returns null when modules are empty specified in webpack stats', () => {
    const extractedStats = extractStats({
      errors: [],
      warnings: [],
      modules: [],
      _showErrors: false,
      _showWarnings: false,
      assets: stats.assets,
    });

    expect(mapChunkNamesWithModules(extractedStats)).toBeNull();
  });

  it('returns null when modules is empty in webpack stats', () => {
    const extractedStats = extractStats({
      errors: [],
      warnings: [],
      _showErrors: false,
      _showWarnings: false,
      assets: stats.assets,
      modules: [],
    });

    expect(mapChunkNamesWithModules(extractedStats)).toBeNull();
  });

  it('builds the dependency tree', () => {
    const extractedStats = extractStats(stats);

    expect(mapChunkNamesWithModules(extractedStats)).toMatchSnapshot();
  });
});
