/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import * as lodash from 'lodash';
import { aliasEntryFn, AliasRemap } from '../AliasRemap';

// this can have the danger of pulling in methods that it should
// but as we are simply matching included lodash modules from webpack
// it is safe to assume when matched, it is a valid lodash function
const lodashMap = Object.entries(lodash)
  .filter(([, method]) => typeof method === 'function')
  .reduce((map, [name]) => {
    map.set(name.toLowerCase(), name);
    return map;
  }, new Map<string, string>());

const searchFor = 'lodash\\.([^/]+)';

const lodashSuggestion: AliasRemap = {
  searchFor,
  aliasEntry: ((module, stats) => {
    const hasFullLodash = stats.modules?.some(({ name }) => name.includes('/lodash/'));
    if (!hasFullLodash) {
      // no point suggesting to use full lodash if it doesn't make use of it
      return '';
    }

    const searchResult = new RegExp(searchFor).exec(module.name);
    const searchingMethod = searchResult[1];
    const lodashModule = lodashMap.get(searchingMethod);
    if (lodashModule) {
      return `"lodash.${searchingMethod}": "lodash/${lodashModule}"`;
    }
    return '';
  }) as aliasEntryFn,
};

export default lodashSuggestion;
