/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import lodashSuggestion from './lodash';
import { aliasEntryFn } from '../AliasRemap';
import { Module, Stats } from '../../../types';

const aliasEntryFn = lodashSuggestion.aliasEntry as aliasEntryFn;
const defaultWebpackStats = {} as Stats;

const lodashModule: Module = {
  name: './node_modules/lodash/index.js',
};

describe('ResolveAliasRemap Lodash Suggestion - aliasEntry', () => {
  const lodashOmitBy: Module = {
    name: './node_modules/lodash.omitby/index.js',
  };

  it('returns "" when lodash is not part of the bundle', () => {
    expect(aliasEntryFn(lodashOmitBy, defaultWebpackStats)).toBe('');
  });

  it('returns expected for lodash omit by', () => {
    expect(
      aliasEntryFn(lodashOmitBy, { ...defaultWebpackStats, modules: [lodashModule] } as Stats)
    ).toBe('"lodash.omitby": "lodash/omitBy"');
  });
});
