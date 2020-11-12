/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { BudgetConfig } from './config';

export interface SizeChange {
  file: string;
  prevSize?: number;
  prevGzSize?: number;
  prevBrSize?: number;
  currentSize?: number;
  currentGzSize?: number;
  currentBrSize?: number;
  sizeDiff?: number;
  gzSizeDiff?: number;
  brSizeDiff?: number;
  significantFields: SignificantField[];
  budget?: BudgetResult;
}

export enum BudgetResultType {
  'size' = 'size',
  'gzSize' = 'gzSize',
  'brSize' = 'brSize',
}

export interface BudgetResult {
  amount: number;
  type: BudgetResultType;
  matched: BudgetConfig;
}

export enum SignificantField {
  sizeDiffBytes = 'sizeDiffBytes',
  sizeDiffPercent = 'sizeDiffPercent',
  gzSizeDiffBytes = 'gzSizeDiffBytes',
  gzSizeDiffPercent = 'gzSizeDiffPercent',
  brSizeDiffBytes = 'brSizeDiffBytes',
  brSizeDiffPercent = 'brSizeDiffPercent',
}
