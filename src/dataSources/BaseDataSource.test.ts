/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import BaseDataSource from './BaseDataSource';

describe('BaseDataSource', () => {
  describe('constructor()', () => {
    it('throws an exception', () => {
      expect(() => new BaseDataSource()).toThrowError();
    });
  });

  describe('getCompilationStats()', () => {
    it('throws an exception', () => {
      class ExtendedDataSource extends BaseDataSource {}
      const extendedDataSource = new ExtendedDataSource();

      expect(extendedDataSource.getCompilationStats).toThrowError();
    });
  });
});
