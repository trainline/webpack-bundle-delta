/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
const percentageChange = (oldValue: number | null, newValue: number | null): number => {
  if (oldValue === null || newValue === null) {
    return null;
  }
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
};

export default percentageChange;
