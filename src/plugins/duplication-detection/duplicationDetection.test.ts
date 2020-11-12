/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { defaultDuplicationDetectionConfig } from './config';
import duplicationDetection, { ChunkModuleDuplication } from './duplicationDetection';
import { ChunkNamesToModules } from '../../helpers/mapChunkNamesWithModules';

const baseChunkModules: ChunkNamesToModules = {
  'app.mjs': [
    {
      file: './node_modules/some-module/node_modules/moment/moment.js',
      size: 145211,
      moduleCount: 0,
    },
    {
      file: './node_modules/moment/moment.js',
      size: 124713,
      moduleCount: 0,
    },
  ],
};

const headChunkModules: ChunkNamesToModules = {
  'app.mjs': [
    {
      file: './node_modules/some-module/node_modules/moment/moment.js',
      size: 145211,
      moduleCount: 0,
    },
    {
      file: './node_modules/component-z/node_modules/moment/moment.js',
      size: 145211,
      moduleCount: 0,
    },
    {
      file: './node_modules/moment/moment.js',
      size: 124713,
      moduleCount: 0,
    },
  ],
};

describe('duplicationDetection', () => {
  it('returns null when head chunk modules is null', () => {
    expect(duplicationDetection(defaultDuplicationDetectionConfig, baseChunkModules, null)).toEqual<
      ChunkModuleDuplication
    >({});
  });

  it('returns the expected result', () => {
    expect(duplicationDetection(null, baseChunkModules, headChunkModules)).toEqual<
      ChunkModuleDuplication
    >({
      'app.mjs': [
        {
          nodeModule: 'moment',
          paths: [
            {
              existing: true,
              path: 'some-module/node_modules/moment',
            },
            {
              existing: false,
              path: 'component-z/node_modules/moment',
            },
            {
              existing: true,
              path: 'moment',
            },
          ],
        },
      ],
    });
  });

  it('returns the expected result with all paths existing set to false when baseChunkModules is null', () => {
    expect(duplicationDetection(defaultDuplicationDetectionConfig, null, headChunkModules)).toEqual<
      ChunkModuleDuplication
    >({
      'app.mjs': [
        {
          nodeModule: 'moment',
          paths: [
            expect.objectContaining({ existing: false }),
            expect.objectContaining({ existing: false }),
            expect.objectContaining({ existing: false }),
          ],
        },
      ],
    });
  });

  it('returns path existing as false when base is passed but no existing chunk matching', () => {
    expect(duplicationDetection(defaultDuplicationDetectionConfig, {}, headChunkModules)).toEqual<
      ChunkModuleDuplication
    >({
      'app.mjs': [
        {
          nodeModule: 'moment',
          paths: [
            expect.objectContaining({ existing: false }),
            expect.objectContaining({ existing: false }),
            expect.objectContaining({ existing: false }),
          ],
        },
      ],
    });
  });

  it('returns path existing as false when base is passed with existing chunk but no matching module', () => {
    const base: ChunkNamesToModules = {
      'app.mjs': [
        {
          file: './node_modules/moment/moment.js',
          size: 124713,
          moduleCount: 0,
        },
      ],
    };

    expect(duplicationDetection(defaultDuplicationDetectionConfig, base, headChunkModules)).toEqual<
      ChunkModuleDuplication
    >({
      'app.mjs': [
        {
          nodeModule: 'moment',
          paths: [
            expect.objectContaining({ existing: false }),
            expect.objectContaining({ existing: false }),
            expect.objectContaining({ existing: false }),
          ],
        },
      ],
    });
  });

  it('handles scoped packages', () => {
    const chunkModules: ChunkNamesToModules = {
      'app.mjs': [
        {
          file: './node_modules/module-a/node_modules/@scoped/module-b/index.js',
          size: 100000,
          moduleCount: 0,
        },
        {
          file: './node_modules/@scoped/module-b/index.js',
          size: 100000,
          moduleCount: 0,
        },
      ],
    };

    expect(
      duplicationDetection(defaultDuplicationDetectionConfig, chunkModules, chunkModules)
    ).toEqual<ChunkModuleDuplication>({
      'app.mjs': [
        {
          nodeModule: '@scoped/module-b',
          paths: expect.any(Array),
        },
      ],
    });
  });

  it('disregards local files', () => {
    const chunkModules: ChunkNamesToModules = {
      'app.mjs': [
        {
          file: './node_modules/module-a/node_modules/@scoped/module-b/index.js',
          size: 100000,
          moduleCount: 0,
        },
        {
          file: './node_modules/@scoped/module-b/index.js',
          size: 100000,
          moduleCount: 0,
        },
        {
          file: './src/index.js',
          size: 10,
          moduleCount: 0,
        },
      ],
    };

    expect(
      duplicationDetection(defaultDuplicationDetectionConfig, chunkModules, chunkModules)
    ).toEqual<ChunkModuleDuplication>({
      'app.mjs': [
        {
          nodeModule: '@scoped/module-b',
          paths: expect.any(Array),
        },
      ],
    });
  });

  it('only counts the module once even if multiple files are used from the same module', () => {
    const chunkModules: ChunkNamesToModules = {
      'app.mjs': [
        {
          file: './node_modules/some-module/node_modules/moment/moment.js',
          size: 145211,
          moduleCount: 0,
        },
        {
          file: './node_modules/some-module/node_modules/moment/locale/en-gb.js',
          size: 2290,
          moduleCount: 0,
        },
        {
          file: './node_modules/moment/moment.js',
          size: 124713,
          moduleCount: 0,
        },
      ],
    };

    expect(
      duplicationDetection(defaultDuplicationDetectionConfig, chunkModules, chunkModules)
    ).toEqual<ChunkModuleDuplication>({
      'app.mjs': [
        {
          nodeModule: 'moment',
          paths: [
            {
              existing: true,
              path: 'some-module/node_modules/moment',
            },
            {
              existing: true,
              path: 'moment',
            },
          ],
        },
      ],
    });
  });

  it('ignores specified module from being counted as duplicate', () => {
    const chunkModules: ChunkNamesToModules = {
      'app.mjs': [
        {
          file: './node_modules/some-module/node_modules/moment/moment.js',
          size: 145211,
          moduleCount: 0,
        },
        {
          file: './node_modules/some-module/node_modules/moment/locale/en-gb.js',
          size: 2290,
          moduleCount: 0,
        },
        {
          file: './node_modules/moment/moment.js',
          size: 124713,
          moduleCount: 0,
        },
      ],
    };

    expect(
      duplicationDetection(
        { ...defaultDuplicationDetectionConfig, ignore: ['moment'] },
        chunkModules,
        chunkModules
      )
    ).toEqual<ChunkModuleDuplication>({});
  });

  it('ignores specified sub module from being counted as duplicate', () => {
    const chunkModules: ChunkNamesToModules = {
      'app.mjs': [
        {
          file: './node_modules/some-module/node_modules/moment/moment.js',
          size: 145211,
          moduleCount: 0,
        },
        {
          file: './node_modules/some-module/node_modules/moment/locale/en-gb.js',
          size: 2290,
          moduleCount: 0,
        },
        {
          file: './node_modules/moment/moment.js',
          size: 124713,
          moduleCount: 0,
        },
      ],
    };

    expect(
      duplicationDetection(
        { ...defaultDuplicationDetectionConfig, ignore: ['some-module/node_modules/moment'] },
        chunkModules,
        chunkModules
      )
    ).toEqual<ChunkModuleDuplication>({});
  });

  it('ignores specified module from being counted as duplicate when the module (single file) is below minSize', () => {
    const chunkModules: ChunkNamesToModules = {
      'app.mjs': [
        {
          file: './node_modules/some-module/node_modules/moment/moment.js',
          size: 10,
          moduleCount: 0,
        },
        {
          file: './node_modules/moment/moment.js',
          size: 5,
          moduleCount: 0,
        },
      ],
    };

    expect(
      duplicationDetection(
        { ...defaultDuplicationDetectionConfig, minSize: '7B' },
        chunkModules,
        chunkModules
      )
    ).toEqual<ChunkModuleDuplication>({});
  });

  it('ignores specified module from being counted as duplicate when the module (multiple files) is below minSize', () => {
    const chunkModules: ChunkNamesToModules = {
      'app.mjs': [
        {
          file: './node_modules/some-module/node_modules/moment/moment.js',
          size: 7,
          moduleCount: 0,
        },
        {
          file: './node_modules/some-module/node_modules/moment/locale/en-gb.js',
          size: 2,
          moduleCount: 0,
        },
        {
          file: './node_modules/moment/moment.js',
          size: 10,
          moduleCount: 0,
        },
      ],
    };

    expect(
      duplicationDetection(
        { ...defaultDuplicationDetectionConfig, minSize: '10B' },
        chunkModules,
        chunkModules
      )
    ).toEqual<ChunkModuleDuplication>({});
  });

  it('returns specified module as duplicate when the module (multiple files) is above minSize', () => {
    const chunkModules: ChunkNamesToModules = {
      'app.mjs': [
        {
          file: './node_modules/some-module/node_modules/moment/moment.js',
          size: 7,
          moduleCount: 0,
        },
        {
          file: './node_modules/some-module/node_modules/moment/locale/en-gb.js',
          size: 4,
          moduleCount: 0,
        },
        {
          file: './node_modules/moment/moment.js',
          size: 10,
          moduleCount: 0,
        },
      ],
    };

    expect(
      duplicationDetection(
        { ...defaultDuplicationDetectionConfig, minSize: '10B' },
        chunkModules,
        chunkModules
      )
    ).toEqual<ChunkModuleDuplication>({
      'app.mjs': [
        {
          nodeModule: 'moment',
          paths: [
            {
              existing: true,
              path: 'some-module/node_modules/moment',
            },
            {
              existing: true,
              path: 'moment',
            },
          ],
        },
      ],
    });
  });
});
