/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import changes, { ChunkModulesChanges } from './changes';
import { ChunkNamesToModules, ChunkModule } from '../../helpers/mapChunkNamesWithModules';

const accordionJs: ChunkModule = {
  file: './src/client/components/Accordion/Accordion.jsx',
  size: 2334,
  moduleCount: 0,
};

describe('changes', () => {
  it('returns chunks which were added', () => {
    const base: ChunkNamesToModules = null;
    const head: ChunkNamesToModules = {
      'Accordion.js': [accordionJs],
    };

    expect(changes(base, head)).toEqual<ChunkModulesChanges>({
      'Accordion.js': [
        {
          file: accordionJs.file,
          prevSize: 0,
          currentSize: accordionJs.size,
          diff: accordionJs.size,
          diffPercent: 100,
          prevModuleCount: 0,
          currentModuleCount: 0,
          moduleCountDiff: 0,
        },
      ],
    });
  });

  it('returns chunks which were removed', () => {
    const base: ChunkNamesToModules = {
      'Accordion.js': [accordionJs],
    };
    const head: ChunkNamesToModules = null;

    expect(changes(base, head)).toEqual<ChunkModulesChanges>({
      'Accordion.js': [
        {
          file: accordionJs.file,
          prevSize: accordionJs.size,
          currentSize: 0,
          diff: -accordionJs.size,
          diffPercent: -100,
          prevModuleCount: 0,
          currentModuleCount: 0,
          moduleCountDiff: 0,
        },
      ],
    });
  });

  it('returns chunk modules which were added', () => {
    const base: ChunkNamesToModules = {
      'Accordion.js': [],
    };
    const head: ChunkNamesToModules = {
      'Accordion.js': [accordionJs],
    };

    expect(changes(base, head)).toEqual<ChunkModulesChanges>({
      'Accordion.js': [
        {
          file: accordionJs.file,
          prevSize: 0,
          currentSize: accordionJs.size,
          diff: accordionJs.size,
          diffPercent: 100,
          prevModuleCount: 0,
          currentModuleCount: 0,
          moduleCountDiff: 0,
        },
      ],
    });
  });

  it('returns chunk modules which were removed', () => {
    const base: ChunkNamesToModules = {
      'Accordion.js': [accordionJs],
    };
    const head: ChunkNamesToModules = {
      'Accordion.js': [],
    };

    expect(changes(base, head)).toEqual<ChunkModulesChanges>({
      'Accordion.js': [
        {
          file: accordionJs.file,
          prevSize: accordionJs.size,
          currentSize: 0,
          diff: -accordionJs.size,
          diffPercent: -100,
          prevModuleCount: 0,
          currentModuleCount: 0,
          moduleCountDiff: 0,
        },
      ],
    });
  });

  it('returns chunk modules which changed', () => {
    const base: ChunkNamesToModules = {
      'Accordion.js': [accordionJs],
    };
    const head: ChunkNamesToModules = {
      'Accordion.js': [{ ...accordionJs, size: 3000 }],
    };

    expect(changes(base, head)).toEqual<ChunkModulesChanges>({
      'Accordion.js': [
        {
          file: accordionJs.file,
          prevSize: accordionJs.size,
          currentSize: 3000,
          diff: 666,
          diffPercent: 28.53,
          prevModuleCount: 0,
          currentModuleCount: 0,
          moduleCountDiff: 0,
        },
      ],
    });
  });

  it('does not return the chunk when no changes were detected', () => {
    const base: ChunkNamesToModules = {
      'Accordion.js': [accordionJs],
    };

    expect(changes(base, base)).toEqual<ChunkModulesChanges>({});
  });

  it('considers change in module count as part as a change and not remove/add', () => {
    const base: ChunkNamesToModules = {
      'Accordion.js': [
        {
          file: './src/client/components/Accordion/Accordion.jsx',
          size: 2334,
          moduleCount: 1,
        },
      ],
    };
    const head: ChunkNamesToModules = {
      'Accordion.js': [
        {
          file: './src/client/components/Accordion/Accordion.jsx',
          size: 3334,
          moduleCount: 3,
        },
      ],
    };

    expect(changes(base, head)).toEqual<ChunkModulesChanges>({
      'Accordion.js': [
        {
          file: './src/client/components/Accordion/Accordion.jsx',
          prevSize: 2334,
          currentSize: 3334,
          diff: 1000,
          diffPercent: 42.84,
          prevModuleCount: 1,
          currentModuleCount: 3,
          moduleCountDiff: 2,
        },
      ],
    });
  });
});
