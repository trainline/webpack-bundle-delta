/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import webpack4 from 'webpack4';

export interface aliasEntryFn {
  (module: webpack4.Stats.FnModules, stats: webpack4.Stats.ToJsonOutput): string;
}

export interface AliasRemap {
  /**
   * What to search for in the given module name
   *
   * The value will be passed to `RegExp` for verification
   *
   * @type {(string | RegExp)}
   * @memberof AliasRemap
   */
  searchFor: string | RegExp;

  /**
   * Suggestion to add to the alias entry in the format of "<module name or path>: <new path>" which would be added directly to webpack config's resolve.alias map
   *
   * When passed as a string, this will work in conjunction with the `searchFor` RegExp which allows for tokens like $1 to be used as part of the suggestion
   * When passed as a function, it will provide the matched module name as the parameter, and expect a string back in a similar format of `'former-alias': 'new-alias'`, or `'former-alias': path.join('some', 'path')`
   * @type {(string | aliasEntryFn}
   * @memberof AliasRemap
   */
  aliasEntry: string | aliasEntryFn;
}
