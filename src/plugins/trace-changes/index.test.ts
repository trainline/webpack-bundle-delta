/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import TraceChangesPlugin from './index';
import baseCompilationStats from '../../../test/fixtures/base-compilation-stats.json';
import headCompilationStats from '../../../test/fixtures/head-compilation-stats.json';
import { Stats4 } from '../../types';
import normalizeStats from '../../helpers/normalizeStats';

const baseStats = (baseCompilationStats as unknown) as Stats4;
const headStats = (headCompilationStats as unknown) as Stats4;

describe('TraceChangesPlugin', () => {
  let traceChanges: TraceChangesPlugin;

  describe('changes available', () => {
    beforeEach(() => {
      traceChanges = new TraceChangesPlugin({
        baseCompilationStats: normalizeStats(baseStats),
        headCompilationStats: normalizeStats(headStats),
        config: true,
      });
    });

    it('returns summary', () => {
      expect(traceChanges.summaryOutput()).toBe(null);
    });

    it('returns danger output', () => {
      expect(traceChanges.dangerOutput()).toMatchSnapshot();
    });

    it('returns cli output', () => {
      expect(traceChanges.cliOutput()).toMatchSnapshot();
    });
  });

  describe('no changes available', () => {
    beforeEach(() => {
      traceChanges = new TraceChangesPlugin({
        baseCompilationStats: normalizeStats(baseStats),
        headCompilationStats: normalizeStats(baseStats),
        config: true,
      });
    });

    it('returns summary', () => {
      expect(traceChanges.summaryOutput()).toBe(null);
    });

    it('returns danger output', () => {
      expect(traceChanges.dangerOutput()).toMatchSnapshot();
    });

    it('returns cli output', () => {
      expect(traceChanges.cliOutput()).toMatchSnapshot();
    });
  });
});
