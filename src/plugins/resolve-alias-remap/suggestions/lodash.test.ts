/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import webpack from 'webpack';
import lodashSuggestion from './lodash';
import { aliasEntryFn } from '../AliasRemap';

const aliasEntryFn = lodashSuggestion.aliasEntry as aliasEntryFn;
const defaultWebpackStats = {
  _showErrors: false,
  _showWarnings: false,
  errors: [],
  warnings: [],
} as webpack.Stats.ToJsonOutput;

const lodashModule = {
  name: './node_modules/lodash/index.js',
} as webpack.Stats.FnModules;

describe('ResolveAliasRemap Lodash Suggestion - aliasEntry', () => {
  const lodashOmitBy = {
    name: './node_modules/lodash.omitby/index.js',
  } as webpack.Stats.FnModules;

  it('returns "" when lodash is not part of the bundle', () => {
    expect(aliasEntryFn(lodashOmitBy, defaultWebpackStats)).toBe('');
  });

  it('returns expected for lodash omit by', () => {
    expect(aliasEntryFn(lodashOmitBy, { ...defaultWebpackStats, modules: [lodashModule] })).toBe(
      '"lodash.omitby": "lodash/omitBy"'
    );
  });
});
