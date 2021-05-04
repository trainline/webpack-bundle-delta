/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import axios, { AxiosResponse } from 'axios';
import BaseDataSource, { DataSource, DataSourceBranchType } from '../BaseDataSource';
import { Stats } from '../../types';

export interface TeamCityDataSourceConfiguration {
  serverUrl: string;
  username: string;
  password: string;
  buildType: string;
  fileName?: string;
}

export default class TeamCityDataSource extends BaseDataSource implements DataSource {
  readonly options: TeamCityDataSourceConfiguration;

  constructor(options: TeamCityDataSourceConfiguration) {
    super();

    this.options = options;
  }

  async getCompilationStats(_branchType: DataSourceBranchType, sha: string): Promise<Stats> {
    const {
      serverUrl,
      username,
      password,
      buildType,
      fileName = 'compilation-stats.json',
    } = this.options;
    const { data } = await axios.get<unknown, AxiosResponse<Stats>>(
      `${serverUrl}/app/rest/builds/buildType:${buildType},branch:default:any,revision:${sha}/artifacts/content/${fileName}`,
      {
        auth: {
          username,
          password,
        },
      }
    );

    this.validateCompilationStats(data);

    return data;
  }
}
