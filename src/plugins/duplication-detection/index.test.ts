/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import webpack4 from 'webpack4';
import DuplicationDetectionPlugin from './index';
import baseCompilationStats from '../../../test/fixtures/base-compilation-stats.json';
import headCompilationStats from '../../../test/fixtures/head-compilation-stats.json';
import { defaultDuplicationDetectionConfig } from './config';

const baseStats = (baseCompilationStats as unknown) as webpack4.Stats.ToJsonOutput;
const headStats = (headCompilationStats as unknown) as webpack4.Stats.ToJsonOutput;

const slimmedBaseStats: webpack4.Stats.ToJsonOutput = {
  ...baseStats.children[0],
  assets: baseStats.children[0].assets.filter((asset) =>
    asset.name.startsWith('sgpTrainTimesPage')
  ),
};

const slimmedHeadBaseStats: webpack4.Stats.ToJsonOutput = {
  ...headStats.children[0],
  assets: headStats.children[0].assets.filter(
    (asset) => asset.name.startsWith('sgpTrainTimesPage') || asset.name.startsWith('sgpStationPage')
  ),
};

describe('DuplicationDetectionPlugin', () => {
  let duplicationDetection: DuplicationDetectionPlugin;

  describe('only new duplications', () => {
    beforeEach(() => {
      duplicationDetection = new DuplicationDetectionPlugin({
        baseCompilationStats: slimmedBaseStats,
        headCompilationStats: slimmedHeadBaseStats,
        config: {
          ...defaultDuplicationDetectionConfig,
          showExisting: false,
        },
      });
    });

    it('returns summary', () => {
      expect(duplicationDetection.summaryOutput()).toBe('2 duplicate modules added across 1 file');
    });

    it('returns danger output', () => {
      expect(duplicationDetection.dangerOutput()).toMatchSnapshot();
    });

    it('returns cli output', () => {
      expect(duplicationDetection.cliOutput()).toMatchSnapshot();
    });
  });

  describe('existing duplications', () => {
    beforeEach(() => {
      duplicationDetection = new DuplicationDetectionPlugin({
        baseCompilationStats: slimmedBaseStats,
        headCompilationStats: slimmedHeadBaseStats,
        config: {
          ...defaultDuplicationDetectionConfig,
          showExisting: true,
        },
      });
    });

    it('returns summary', () => {
      expect(duplicationDetection.summaryOutput()).toBe(
        '4 duplicate modules detected across 2 files'
      );
    });

    it('returns danger output', () => {
      expect(duplicationDetection.dangerOutput()).toMatchSnapshot();
    });

    it('returns cli output', () => {
      expect(duplicationDetection.cliOutput()).toMatchSnapshot();
    });
  });
});
