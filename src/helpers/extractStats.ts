/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import webpack4 from 'webpack4';

const extractStats = (
  compilationStats: webpack4.Stats.ToJsonOutput | webpack4.Stats.ToJsonOutput[]
): webpack4.Stats.ToJsonOutput[] => {
  if (Array.isArray(compilationStats)) {
    return compilationStats as webpack4.Stats.ToJsonOutput[];
  }

  if (!compilationStats.assets && compilationStats.children && compilationStats.children.length) {
    return compilationStats.children;
  }

  return [compilationStats];
};

export default extractStats;
