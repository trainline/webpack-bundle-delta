/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import percentageChange from '../../helpers/percentageChange';
import { SignificanceThreshold, Budget } from './config';
import { ChunkNamesExtensionsToSize } from '../../helpers/mapChunkNamesExtensionsToSize';
import significantFields from './significantFields';
import computeBudget from './budget';
import { SizeChange } from './SizeChange';
import { SupportedExtensions } from '../../helpers/constants';

export interface CreateDeltaOptions {
  baseChunkSizes: ChunkNamesExtensionsToSize;
  headChunkSizes: ChunkNamesExtensionsToSize;
  significance: SignificanceThreshold;
  budget: Budget;
}

interface ExtendEntryDetailsParameters {
  entry: SizeChange;
  significance: SignificanceThreshold;
  budget: Budget;
}

const extendEntryDetails = ({
  entry,
  significance,
  budget,
}: ExtendEntryDetailsParameters): SizeChange => {
  return {
    ...entry,
    significantFields: significantFields(entry, significance),
    budget: computeBudget(entry, budget),
  };
};

const createDelta = ({
  baseChunkSizes,
  headChunkSizes,
  significance,
  budget,
}: CreateDeltaOptions): SizeChange[] => {
  const delta: SizeChange[] = [];
  const newEntries: SizeChange[] = [];
  const removedEntries: SizeChange[] = [];

  Object.entries(baseChunkSizes).forEach(([name, data]) => {
    Object.entries(data).forEach(([extension, { size, gzSize, brSize }]) => {
      let entry: SizeChange = {
        file: `${name}.${extension}`,
        prevSize: size,
        prevGzSize: gzSize,
        prevBrSize: brSize,
        currentSize: null,
        currentGzSize: null,
        currentBrSize: null,
        sizeDiff: -100,
        gzSizeDiff: -100,
        brSizeDiff: -100,
        significantFields: [],
      };
      if (
        typeof headChunkSizes[name] !== 'undefined' &&
        typeof headChunkSizes[name][extension as SupportedExtensions] !== 'undefined'
      ) {
        // chunk in both base and head
        const current = headChunkSizes[name][extension as SupportedExtensions];
        const currentSize = current.size;
        const sizeDiff = percentageChange(entry.prevSize, currentSize);
        const gzSizeDiff = percentageChange(entry.prevGzSize, current.gzSize);
        const brSizeDiff = percentageChange(entry.prevBrSize, current.brSize);
        entry = {
          ...entry,
          currentSize: current.size,
          currentGzSize: current.gzSize,
          currentBrSize: current.brSize,
          sizeDiff,
          gzSizeDiff,
          brSizeDiff,
        };
      }
      removedEntries.push(extendEntryDetails({ entry, significance, budget }));
    });
  });

  Object.entries(headChunkSizes).forEach(([name, data]) => {
    Object.entries(data).forEach(([extension, { size, gzSize, brSize }]) => {
      if (
        typeof baseChunkSizes[name] === 'undefined' ||
        typeof baseChunkSizes[name][extension as SupportedExtensions] === 'undefined'
      ) {
        const entry: SizeChange = {
          file: `${name}.${extension}`,
          prevSize: null,
          prevGzSize: null,
          prevBrSize: null,
          currentSize: size,
          currentGzSize: gzSize,
          currentBrSize: brSize,
          sizeDiff: 100,
          gzSizeDiff: 100,
          brSizeDiff: 100,
          significantFields: [],
        };
        newEntries.push(extendEntryDetails({ entry, significance, budget }));
      }
    });
  });

  const entriesBySizeDiff = []
    .concat(newEntries, delta, removedEntries)
    .sort((a: SizeChange, b: SizeChange) => {
      if (Math.abs(a.sizeDiff) > Math.abs(b.sizeDiff)) {
        return -1;
      }
      if (Math.abs(a.sizeDiff) < Math.abs(b.sizeDiff)) {
        return 1;
      }
      if (a.file < b.file) {
        return -1;
      }
      return 1;
    }) as SizeChange[];

  return entriesBySizeDiff;
};

export default createDelta;
