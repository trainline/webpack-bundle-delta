/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import mapChunkNamesWithModules from './mapChunkNamesWithModules';
import compilationStats from '../../test/fixtures/head-compilation-stats.json';
import { Stats4 } from './constants';

const stats = (compilationStats as unknown) as Stats4;

describe('mapChunkNamesWithModules', () => {
  it('returns null when assets are not specified in webpack stats', () => {
    expect(
      mapChunkNamesWithModules({
        errors: [],
        warnings: [],
        _showErrors: false,
        _showWarnings: false,
        modules: stats.modules,
      })
    ).toBeNull();
  });

  it('returns null when assets is empty in webpack stats', () => {
    expect(
      mapChunkNamesWithModules({
        errors: [],
        warnings: [],
        _showErrors: false,
        _showWarnings: false,
        assets: [],
        modules: stats.modules,
      })
    ).toBeNull();
  });

  it('returns null when modules are empty specified in webpack stats', () => {
    expect(
      mapChunkNamesWithModules({
        errors: [],
        warnings: [],
        modules: [],
        _showErrors: false,
        _showWarnings: false,
        assets: stats.assets,
      })
    ).toBeNull();
  });

  it('returns null when modules is empty in webpack stats', () => {
    expect(
      mapChunkNamesWithModules({
        errors: [],
        warnings: [],
        _showErrors: false,
        _showWarnings: false,
        assets: stats.assets,
        modules: [],
      })
    ).toBeNull();
  });

  it('builds the dependency tree', () => {
    expect(mapChunkNamesWithModules(stats)).toMatchSnapshot();
  });
});
