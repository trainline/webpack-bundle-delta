/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import webpack4 from 'webpack4';
import lodashSuggestion from './lodash';
import { aliasEntryFn } from '../AliasRemap';
import { Stats4 } from '../../../helpers/constants';

const aliasEntryFn = lodashSuggestion.aliasEntry as aliasEntryFn;
const defaultWebpackStats = {
  _showErrors: false,
  _showWarnings: false,
  errors: [],
  warnings: [],
} as Stats4;

const lodashModule = {
  name: './node_modules/lodash/index.js',
} as webpack4.Stats.FnModules;

describe('ResolveAliasRemap Lodash Suggestion - aliasEntry', () => {
  const lodashOmitBy = {
    name: './node_modules/lodash.omitby/index.js',
  } as webpack4.Stats.FnModules;

  it('returns "" when lodash is not part of the bundle', () => {
    expect(aliasEntryFn(lodashOmitBy, defaultWebpackStats)).toBe('');
  });

  it('returns expected for lodash omit by', () => {
    expect(aliasEntryFn(lodashOmitBy, { ...defaultWebpackStats, modules: [lodashModule] })).toBe(
      '"lodash.omitby": "lodash/omitBy"'
    );
  });
});
