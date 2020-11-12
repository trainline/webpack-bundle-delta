/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import table, { TableType } from './table';
import { BudgetResultType, SignificantField } from './SizeChange';

describe('table', () => {
  it('generates markdown table', () => {
    expect(
      table([
        {
          file: 'stationsIndexPage.mjs',
          prevSize: 555927,
          prevGzSize: 0,
          prevBrSize: null,
          currentSize: 556468,
          currentGzSize: 148789,
          currentBrSize: null,
          sizeDiff: 0.09731493523430235,
          gzSizeDiff: 0.15616901256756666,
          brSizeDiff: null,
          significantFields: [SignificantField.sizeDiffBytes, SignificantField.sizeDiffPercent],
        },
      ])
    ).toMatchSnapshot();
  });

  it('generates html table', () => {
    expect(
      table(
        [
          {
            file: 'stationsIndexPage.mjs',
            prevSize: 555927,
            prevGzSize: 0,
            prevBrSize: null,
            currentSize: 556468,
            currentGzSize: 148789,
            currentBrSize: null,
            sizeDiff: 0.09731493523430235,
            gzSizeDiff: 0.15616901256756666,
            brSizeDiff: null,
            significantFields: [SignificantField.brSizeDiffPercent],
          },
        ],
        TableType.html
      )
    ).toMatchSnapshot();
  });

  describe('budget', () => {
    it('generates markdown table', () => {
      expect(
        table([
          {
            file: 'stationsIndexPage.mjs',
            prevSize: 555927,
            prevGzSize: 0,
            prevBrSize: null,
            currentSize: 556468,
            currentGzSize: 148789,
            currentBrSize: null,
            sizeDiff: 0.09731493523430235,
            gzSizeDiff: 0.15616901256756666,
            brSizeDiff: null,
            significantFields: [SignificantField.gzSizeDiffBytes],
            budget: {
              amount: 70,
              matched: {
                chunkName: 'stationsIndexPage.mjs',
              },
              type: BudgetResultType.gzSize,
            },
          },
        ])
      ).toMatchSnapshot();
    });

    it('generates html table', () => {
      expect(
        table(
          [
            {
              file: 'stationsIndexPage.mjs',
              prevSize: 555927,
              prevGzSize: 0,
              prevBrSize: null,
              currentSize: 556468,
              currentGzSize: 148789,
              currentBrSize: null,
              sizeDiff: 0.09731493523430235,
              gzSizeDiff: 0.15616901256756666,
              brSizeDiff: null,
              significantFields: [
                SignificantField.gzSizeDiffPercent,
                SignificantField.sizeDiffPercent,
              ],
              budget: {
                amount: 75.12,
                matched: {
                  chunkName: 'stationsIndexPage.mjs',
                },
                type: BudgetResultType.brSize,
              },
            },
          ],
          TableType.html
        )
      ).toMatchSnapshot();
    });
  });
});
