/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import webpack4 from 'webpack4';
import RestrictPlugin from './index';
import baseCompilationStats from '../../../test/fixtures/base-compilation-stats.json';
import headCompilationStats from '../../../test/fixtures/head-compilation-stats.json';
import { RestrictConfig } from './config';
import { defaultBasePluginConfig } from '../../config/PluginConfig';

const baseStats = (baseCompilationStats as unknown) as webpack4.Stats.ToJsonOutput;
const headStats = (headCompilationStats as unknown) as webpack4.Stats.ToJsonOutput;
const restrictConfig: RestrictConfig = {
  showExisting: false,
  chunkFilename: defaultBasePluginConfig.chunkFilename,
  restrictions: [
    {
      search: './src/private/common/components/section-error-fallback/index.jsx',
      responseType: 'warn',
      message: 'no section error fallback component',
    },
    { search: 'lodash.omitby', responseType: 'error', message: 'no lodash.omitby' },
  ],
};

describe('RestrictPlugin', () => {
  let restrictPlugin: RestrictPlugin;

  describe('only new restrictions', () => {
    beforeEach(() => {
      restrictPlugin = new RestrictPlugin({
        baseCompilationStats: baseStats,
        headCompilationStats: headStats,
        config: {
          ...restrictConfig,
          showExisting: false,
        },
      });
    });

    it('returns summary', () => {
      expect(restrictPlugin.summaryOutput()).toBe('1 restricted file found');
    });

    it('returns errorMessages', () => {
      expect(restrictPlugin.errorMessages()).toEqual([]);
    });

    it('returns warningMessages', () => {
      expect(restrictPlugin.warningMessages()).toEqual([
        './src/private/common/components/section-error-fallback/index.jsx is restricted',
      ]);
    });

    it('returns danger output', () => {
      expect(restrictPlugin.dangerOutput()).toMatchSnapshot();
    });

    it('returns cli output', () => {
      expect(restrictPlugin.cliOutput()).toMatchSnapshot();
    });
  });

  describe('existing restrictions', () => {
    beforeEach(() => {
      restrictPlugin = new RestrictPlugin({
        baseCompilationStats: baseStats,
        headCompilationStats: headStats,
        config: {
          ...restrictConfig,
          showExisting: true,
        },
      });
    });

    it('returns summary', () => {
      expect(restrictPlugin.summaryOutput()).toBe('2 restricted files found');
    });

    it('returns errorMessages', () => {
      expect(restrictPlugin.errorMessages()).toEqual([
        './node_modules/lodash.omitby/index.js is restricted',
      ]);
    });

    it('returns warningMessages', () => {
      expect(restrictPlugin.warningMessages()).toEqual([
        './src/private/common/components/section-error-fallback/index.jsx is restricted',
      ]);
    });

    it('returns danger output', () => {
      expect(restrictPlugin.dangerOutput()).toMatchSnapshot();
    });

    it('returns cli output', () => {
      expect(restrictPlugin.cliOutput()).toMatchSnapshot();
    });
  });
});
