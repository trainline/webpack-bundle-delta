/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { SignificantField, SizeChange } from './SizeChange';
import { SignificanceThreshold, defaultSizeChangesConfig } from './config';

export class InvalidThresholdValueError extends Error {}

const validateThreshold = (thresholdKey: SignificantField, thresholdValue?: number) => {
  if (typeof thresholdValue === 'undefined' || thresholdValue === null) {
    return false;
  }
  if (typeof thresholdValue !== 'number' || thresholdValue < 0) {
    throw new InvalidThresholdValueError(
      `${thresholdKey} expected to be a number greater than or equal to 0, but received "${thresholdValue}"`
    );
  }

  return true;
};

const significantFieldsBytes = (previous: number, current: number, thresholdValue: number) =>
  (previous === null && current !== null) ||
  (current === null && previous !== null) ||
  Math.abs((current || 0) - (previous || 0)) >= thresholdValue;

const significantFields = (
  data: SizeChange,
  threshold: SignificanceThreshold = defaultSizeChangesConfig.significance
): SignificantField[] => {
  const {
    sizeDiffBytes,
    sizeDiffPercent,
    gzSizeDiffBytes,
    gzSizeDiffPercent,
    brSizeDiffBytes,
    brSizeDiffPercent,
  } = threshold;

  const result: SignificantField[] = [];

  if (
    validateThreshold(SignificantField.sizeDiffBytes, sizeDiffBytes) &&
    significantFieldsBytes(data.prevSize, data.currentSize, sizeDiffBytes)
  ) {
    result.push(SignificantField.sizeDiffBytes);
  }

  if (
    validateThreshold(SignificantField.sizeDiffPercent, sizeDiffPercent) &&
    Math.abs(data.sizeDiff) >= sizeDiffPercent
  ) {
    result.push(SignificantField.sizeDiffPercent);
  }

  if (
    validateThreshold(SignificantField.gzSizeDiffBytes, gzSizeDiffBytes) &&
    significantFieldsBytes(data.prevGzSize, data.currentGzSize, gzSizeDiffBytes)
  ) {
    result.push(SignificantField.gzSizeDiffBytes);
  }

  if (
    validateThreshold(SignificantField.gzSizeDiffPercent, gzSizeDiffPercent) &&
    Math.abs(data.gzSizeDiff) >= gzSizeDiffPercent
  ) {
    result.push(SignificantField.gzSizeDiffPercent);
  }

  if (
    validateThreshold(SignificantField.brSizeDiffBytes, brSizeDiffBytes) &&
    significantFieldsBytes(data.prevBrSize, data.currentBrSize, brSizeDiffBytes)
  ) {
    result.push(SignificantField.brSizeDiffBytes);
  }

  if (
    validateThreshold(SignificantField.brSizeDiffPercent, brSizeDiffPercent) &&
    Math.abs(data.brSizeDiff) >= brSizeDiffPercent
  ) {
    result.push(SignificantField.brSizeDiffPercent);
  }

  return result;
};

export default significantFields;
