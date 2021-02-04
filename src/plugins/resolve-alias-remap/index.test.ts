/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import ResolveAliasRemapPlugin from './index';
import baseCompilationStats from '../../../test/fixtures/base-compilation-stats.json';
import headCompilationStats from '../../../test/fixtures/head-compilation-stats.json';
import { defaultResolveAliasRemapConfig } from './config';
import { Stats4 } from '../../helpers/constants';
import extractStats from '../../helpers/extractStats';

const extractedBaseStats = extractStats((baseCompilationStats as unknown) as Stats4);
const extractedHeadStats = extractStats((headCompilationStats as unknown) as Stats4);

describe('ResolveAliasRemapPlugin', () => {
  let resolveAliasRemap: ResolveAliasRemapPlugin;

  describe('only new suggestions', () => {
    beforeEach(() => {
      resolveAliasRemap = new ResolveAliasRemapPlugin({
        baseCompilationStats: extractedBaseStats,
        headCompilationStats: extractedHeadStats,
        config: {
          ...defaultResolveAliasRemapConfig,
          showExisting: false,
        },
      });
    });

    it('returns summary', () => {
      expect(resolveAliasRemap.summaryOutput()).toBe(null);
    });

    it('returns danger output', () => {
      expect(resolveAliasRemap.dangerOutput()).toMatchSnapshot();
    });

    it('returns cli output', () => {
      expect(resolveAliasRemap.cliOutput()).toMatchSnapshot();
    });
  });

  describe('existing suggestions', () => {
    beforeEach(() => {
      resolveAliasRemap = new ResolveAliasRemapPlugin({
        baseCompilationStats: extractedBaseStats,
        headCompilationStats: extractedHeadStats,
        config: {
          ...defaultResolveAliasRemapConfig,
          showExisting: true,
        },
      });
    });

    it('returns summary', () => {
      expect(resolveAliasRemap.summaryOutput()).toBe(
        '2 webpack resolve.alias suggestions available'
      );
    });

    it('returns danger output', () => {
      expect(resolveAliasRemap.dangerOutput()).toMatchSnapshot();
    });

    it('returns cli output', () => {
      expect(resolveAliasRemap.cliOutput()).toMatchSnapshot();
    });
  });
});
