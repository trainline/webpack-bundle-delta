/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import fs from 'fs';
import path from 'path';

import LocalFileDataSource, { LocalFileDataSourceConfiguration } from '.';

import baseCompilationStats from '../../../test/fixtures/base-compilation-stats.json';
import headCompilationStats from '../../../test/fixtures/head-compilation-stats.json';
import { Stats } from '../../helpers/constants';
import { ExtractedStats } from '../../helpers/extractStats';
import { DataSourceBranchType } from '../BaseDataSource';

jest.mock('fs');

describe('LocalFileDataSource', () => {
  let dataSource: LocalFileDataSource;
  const options: LocalFileDataSourceConfiguration = {
    baseFilePath: 'base/file.json',
    headFilePath: 'head/file.json',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws error when constructing and baseFilePath is not found', () => {
    (fs.existsSync as jest.Mock).mockImplementation(
      (filePath: string) => !filePath.includes('base')
    );

    expect(() => new LocalFileDataSource(options)).toThrowError(
      `options.baseFilePath "${options.baseFilePath}" was not found, please check path`
    );
  });

  it('successfully instantiates when basePath not found but is found relative to cwd', () => {
    (fs.existsSync as jest.Mock).mockImplementation(
      (filePath: string) =>
        filePath.includes('head') || (filePath.includes('base') && path.isAbsolute(filePath))
    );

    expect(() => new LocalFileDataSource(options)).not.toThrow();
  });

  it('throws error when constructing and headFilePath is not found', () => {
    (fs.existsSync as jest.Mock).mockImplementation(
      (filePath: string) => !filePath.includes('head')
    );

    expect(() => new LocalFileDataSource(options)).toThrowError(
      `options.headFilePath "${options.headFilePath}" was not found, please check path`
    );
  });

  describe('getCompilationStats()', () => {
    const baseStats = (baseCompilationStats as unknown) as Stats;
    const headStats = (headCompilationStats as unknown) as Stats;

    describe('happy path', () => {
      beforeEach(() => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.promises as unknown) = {
          readFile: jest.fn((filePath: string) => {
            if (filePath === options.baseFilePath) {
              return Promise.resolve(JSON.stringify(baseStats));
            }
            if (filePath === options.headFilePath) {
              return Promise.resolve(JSON.stringify(headStats));
            }
            return Promise.reject(new Error('should not reach here'));
          }),
        };
        dataSource = new LocalFileDataSource(options);
      });

      it('returns the base compilation stats when specified', () => {
        return expect(
          dataSource.getCompilationStats(DataSourceBranchType.base)
        ).resolves.toMatchObject<Partial<ExtractedStats>>({
          original: baseStats,
        });
      });

      it('returns the head compilation stats when specified', () => {
        return expect(
          dataSource.getCompilationStats(DataSourceBranchType.head)
        ).resolves.toMatchObject<Partial<ExtractedStats>>({
          original: headStats,
        });
      });
    });

    describe('validation', () => {
      it('throws error when assets are not defined', () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.promises as unknown) = {
          readFile: jest.fn(() => {
            return Promise.resolve(
              JSON.stringify({
                ...baseStats.children[0],
                assets: null,
              })
            );
          }),
        };
        dataSource = new LocalFileDataSource(options);
        return expect(dataSource.getCompilationStats(DataSourceBranchType.base)).rejects.toThrow();
      });

      it('throws error when modules are not defined', () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.promises as unknown) = {
          readFile: jest.fn(() => {
            return Promise.resolve(
              JSON.stringify({
                ...baseStats.children[0],
                modules: null,
              })
            );
          }),
        };
        dataSource = new LocalFileDataSource(options);
        return expect(dataSource.getCompilationStats(DataSourceBranchType.base)).rejects.toThrow();
      });
    });
  });
});
