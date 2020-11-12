/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import significantFields, { InvalidThresholdValueError } from './significantFields';
import { SignificantField, SizeChange } from './SizeChange';

describe('significantFields', () => {
  const data: SizeChange = {
    file: 'file.mjs',
    prevSize: null,
    prevGzSize: null,
    prevBrSize: null,
    currentSize: null,
    currentGzSize: null,
    currentBrSize: null,
    sizeDiff: null,
    gzSizeDiff: null,
    brSizeDiff: null,
    significantFields: [],
  };

  [
    { threshold: SignificantField.sizeDiffBytes, deltaKey: 'Size' },
    { threshold: SignificantField.gzSizeDiffBytes, deltaKey: 'GzSize' },
    { threshold: SignificantField.brSizeDiffBytes, deltaKey: 'BrSize' },
  ].forEach(({ threshold, deltaKey }) => {
    const prevSizeKey = `prev${deltaKey}`;
    const currentSizeKey = `current${deltaKey}`;

    describe(`threshold.${threshold}`, () => {
      it(`returns [${threshold}] when significance is above threshold and both ${prevSizeKey} and ${currentSizeKey} is present`, () => {
        expect(
          significantFields(
            {
              ...data,
              [prevSizeKey]: 100,
              [currentSizeKey]: 200,
            },
            { [threshold]: 100 }
          )
        ).toEqual<SignificantField[]>([threshold]);
      });

      it(`returns [${threshold}] when significance is above threshold and ${prevSizeKey} is present but ${currentSizeKey} is null`, () => {
        expect(
          significantFields(
            {
              ...data,
              [prevSizeKey]: 100,
              [currentSizeKey]: null,
            },
            { [threshold]: 100 }
          )
        ).toEqual<SignificantField[]>([threshold]);
      });

      it(`returns [${threshold}] when significance is above threshold and ${currentSizeKey} is present but ${prevSizeKey} is null`, () => {
        expect(
          significantFields(
            {
              ...data,
              [prevSizeKey]: null,
              [currentSizeKey]: 100,
            },
            { [threshold]: 100 }
          )
        ).toEqual<SignificantField[]>([threshold]);
      });

      it(`returns empty when significance is below threshold and both ${prevSizeKey} and ${currentSizeKey} is present`, () => {
        expect(
          significantFields(
            {
              ...data,
              [prevSizeKey]: 100,
              [currentSizeKey]: 200,
            },
            { [threshold]: 101 }
          )
        ).toEqual<SignificantField[]>([]);
      });

      it(`returns [${threshold}] when ${prevSizeKey} is present but ${currentSizeKey} is null`, () => {
        expect(
          significantFields(
            {
              ...data,
              [prevSizeKey]: 100,
              [currentSizeKey]: null,
            },
            { [threshold]: 101 }
          )
        ).toEqual<SignificantField[]>([threshold]);
      });

      it(`returns [${threshold}] when ${currentSizeKey} is present but ${prevSizeKey} is null`, () => {
        expect(
          significantFields(
            {
              ...data,
              [prevSizeKey]: null,
              [currentSizeKey]: 100,
            },
            { [threshold]: 101 }
          )
        ).toEqual<SignificantField[]>([threshold]);
      });

      it(`returns empty when ${prevSizeKey} and ${currentSizeKey} is null`, () => {
        expect(
          significantFields(
            {
              ...data,
              [prevSizeKey]: null,
              [currentSizeKey]: null,
            },
            { [threshold]: 101 }
          )
        ).toEqual<SignificantField[]>([]);
      });

      it('throws error when threshold is below 0', () => {
        expect(() => significantFields(data, { [threshold]: -1 })).toThrowError(
          InvalidThresholdValueError
        );
      });

      it('throws error when threshold is not a number', () => {
        expect(() =>
          significantFields(data, { [threshold]: ('nan' as unknown) as number })
        ).toThrowError(InvalidThresholdValueError);
      });
    });
  });

  [
    { threshold: SignificantField.sizeDiffPercent, deltaKey: 'sizeDiff' },
    { threshold: SignificantField.gzSizeDiffPercent, deltaKey: 'gzSizeDiff' },
    { threshold: SignificantField.brSizeDiffPercent, deltaKey: 'brSizeDiff' },
  ].forEach(({ threshold, deltaKey }) => {
    describe(`threshold.${threshold}`, () => {
      it(`returns [${threshold}] when significance is above threshold and ${deltaKey} is present`, () => {
        expect(
          significantFields(
            {
              ...data,
              [deltaKey]: 5,
            },
            { [threshold]: 4 }
          )
        ).toEqual<SignificantField[]>([threshold]);
      });

      it(`returns [${threshold}] when significance is above threshold and ${deltaKey} is present and negative`, () => {
        expect(
          significantFields(
            {
              ...data,
              [deltaKey]: -5,
            },
            { [threshold]: 4 }
          )
        ).toEqual<SignificantField[]>([threshold]);
      });

      it(`returns empty when significance is below threshold and ${deltaKey} is present`, () => {
        expect(
          significantFields(
            {
              ...data,
              [deltaKey]: 5,
            },
            { [threshold]: 6 }
          )
        ).toEqual<SignificantField[]>([]);
      });

      it(`returns empty when significance is below threshold and ${deltaKey} is present and negative`, () => {
        expect(
          significantFields(
            {
              ...data,
              [deltaKey]: -5,
            },
            { [threshold]: 6 }
          )
        ).toEqual<SignificantField[]>([]);
      });

      it(`returns empty when ${deltaKey} is null`, () => {
        expect(significantFields(data, { [threshold]: 6 })).toEqual<SignificantField[]>([]);
      });

      it('throws error when threshold is below 0', () => {
        expect(() => significantFields(data, { [threshold]: -1 })).toThrowError(
          InvalidThresholdValueError
        );
      });

      it('throws error when threshold is not a number', () => {
        expect(() =>
          significantFields(data, { [threshold]: ('nan' as unknown) as number })
        ).toThrowError(InvalidThresholdValueError);
      });
    });
  });
});
