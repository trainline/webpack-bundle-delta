/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import { AliasRemap } from './AliasRemap';
import { ExtractedStats } from '../../helpers/extractStats';
import { Module, Stats } from '../../types';

export interface ResolveAliasRemapSuggestion {
  name: string;
  suggestion: string;
}

const resolveAliasRemap = (
  extractedStats: ExtractedStats,
  aliasRemap: AliasRemap[]
): ResolveAliasRemapSuggestion[] => {
  return (extractedStats.stats as Stats[]).reduce(
    (result: ResolveAliasRemapSuggestion[], stats) => {
      const remapped = (stats.modules as Module[])
        .map((module) => {
          const remap = aliasRemap.find(({ searchFor }) => new RegExp(searchFor).test(module.name));
          if (remap) {
            const { searchFor, aliasEntry } = remap;
            let suggestion = '';

            if (typeof aliasEntry === 'function') {
              suggestion = aliasEntry(module, stats);
            } else {
              module.name.match(new RegExp(searchFor)).forEach((match, index) => {
                suggestion = aliasEntry.replace(new RegExp(`\\$${index}`, 'g'), match);
              });
            }

            if (suggestion) {
              return {
                name: module.name,
                suggestion,
              } as ResolveAliasRemapSuggestion;
            }
          }
          return null;
        })
        .filter(
          (remap) =>
            !!remap && // remove nulls
            !result.some(
              // remove ones already in the results array, possibly from other compilations
              (prevSuggestion) =>
                prevSuggestion.name === remap.name && prevSuggestion.suggestion === remap.suggestion
            )
        );

      return result.concat(remapped);
    },
    [] as ResolveAliasRemapSuggestion[]
  );
};

export default resolveAliasRemap;
