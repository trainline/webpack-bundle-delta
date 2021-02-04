/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import extractStats from '../../helpers/extractStats';
import resolveAliasRemap, { ResolveAliasRemapSuggestion } from './resolveAliasRemap';

const extractedStats = extractStats({
  modules: [
    {
      name: './node_modules/lodash/_getNative.js',
    },
    {
      name: './node_modules/lodash.omitby/index.js',
    },
  ],
});

describe('resolveAliasRemap', () => {
  it('returns the expected alias remap suggestion for lodash.omitby (string alias entry)', () => {
    expect(
      resolveAliasRemap(extractedStats, [
        { searchFor: 'lodash\\.([^/]+)', aliasEntry: 'lodash.$1: lodash/$1' },
      ])
    ).toEqual<ResolveAliasRemapSuggestion[]>([
      {
        name: './node_modules/lodash.omitby/index.js',
        suggestion: 'lodash.omitby: lodash/omitby',
      },
    ]);
  });

  it('returns the expected alias remap suggestion for lodash.omitby (function alias entry)', () => {
    expect(
      resolveAliasRemap(extractedStats, [
        { searchFor: 'lodash\\.([^/]+)', aliasEntry: () => 'some-remap' },
      ])
    ).toEqual<ResolveAliasRemapSuggestion[]>([
      {
        name: './node_modules/lodash.omitby/index.js',
        suggestion: 'some-remap',
      },
    ]);
  });

  it('does not return suggestion when aliasEntry string is empty', () => {
    expect(
      resolveAliasRemap(extractedStats, [{ searchFor: 'lodash\\.([^/]+)', aliasEntry: '' }])
    ).toEqual([]);
  });

  it('does not return suggestion when aliasEntry function returns empty', () => {
    expect(
      resolveAliasRemap(extractedStats, [{ searchFor: 'lodash\\.([^/]+)', aliasEntry: () => '' }])
    ).toEqual([]);
  });
});
