/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import table from 'markdown-table';
import bytes from 'bytes';
import chalk from 'chalk';
import stringWidth from 'string-width';
import { SizeChange, BudgetResultType, BudgetResult, SignificantField } from './SizeChange';

export enum TableType {
  markdown,
  html,
}

interface BoldFunction {
  (text: string): string;
}

const boldHtml = (text: string) => `<strong>${text}</strong>`;

const formatChangePercentage = (
  diff: number | null,
  significant = false,
  boldFunction: BoldFunction = chalk.bold
) => {
  if (diff === null) {
    return '-';
  }
  if (diff === 0) {
    return '0%';
  }

  const fixedValue = parseFloat(diff.toFixed(2));
  let result = `${fixedValue > 0 ? '+' : ''}${fixedValue}%`;
  if (significant) {
    result = boldFunction(result);
  }
  return result;
};

const formatBytes = (
  value: number | null,
  includeSign = false,
  significant = false,
  boldFunction: BoldFunction = chalk.bold
) => {
  if (value === null) {
    return '-';
  }
  if (value === 0) {
    return '0B';
  }

  let result = `${includeSign && value > 0 ? '+' : ''}${bytes(value, { decimalPlaces: 2 })}`;
  if (significant) {
    result = boldFunction(result);
  }
  return result;
};

const statSizeInfo = (
  prevSize: number,
  currentSize: number,
  sizeDiff: number,
  isNew: boolean,
  isOld: boolean,
  significantFields: SignificantField[],
  boldFunction: BoldFunction
) => {
  if (isNew) {
    return ' (ADDED)';
  }
  if (isOld) {
    return ' (REMOVED)';
  }
  if (currentSize === prevSize) {
    return '';
  }
  return ` (${formatBytes(
    currentSize - prevSize,
    true,
    significantFields.includes(SignificantField.sizeDiffBytes),
    boldFunction
  )} / ${formatChangePercentage(
    sizeDiff,
    significantFields.includes(SignificantField.sizeDiffPercent),
    boldFunction
  )})`;
};

const gzSizeInfo = (
  prevGzSize: number,
  currentGzSize: number,
  gzSizeDiff: number,
  significantFields: SignificantField[],
  boldFunction: BoldFunction
) => {
  if (currentGzSize === prevGzSize) {
    return '';
  }
  return ` (${formatBytes(
    currentGzSize - prevGzSize,
    true,
    significantFields.includes(SignificantField.gzSizeDiffBytes),
    boldFunction
  )} / ${formatChangePercentage(
    gzSizeDiff,
    significantFields.includes(SignificantField.gzSizeDiffPercent),
    boldFunction
  )})`;
};

const brSizeInfo = (
  prevBrSize: number,
  currentBrSize: number,
  brSizeDiff: number,
  significantFields: SignificantField[],
  boldFunction: BoldFunction
) => {
  if (currentBrSize === prevBrSize) {
    return '';
  }
  return ` (${formatBytes(
    currentBrSize - prevBrSize,
    true,
    significantFields.includes(SignificantField.brSizeDiffBytes),
    boldFunction
  )} / ${formatChangePercentage(
    brSizeDiff,
    significantFields.includes(SignificantField.brSizeDiffPercent),
    boldFunction
  )})`;
};

const formatBudget = (budget: BudgetResult) => {
  if (!budget) {
    return '';
  }
  let budgetType = 'Stat';
  if (budget.type === BudgetResultType.brSize) {
    budgetType = 'Brotli';
  } else if (budget.type === BudgetResultType.gzSize) {
    budgetType = 'Gzip';
  }
  return `${+budget.amount.toFixed(2)}% (${budgetType})`;
};

const markdownTable = (data: SizeChange[], includeBudget: boolean) => {
  const headers = ['File', 'Size', 'Gzip size', 'Brotli size'];
  const alignment = ['l', 'c', 'c', 'c'];
  if (includeBudget) {
    headers.push('Budget');
    alignment.push('c');
  }
  return table(
    [
      headers,
      ...data.map(
        ({
          file,
          prevSize,
          prevGzSize,
          prevBrSize,
          currentSize,
          currentGzSize,
          currentBrSize,
          sizeDiff,
          gzSizeDiff,
          brSizeDiff,
          significantFields,
          budget,
        }) => {
          const isNew = currentSize !== null && prevSize === null;
          const isOld = currentSize === null && prevSize !== null;
          const row = [
            file,
            `${formatBytes(currentSize)}${statSizeInfo(
              prevSize,
              currentSize,
              sizeDiff,
              isNew,
              isOld,
              significantFields,
              chalk.bold
            )}`,
            `${formatBytes(currentGzSize)}${
              currentGzSize && !isNew && !isOld
                ? gzSizeInfo(prevGzSize, currentGzSize, gzSizeDiff, significantFields, chalk.bold)
                : ''
            }`,
            `${formatBytes(currentBrSize)}${
              currentBrSize && !isNew && !isOld
                ? brSizeInfo(prevBrSize, currentBrSize, brSizeDiff, significantFields, chalk.bold)
                : ''
            }`,
          ];
          if (includeBudget) {
            row.push(formatBudget(budget));
          }
          return row;
        }
      ),
    ],
    { align: alignment, stringLength: stringWidth }
  );
};

const htmlTable = (data: SizeChange[], includeBudget: boolean): string => {
  return `<table>
  <thead>
    <th>File</th>
    <th>Size</th>
    <th>Gzip size</th>
    <th>Brotli size</th>${
      includeBudget
        ? `
    <th>Budget</th>`
        : ''
    }
  </thead>
  <tbody>
${data
  .map(
    ({
      file,
      prevSize,
      prevGzSize,
      prevBrSize,
      currentSize,
      currentGzSize,
      currentBrSize,
      sizeDiff,
      gzSizeDiff,
      brSizeDiff,
      significantFields,
      budget,
    }) => {
      const isNew = currentSize !== null && prevSize === null;
      const isOld = currentSize === null && prevSize !== null;

      return `    <tr>
      <td>${file}</td>
      <td>${formatBytes(currentSize)}${statSizeInfo(
        prevSize,
        currentSize,
        sizeDiff,
        isNew,
        isOld,
        significantFields,
        boldHtml
      )}</td>
      <td>${formatBytes(currentGzSize)}${
        currentGzSize && !isNew && !isOld
          ? gzSizeInfo(prevGzSize, currentGzSize, gzSizeDiff, significantFields, boldHtml)
          : ''
      }</td>
      <td>${formatBytes(currentBrSize)}${
        currentBrSize && !isNew && !isOld
          ? brSizeInfo(prevBrSize, currentBrSize, brSizeDiff, significantFields, boldHtml)
          : ''
      }</td>${
        includeBudget
          ? `
      <td>${formatBudget(budget)}</td>`
          : ''
      }
    </tr>`;
    }
  )
  .join('\n')}
  </tbody>
</table>`;
};

const displayTable = (data: SizeChange[], tableType: TableType = TableType.markdown): string => {
  const hasBudget = data.some((d) => d.budget);
  const generatedTable =
    tableType === TableType.markdown ? markdownTable(data, hasBudget) : htmlTable(data, hasBudget);
  return generatedTable;
};

export default displayTable;
