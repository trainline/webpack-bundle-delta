/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import { Stats } from '../helpers/constants';
import extractStats, { ExtractedStats } from '../helpers/extractStats';

export enum DataSourceBranchType {
  base = 'base',
  head = 'head',
}

export interface DataSource {
  getCompilationStats(branchType: DataSourceBranchType, sha: string): Promise<ExtractedStats>;
}

/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
export default class BaseDataSource implements DataSource {
  constructor() {
    if (this.constructor === BaseDataSource) {
      throw new Error("BaseDataSource is an abstract class and can't be instantiated.");
    }
  }

  getCompilationStats(_branchType: DataSourceBranchType, _sha: string): Promise<ExtractedStats> {
    throw new Error(
      'BaseDataSource cannot be used, please use one of the other data sources or extend this class'
    );
  }

  validateCompilationStats(compilationStats: Stats): void {
    const containsRequiredProps = extractStats(compilationStats).stats.some((stats: Stats) => {
      const { assets, modules } = stats;
      return assets?.length && modules?.length;
    });

    if (!containsRequiredProps) {
      throw new Error('Compilation stats do not contain assets and modules properties');
    }
  }
}
/* eslint-enable class-methods-use-this, @typescript-eslint/no-unused-vars */
