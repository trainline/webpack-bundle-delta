/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import bytes from 'bytes';
import BasePlugin, { BasePluginOptions } from '../BasePlugin';
import { SizeChangesConfig } from './config';
import createDelta from './createDelta';
import mapChunkNamesExtensionsToSize from '../../helpers/mapChunkNamesExtensionsToSize';
import { BudgetResultType, SizeChange } from './SizeChange';
import displayTable, { TableType } from './table';

export interface SizeChangesPluginOptions extends BasePluginOptions {
  config: SizeChangesConfig;
}

const budgetMessage = (sizeChange: SizeChange) => {
  const {
    file,
    currentSize,
    currentGzSize,
    currentBrSize,
    budget: { amount, matched, type },
  } = sizeChange;
  let sizeAmount = currentSize;
  let sizeMatch = matched.size;
  let sizeType = 'Actual';
  if (type === BudgetResultType.gzSize) {
    sizeAmount = currentGzSize;
    sizeMatch = matched.gzSize;
    sizeType = 'Gzip';
  } else if (type === BudgetResultType.brSize) {
    sizeAmount = currentBrSize;
    sizeMatch = matched.brSize;
    sizeType = 'Brotli';
  }
  return `${file} is using ${amount}% of budget (${bytes(sizeAmount)} of ${sizeMatch} ${sizeType})`;
};

export default class SizeChangesPlugin extends BasePlugin<SizeChangesPluginOptions> {
  private sizeChanges: SizeChange[];

  constructor(options: SizeChangesPluginOptions) {
    super(options);

    const baseChunkSizes = mapChunkNamesExtensionsToSize(
      options.baseCompilationStats,
      options.config.chunkFilename
    );
    const headChunkSizes = mapChunkNamesExtensionsToSize(
      options.headCompilationStats,
      options.config.chunkFilename
    );

    this.sizeChanges = createDelta({
      baseChunkSizes,
      headChunkSizes,
      significance: options.config.significance,
      budget: options.config.budget,
    });
  }

  warningMessages(): string[] {
    return this.sizeChanges
      .filter(
        (d) =>
          d.budget &&
          d.budget.matched &&
          d.budget.matched.warnPercentage >= d.budget.amount &&
          d.budget.amount < 100
      )
      .map(budgetMessage);
  }

  errorMessages(): string[] {
    return this.sizeChanges
      .filter((d) => d.budget && d.budget.matched && d.budget.amount >= 100)
      .map(budgetMessage);
  }

  summaryOutput(): string {
    const significantChanges = this.sizeChanges.filter((d) => d.significantFields?.length);
    const insignificantChanges = this.sizeChanges.filter((d) => !d.significantFields?.length);
    const summaryText = `${significantChanges.length} file${
      significantChanges.length !== 1 ? 's' : ''
    } changed significantly, ${insignificantChanges.length} file${
      insignificantChanges.length !== 1 ? 's' : ''
    } had little to no change`;

    return summaryText;
  }

  dangerOutput(): string {
    const significantChanges = this.sizeChanges.filter((d) => d.significantFields?.length);
    const insignificantChanges = this.sizeChanges.filter((d) => !d.significantFields?.length);
    const significantTable = significantChanges.length
      ? displayTable(significantChanges, TableType.html)
      : 'No significant changes';
    const insignificantTable = insignificantChanges.length
      ? displayTable(insignificantChanges, TableType.html)
      : 'No minor changes';
    const insignificantText = !this.options.config.hideMinorChanges
      ? `

<details>
  <summary>Minor changes (click to expand)</summary>

${insignificantTable}
</details>`
      : '';

    return `## Size changes\n\n${significantTable}${insignificantText}`;
  }

  cliOutput(): string {
    const significantChanges = this.sizeChanges.filter((d) => d.significantFields?.length);
    const insignificantChanges = this.sizeChanges.filter((d) => !d.significantFields?.length);
    const significantTable = significantChanges.length
      ? displayTable(significantChanges, TableType.markdown)
      : 'No significant changes';
    const insignificantTable = insignificantChanges.length
      ? displayTable(insignificantChanges, TableType.markdown)
      : 'No minor changes';
    const insignificantText = !this.options.config.hideMinorChanges
      ? `\n\n### Minor changes\n\n${insignificantTable}`
      : '';

    return `## Size changes\n\n### Significant changes\n\n${significantTable}${insignificantText}`;
  }
}
