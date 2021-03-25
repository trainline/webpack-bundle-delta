/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import mapChunkNamesWithModules from './mapChunkNamesWithModules';
import compilationStats from '../../test/fixtures/head-compilation-stats.json';
import { Stats4 } from '../types';
import normalizeStats from './normalizeStats';

const stats = (compilationStats as unknown) as Stats4;

describe('mapChunkNamesWithModules', () => {
  it('returns null when assets are not specified in webpack stats', () => {
    const normalizedStats = normalizeStats({
      errors: [],
      warnings: [],
      _showErrors: false,
      _showWarnings: false,
      modules: stats.modules,
    });

    expect(mapChunkNamesWithModules(normalizedStats)).toBeNull();
  });

  it('returns null when assets is empty in webpack stats', () => {
    const normalizedStats = normalizeStats({
      errors: [],
      warnings: [],
      _showErrors: false,
      _showWarnings: false,
      assets: [],
      modules: stats.modules,
    });

    expect(mapChunkNamesWithModules(normalizedStats)).toBeNull();
  });

  it('returns null when modules are empty specified in webpack stats', () => {
    const normalizedStats = normalizeStats({
      errors: [],
      warnings: [],
      modules: [],
      _showErrors: false,
      _showWarnings: false,
      assets: stats.assets,
    });

    expect(mapChunkNamesWithModules(normalizedStats)).toBeNull();
  });

  it('returns null when modules is empty in webpack stats', () => {
    const normalizedStats = normalizeStats({
      errors: [],
      warnings: [],
      _showErrors: false,
      _showWarnings: false,
      assets: stats.assets,
      modules: [],
    });

    expect(mapChunkNamesWithModules(normalizedStats)).toBeNull();
  });

  it('builds the dependency tree', () => {
    const normalizedStats = normalizeStats(stats);

    expect(mapChunkNamesWithModules(normalizedStats)).toMatchSnapshot();
  });
});
