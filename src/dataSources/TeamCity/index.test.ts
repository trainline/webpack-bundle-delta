/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import axios from 'axios';

import TeamCityDataSource, { TeamCityDataSourceConfiguration } from '.';
import { DataSourceBranchType } from '../BaseDataSource';

import baseCompilationStats from '../../../test/fixtures/base-compilation-stats.json';
import { Stats4 } from '../../helpers/constants';

jest.mock('axios');

const options: TeamCityDataSourceConfiguration = {
  serverUrl: 'https://teamcity.company.com',
  buildType: 'Test_Build',
  username: 'teamcity-build-user',
  password: 'teamcity-build-password',
};

describe('TeamCityDataSource', () => {
  let dataSource: TeamCityDataSource;

  beforeEach(() => {
    dataSource = new TeamCityDataSource(options);
    (<jest.Mock>axios.get).mockResolvedValue({ data: { chunks: [] } });
  });

  afterEach(() => {
    (<jest.Mock>axios.get).mockClear();
  });

  describe('getCompilationStats()', () => {
    const baseStats = (baseCompilationStats as unknown) as Stats4;

    describe('happy path', () => {
      beforeEach(() => {
        (axios.get as jest.Mock).mockResolvedValue({ data: baseStats });
      });

      it('calls TeamCity with expected URL', async () => {
        const { serverUrl, buildType } = options;
        const sha = 'some-sha';

        await dataSource.getCompilationStats(DataSourceBranchType.base, sha);

        expect(axios.get).toHaveBeenCalledWith(
          `${serverUrl}/app/rest/builds/buildType:${buildType},branch:default:any,revision:${sha}/artifacts/content/compilation-stats.json`,
          expect.anything()
        );
      });

      it('calls TeamCity with correct auth', async () => {
        const { username, password } = options;

        await dataSource.getCompilationStats(DataSourceBranchType.head, 'some-sha');

        expect(axios.get).toHaveBeenCalledWith(expect.anything(), {
          auth: { username, password },
        });
      });

      it('calls TeamCity with specified file name', async () => {
        const localOptions: TeamCityDataSourceConfiguration = {
          ...options,
          fileName: 'other-stats.json',
        };
        const localDataSource = new TeamCityDataSource(localOptions);
        const { serverUrl, buildType, fileName } = localOptions;
        const sha = 'some-sha';

        await localDataSource.getCompilationStats(DataSourceBranchType.base, sha);

        expect(axios.get).toHaveBeenCalledWith(
          `${serverUrl}/app/rest/builds/buildType:${buildType},branch:default:any,revision:${sha}/artifacts/content/${fileName}`,
          expect.anything()
        );
      });

      it('returns back the stats', async () => {
        const data = await dataSource.getCompilationStats(DataSourceBranchType.head, 'some-sha');

        expect(data).toEqual(baseStats);
      });
    });

    describe('validation', () => {
      it('throws error when assets are not defined', () => {
        (axios.get as jest.Mock).mockResolvedValue({
          data: {
            ...baseStats.children[0],
            assets: null,
          },
        });
        return expect(
          dataSource.getCompilationStats(DataSourceBranchType.head, 'some-sha')
        ).rejects.toThrow();
      });

      it('throws error when modules are not defined', () => {
        (axios.get as jest.Mock).mockResolvedValue({
          data: {
            ...baseStats.children[0],
            modules: null,
          },
        });
        return expect(
          dataSource.getCompilationStats(DataSourceBranchType.head, 'some-sha')
        ).rejects.toThrow();
      });
    });
  });
});
