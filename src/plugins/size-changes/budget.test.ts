/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import budget from './budget';
import { SizeChange, BudgetResult, BudgetResultType } from './SizeChange';
import { BudgetConfig } from './config';

describe('budget', () => {
  const delta: SizeChange = {
    file: 'delta.js',
    currentSize: 3000,
    currentGzSize: 2000,
    currentBrSize: 1000,
    significantFields: [],
  };

  const budgetConfig: BudgetConfig = { chunkName: 'delta.js' };

  it('returns null when budget is null', () => {
    expect(budget(delta, null)).toBeNull();
  });

  it('returns expected budget', () => {
    const config: BudgetConfig = { ...budgetConfig, size: '4000B' };

    expect(budget(delta, [config])).toEqual<BudgetResult>({
      amount: 75,
      matched: config,
      type: BudgetResultType.size,
    });
  });

  it('returns expected gzip budget percentage', () => {
    const config: BudgetConfig = { ...budgetConfig, gzSize: '4000B' };

    expect(budget(delta, [config])).toEqual<BudgetResult>({
      amount: 50,
      matched: config,
      type: BudgetResultType.gzSize,
    });
  });

  it('returns expected brotli budget percentage', () => {
    const config: BudgetConfig = { ...budgetConfig, brSize: '4000B' };

    expect(budget(delta, [config])).toEqual<BudgetResult>({
      amount: 25,
      matched: config,
      type: BudgetResultType.brSize,
    });
  });

  it('returns the highest percentage when comparing multiple budgets', () => {
    const config: BudgetConfig = {
      ...budgetConfig,
      size: '4000B',
      gzSize: '4000B',
      brSize: '4000B',
    };

    expect(budget(delta, [config])).toEqual<BudgetResult>({
      amount: 75,
      matched: config,
      type: BudgetResultType.size,
    });
  });

  it('handles varying bytes format', () => {
    const config: BudgetConfig = {
      ...budgetConfig,
      size: '4KB',
      gzSize: '0.002MB',
      brSize: '1500B',
    };

    expect(budget(delta, [config])).toEqual<BudgetResult>({
      amount: 95.37,
      matched: config,
      type: BudgetResultType.gzSize,
    });
  });
});
