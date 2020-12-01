/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import webpack4 from 'webpack4';
import fs from 'fs';
import path from 'path';

import BaseDataSource, { DataSource, DataSourceBranchType } from '../BaseDataSource';

export interface LocalFileDataSourceConfiguration {
  baseFilePath: string;
  headFilePath: string;
}

export default class LocalFileDataSource extends BaseDataSource implements DataSource {
  readonly options: LocalFileDataSourceConfiguration;

  constructor(options: LocalFileDataSourceConfiguration) {
    super();

    this.options = options;
    const { baseFilePath, headFilePath } = this.options;

    if (!fs.existsSync(baseFilePath)) {
      const altBaseFilePath = path.normalize(path.join(process.cwd(), baseFilePath));
      if (!fs.existsSync(altBaseFilePath)) {
        throw new Error(`options.baseFilePath "${baseFilePath}" was not found, please check path`);
      }
      this.options.baseFilePath = altBaseFilePath;
    }

    if (!fs.existsSync(headFilePath)) {
      const altHeadFilePath = path.normalize(path.join(process.cwd(), headFilePath));
      if (!fs.existsSync(altHeadFilePath)) {
        throw new Error(`options.headFilePath "${headFilePath}" was not found, please check path`);
      }
      this.options.headFilePath = altHeadFilePath;
    }
  }

  async getCompilationStats(
    branchType: DataSourceBranchType
  ): Promise<webpack4.Stats.ToJsonOutput> {
    let file: string;
    if (branchType === DataSourceBranchType.head) {
      file = await fs.promises.readFile(this.options.headFilePath, 'utf-8');
    } else {
      file = await fs.promises.readFile(this.options.baseFilePath, 'utf-8');
    }
    const data = (JSON.parse(file) as unknown) as webpack4.Stats.ToJsonOutput;

    this.validateCompilationStats(data);

    return data;
  }
}
