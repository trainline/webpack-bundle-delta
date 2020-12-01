/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import webpack4 from 'webpack4';
import SizeChangesPlugin from './index';
import baseCompilationStats from '../../../test/fixtures/base-compilation-stats.json';
import headCompilationStats from '../../../test/fixtures/head-compilation-stats.json';
import { Budget, defaultSizeChangesConfig } from './config';
import { SizeChange } from './SizeChange';
import { TableType } from './table';

jest.mock('./table', () => {
  const actualTable = jest.requireActual('./table');
  return {
    __esModule: true,
    ...actualTable,
    default: (_data: SizeChange[], tableType: TableType) =>
      tableType === TableType.html ? 'html table' : 'markdown table',
  };
});

const baseStats = (baseCompilationStats as unknown) as webpack4.Stats.ToJsonOutput;
const headStats = (headCompilationStats as unknown) as webpack4.Stats.ToJsonOutput;

describe('SizeChangesPlugin', () => {
  let sizeChanges: SizeChangesPlugin;

  describe('default configuration', () => {
    beforeEach(() => {
      sizeChanges = new SizeChangesPlugin({
        baseCompilationStats: baseStats,
        headCompilationStats: headStats,
        config: defaultSizeChangesConfig,
      });
    });

    it('returns summary', () => {
      expect(sizeChanges.summaryOutput()).toBe(
        '3 files changed significantly, 144 files had little to no change'
      );
    });

    it('returns danger output', () => {
      expect(sizeChanges.dangerOutput()).toBe(
        `
## Size changes

html table

<details>
  <summary>Minor changes (click to expand)</summary>

html table
</details>
    `.trim()
      );
    });

    it('returns cli output', () => {
      expect(sizeChanges.cliOutput()).toBe(
        '## Size changes\n\n### Significant changes\n\nmarkdown table\n\n### Minor changes\n\nmarkdown table'
      );
    });
  });

  describe('no changes', () => {
    beforeEach(() => {
      sizeChanges = new SizeChangesPlugin({
        baseCompilationStats: baseStats,
        headCompilationStats: baseStats,
        config: defaultSizeChangesConfig,
      });
    });

    it('returns summary', () => {
      expect(sizeChanges.summaryOutput()).toBe(
        '0 files changed significantly, 147 files had little to no change'
      );
    });

    it('returns danger output', () => {
      expect(sizeChanges.dangerOutput()).toBe(
        `
## Size changes

No significant changes

<details>
  <summary>Minor changes (click to expand)</summary>

html table
</details>
    `.trim()
      );
    });

    it('returns cli output', () => {
      expect(sizeChanges.cliOutput()).toBe(
        '## Size changes\n\n### Significant changes\n\nNo significant changes\n\n### Minor changes\n\nmarkdown table'
      );
    });
  });

  describe('config.hideMinorChanges', () => {
    beforeEach(() => {
      sizeChanges = new SizeChangesPlugin({
        baseCompilationStats: baseStats,
        headCompilationStats: headStats,
        config: { ...defaultSizeChangesConfig, hideMinorChanges: true },
      });
    });

    it('does not include minor changes in danger output', () => {
      expect(sizeChanges.dangerOutput()).not.toMatch('Minor changes');
    });

    it('does not include minor changes in cli output', () => {
      expect(sizeChanges.cliOutput()).not.toMatch('Minor changes');
    });
  });

  describe('config.budget', () => {
    const budget: Budget = [
      // size budget
      { chunkName: 'sgpTrainTimesPage.css', size: '350KB', warnPercentage: 99 }, // clear
      { chunkName: 'sgpTrainTimesPage.js', size: '720KB', warnPercentage: 80 }, // warn
      { chunkName: 'sgpTrainTimesPage.mjs', size: '625KB', warnPercentage: 80 }, // error
      // gzip budget
      { chunkName: 'trainTimesPageV2.css', gzSize: '38KB', warnPercentage: 80 }, // warn
      { chunkName: 'trainTimesPageV2.js', gzSize: '150KB', warnPercentage: 80 }, // error
      { chunkName: 'sgpTrainTimesPage.mjs', gzSize: '200KB', warnPercentage: 80 }, // clear
      // brotli budget
      { chunkName: 'vendors.js', brSize: '100KB', warnPercentage: 80 }, // error
      { chunkName: 'vendors.mjs', brSize: '100KB', warnPercentage: 99 }, // clear
    ];

    beforeEach(() => {
      sizeChanges = new SizeChangesPlugin({
        baseCompilationStats: baseStats,
        headCompilationStats: headStats,
        config: { ...defaultSizeChangesConfig, hideMinorChanges: true, budget },
      });
    });

    it('has warning messages', () => {
      expect(sizeChanges.warningMessages()).toEqual([
        'sgpTrainTimesPage.css is using 82.01% of budget (287.03KB of 350KB Actual)',
        'vendors.mjs is using 88.85% of budget (88.85KB of 100KB Brotli)',
      ]);
    });

    it('has error messages', () => {
      expect(sizeChanges.errorMessages()).toEqual([
        'trainTimesPageV2.js is using 102.57% of budget (153.85KB of 150KB Gzip)',
        'sgpTrainTimesPage.mjs is using 101.67% of budget (635.44KB of 625KB Actual)',
        'vendors.js is using 100.59% of budget (100.59KB of 100KB Brotli)',
      ]);
    });
  });
});
