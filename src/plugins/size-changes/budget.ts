/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import bytes from 'bytes';
import { Budget } from './config';
import { SizeChange, BudgetResult, BudgetResultType } from './SizeChange';

const sizeAsPercent = (currentSize: number, budgetSize: string) => {
  if (!currentSize || !budgetSize) {
    return null;
  }
  const parsedBudgetSize = bytes.parse(budgetSize);
  if (!parsedBudgetSize) {
    return null;
  }
  return (currentSize / parsedBudgetSize) * 100;
};

const computeBudget = (delta: SizeChange, budget: Budget): BudgetResult => {
  if (!budget) {
    return null;
  }

  const budgetConfig = budget.find(
    (b) => b.chunkName === delta.file || new RegExp(b.chunkName).test(delta.file)
  );
  if (!budgetConfig) {
    return null;
  }

  const sizeBudget = sizeAsPercent(delta.currentSize, budgetConfig.size);
  const gzSizeBudget = sizeAsPercent(delta.currentGzSize, budgetConfig.gzSize);
  const brSizeBudget = sizeAsPercent(delta.currentBrSize, budgetConfig.brSize);
  let usedBudget: number;
  if (sizeBudget !== null || gzSizeBudget !== null || brSizeBudget !== null) {
    usedBudget = Math.max(sizeBudget, gzSizeBudget, brSizeBudget);
  }
  if (!usedBudget) {
    return null;
  }

  let budgetType: BudgetResultType = BudgetResultType.size;
  if (brSizeBudget === usedBudget) {
    budgetType = BudgetResultType.brSize;
  } else if (gzSizeBudget === usedBudget) {
    budgetType = BudgetResultType.gzSize;
  }

  return {
    amount: +usedBudget.toFixed(2),
    matched: budgetConfig,
    type: budgetType,
  };
};

export default computeBudget;
