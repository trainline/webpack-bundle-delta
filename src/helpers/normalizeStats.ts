/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import {
  NormalizedStats,
  NormalizedStats4,
  NormalizedStats5,
  Stats,
  Stats4,
  Stats5,
} from '../types';

const isVersion4Stats = (stats: Stats) => {
  if (stats?.version?.startsWith('5.')) {
    return false;
  }

  return typeof (stats as Stats5).assets?.[0]?.type === 'undefined';
};

const normalizeStats = (compilationStats: Stats | Stats[]): NormalizedStats => {
  // parallel-webpack output
  if (Array.isArray(compilationStats)) {
    const singleStats = compilationStats[0];
    if (isVersion4Stats(singleStats)) {
      return {
        majorVersion: 4,
        stats: compilationStats as Stats4[],
        original: compilationStats as unknown,
      } as NormalizedStats4;
    }

    return {
      majorVersion: 5,
      stats: compilationStats as Stats5[],
      original: compilationStats as unknown,
    } as NormalizedStats5;
  }

  if (!compilationStats.assets && compilationStats.children && compilationStats.children.length) {
    const singleStats = compilationStats.children[0];
    if (isVersion4Stats(singleStats)) {
      return {
        majorVersion: 4,
        stats: compilationStats.children as Stats4[],
        original: compilationStats as unknown,
      } as NormalizedStats4;
    }

    return {
      majorVersion: 5,
      stats: compilationStats.children as Stats5[],
      original: compilationStats as unknown,
    } as NormalizedStats5;
  }

  if (isVersion4Stats(compilationStats)) {
    return {
      majorVersion: 4,
      stats: [compilationStats] as Stats4[],
      original: compilationStats as unknown,
    } as NormalizedStats4;
  }

  return {
    majorVersion: 5,
    stats: [compilationStats] as Stats5[],
    original: compilationStats as unknown,
  } as NormalizedStats5;
};

export default normalizeStats;
