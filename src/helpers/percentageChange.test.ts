/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import percentageChange from './percentageChange';

describe('percentageChange', () => {
  it('calculates the percentage change', () => {
    expect(percentageChange(100, 80)).toBe(-20);
  });

  it('returns null when first number is null', () => {
    expect(percentageChange(null, 134674)).toBe(null);
  });

  it('returns null when second number is null', () => {
    expect(percentageChange(653190, null)).toBe(null);
  });
});
