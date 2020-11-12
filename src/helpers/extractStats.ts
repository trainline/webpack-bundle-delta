/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';

const extractStats = (
  compilationStats: webpack.Stats.ToJsonOutput | webpack.Stats.ToJsonOutput[]
): webpack.Stats.ToJsonOutput[] => {
  if (Array.isArray(compilationStats)) {
    return compilationStats as webpack.Stats.ToJsonOutput[];
  }

  if (!compilationStats.assets && compilationStats.children && compilationStats.children.length) {
    return compilationStats.children;
  }

  return [compilationStats];
};

export default extractStats;
