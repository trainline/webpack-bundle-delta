/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import createDelta from './createDelta';
import { SizeChange, BudgetResult, BudgetResultType, SignificantField } from './SizeChange';
import { ChunkNamesExtensionsToSize } from '../../helpers/mapChunkNamesExtensionsToSize';
import { defaultSizeChangesConfig } from './config';

const baseChunkSizes: ChunkNamesExtensionsToSize = {
  sgpTrainTimesPage: {
    css: {
      brSize: 37028,
      gzSize: 45562,
      size: 296997,
    },
    js: {
      brSize: 134674,
      gzSize: 174867,
      size: 653190,
    },
    mjs: {
      brSize: 104674,
      gzSize: 144867,
      size: 603190,
    },
  },
};

const headChunkSizes: ChunkNamesExtensionsToSize = {
  sgpTrainTimesPage: {
    css: {
      brSize: 36028,
      gzSize: 42562,
      size: 286997,
    },
    js: {
      brSize: 34674,
      gzSize: 74867,
      size: 553190,
    },
    mjs: {
      brSize: 104674,
      gzSize: 144867,
      size: 603190,
    },
  },
};

describe('createDelta', () => {
  it('returns -100 delta when chunk is in base but not in head', () => {
    const negativeDelta: SizeChange = {
      currentSize: null,
      currentGzSize: null,
      currentBrSize: null,
      prevSize: expect.any(Number),
      prevGzSize: expect.any(Number),
      prevBrSize: expect.any(Number),
      sizeDiff: -100,
      gzSizeDiff: -100,
      brSizeDiff: -100,
      file: expect.any(String),
      significantFields: [
        SignificantField.sizeDiffBytes,
        SignificantField.sizeDiffPercent,
        SignificantField.gzSizeDiffPercent,
        SignificantField.brSizeDiffPercent,
      ],
    };

    expect(
      createDelta({
        baseChunkSizes,
        headChunkSizes: {},
        significance: defaultSizeChangesConfig.significance,
        budget: defaultSizeChangesConfig.budget,
      })
    ).toEqual([
      expect.objectContaining(negativeDelta),
      expect.objectContaining(negativeDelta),
      expect.objectContaining(negativeDelta),
    ]);
  });

  it('returns +100 delta when chunk is not in base but in head', () => {
    const positiveDelta: SizeChange = {
      currentSize: expect.any(Number),
      currentGzSize: expect.any(Number),
      currentBrSize: expect.any(Number),
      prevSize: null,
      prevGzSize: null,
      prevBrSize: null,
      sizeDiff: 100,
      gzSizeDiff: 100,
      brSizeDiff: 100,
      file: expect.any(String),
      significantFields: [
        SignificantField.sizeDiffBytes,
        SignificantField.sizeDiffPercent,
        SignificantField.gzSizeDiffPercent,
        SignificantField.brSizeDiffPercent,
      ],
    };

    expect(
      createDelta({
        baseChunkSizes: {},
        headChunkSizes,
        significance: defaultSizeChangesConfig.significance,
        budget: defaultSizeChangesConfig.budget,
      })
    ).toEqual([
      expect.objectContaining(positiveDelta),
      expect.objectContaining(positiveDelta),
      expect.objectContaining(positiveDelta),
    ]);
  });

  it('returns delta when chunk is in both base and head', () => {
    expect(
      createDelta({
        baseChunkSizes,
        headChunkSizes,
        significance: defaultSizeChangesConfig.significance,
        budget: defaultSizeChangesConfig.budget,
      })
    ).toMatchSnapshot();
  });

  it('orders largest changes first', () => {
    const base = {
      sgpTrainTimesPage: {
        css: {
          brSize: 5,
          gzSize: 7,
          size: 2,
        },
        js: {
          brSize: 1,
          gzSize: 2,
          size: 10,
        },
        mjs: {
          brSize: 3,
          gzSize: 4,
          size: 5,
        },
      },
    };
    const head = {
      sgpTrainTimesPage: {
        css: {
          brSize: 5,
          gzSize: 7,
          size: 2,
        },
        js: {
          brSize: 1,
          gzSize: 2,
          size: 15,
        },
        mjs: {
          brSize: 3,
          gzSize: 4,
          size: 4,
        },
      },
    };

    expect(
      createDelta({
        baseChunkSizes: base,
        headChunkSizes: head,
        significance: defaultSizeChangesConfig.significance,
        budget: defaultSizeChangesConfig.budget,
      })
    ).toEqual([
      expect.objectContaining({ file: 'sgpTrainTimesPage.js' }),
      expect.objectContaining({ file: 'sgpTrainTimesPage.mjs' }),
      expect.objectContaining({ file: 'sgpTrainTimesPage.css' }),
    ]);
  });

  it('orders alphabetically when diff value is same', () => {
    const baseSize = {
      brSize: 1,
      gzSize: 1,
      size: 1,
    };
    const base = {
      sgpTrainTimesPage: {
        css: baseSize,
        js: baseSize,
        mjs: baseSize,
      },
      euTrainTimesPage: {
        css: baseSize,
        js: baseSize,
        mjs: baseSize,
      },
    };

    expect(
      createDelta({
        baseChunkSizes: base,
        headChunkSizes: base,
        significance: defaultSizeChangesConfig.significance,
        budget: defaultSizeChangesConfig.budget,
      })
    ).toEqual([
      expect.objectContaining({ file: 'euTrainTimesPage.css' }),
      expect.objectContaining({ file: 'euTrainTimesPage.js' }),
      expect.objectContaining({ file: 'euTrainTimesPage.mjs' }),
      expect.objectContaining({ file: 'sgpTrainTimesPage.css' }),
      expect.objectContaining({ file: 'sgpTrainTimesPage.js' }),
      expect.objectContaining({ file: 'sgpTrainTimesPage.mjs' }),
    ]);
  });

  it('includes budget details', () => {
    const chunkName = 'sgpTrainTimesPage.js';
    const budgetConfig = { chunkName, size: '600KB' };
    const data = createDelta({
      baseChunkSizes,
      headChunkSizes,
      significance: defaultSizeChangesConfig.significance,
      budget: [budgetConfig],
    });
    const budgetData = data.find((d) => d.file === chunkName);

    expect(budgetData.budget).toEqual<BudgetResult>({
      amount: 90.04,
      matched: { chunkName: 'sgpTrainTimesPage.js', size: '600KB' },
      type: BudgetResultType.size,
    });
  });
});
