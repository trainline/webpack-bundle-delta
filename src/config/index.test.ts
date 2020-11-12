/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { cosmiconfig } from 'cosmiconfig';
import config from './index';
import { BasePluginConfig, defaultBasePluginConfig, UserDefinedConfig } from './PluginConfig';
import allPluginsConfig from './allPlugins';
import { SizeChangesConfig } from '../plugins/size-changes/config';
import { DuplicationDetectionConfig } from '../plugins/duplication-detection/config';
import { ResolveAliasRemapConfig } from '../plugins/resolve-alias-remap/config';

jest.mock('cosmiconfig');
jest.mock(
  '@company/webpack-bundle-delta-config',
  () =>
    ({
      plugins: [{ name: 'trace-changes', config: true }],
    } as UserDefinedConfig),
  { virtual: true }
);

jest.mock(
  '@company/extended-webpack-bundle-delta-config',
  () =>
    ({
      specific: {
        extends: '@company/webpack-bundle-delta-config',
        plugins: [{ name: 'size-changes', config: { hideMinorChanges: true } }],
      },
      baseGlobals: {
        globals: { chunkFilename: '[id]-[hash].[ext]', showExisting: true } as BasePluginConfig,
      },
    } as UserDefinedConfig),
  { virtual: true }
);

jest.mock('config-with-no-plugins', () => ({} as UserDefinedConfig), { virtual: true });
jest.mock('config-with-empty-plugins', () => ({ plugins: [] } as UserDefinedConfig), {
  virtual: true,
});

describe('config manager', () => {
  const mockSearch = jest.fn();

  beforeEach(() => {
    (cosmiconfig as jest.Mock).mockImplementation(() => ({
      search: mockSearch,
    }));
  });

  it('returns default configuration when no configuration is defined', () => {
    mockSearch.mockResolvedValue(null);
    return expect(config()).resolves.toEqual<UserDefinedConfig>({
      filepath: '',
      plugins: allPluginsConfig,
    });
  });

  it('returns custom configuration', () => {
    const sizeChange = { name: 'size-changes', config: false };
    mockSearch.mockResolvedValue({
      filepath: './package.json',
      isEmpty: false,
      config: {
        plugins: [sizeChange],
      } as UserDefinedConfig,
    });
    return expect(config()).resolves.toEqual<UserDefinedConfig>({
      plugins: allPluginsConfig.map((plugin) => {
        if (plugin.name === sizeChange.name) {
          return sizeChange;
        }
        return plugin;
      }),
    });
  });

  it('returns custom configuration with globals set', () => {
    const sizeChange = {
      name: 'size-changes',
      config: { hideMinorChanges: true } as SizeChangesConfig,
    };
    const chunkFilename = 'static/js/[name].[contenthash:8].chunk.js';
    mockSearch.mockResolvedValue({
      filepath: './package.json',
      isEmpty: false,
      config: {
        globals: { chunkFilename } as BasePluginConfig,
        plugins: [sizeChange],
      } as UserDefinedConfig,
    });

    const expectation = expect.objectContaining({
      config: expect.objectContaining({ chunkFilename }),
    });

    return expect(config()).resolves.toMatchObject<UserDefinedConfig>({
      plugins: [
        expectation,
        expectation,
        expectation,
        expectation,
        expect.objectContaining({ config: false }),
      ],
    });
  });

  it('returns custom extends', () => {
    mockSearch.mockResolvedValue({
      filepath: './package.json',
      isEmpty: false,
      config: {
        extends: '@company/webpack-bundle-delta-config',
      } as UserDefinedConfig,
    });
    return expect(config()).resolves.toEqual<UserDefinedConfig>({
      extends: '@company/webpack-bundle-delta-config',
      plugins: [{ name: 'trace-changes', config: defaultBasePluginConfig }],
    });
  });

  it('returns custom multi-layered extends', () => {
    mockSearch.mockResolvedValue({
      filepath: './package.json',
      isEmpty: false,
      config: {
        extends: '@company/extended-webpack-bundle-delta-config:specific',
      } as UserDefinedConfig,
    });
    return expect(config()).resolves.toEqual<UserDefinedConfig>({
      extends: '@company/extended-webpack-bundle-delta-config:specific',
      plugins: [
        { name: 'trace-changes', config: defaultBasePluginConfig },
        {
          name: 'size-changes',
          config: { ...defaultBasePluginConfig, hideMinorChanges: true } as BasePluginConfig,
        },
      ],
    });
  });

  it('returns config merging extends with specified config', () => {
    mockSearch.mockResolvedValue({
      filepath: './package.json',
      isEmpty: false,
      config: {
        extends: '@company/webpack-bundle-delta-config',
        plugins: [
          {
            name: 'size-changes',
            config: {
              ...defaultBasePluginConfig,
              significance: {
                brSizeDiffPercent: 10,
              },
            } as BasePluginConfig,
          },
        ],
      } as UserDefinedConfig,
    });
    return expect(config()).resolves.toEqual<UserDefinedConfig>({
      extends: '@company/webpack-bundle-delta-config',
      plugins: [
        { name: 'trace-changes', config: defaultBasePluginConfig },
        {
          name: 'size-changes',
          config: {
            ...defaultBasePluginConfig,
            significance: {
              brSizeDiffPercent: 10,
            },
          } as BasePluginConfig,
        },
      ],
    });
  });

  it('returns specified config with no extends/default', () => {
    mockSearch.mockResolvedValue({
      filepath: './package.json',
      isEmpty: false,
      config: {
        extends: null,
        plugins: [{ name: 'trace-changes', config: defaultBasePluginConfig }],
      } as UserDefinedConfig,
    });
    return expect(config()).resolves.toEqual<UserDefinedConfig>({
      extends: null,
      plugins: [{ name: 'trace-changes', config: defaultBasePluginConfig }],
    });
  });

  it('returns config extends and specified merging objects', async () => {
    mockSearch.mockResolvedValue({
      filepath: './package.json',
      isEmpty: false,
      config: {
        extends: '@company/extended-webpack-bundle-delta-config:specific',
        plugins: [
          {
            name: 'size-changes',
            config: {
              ...defaultBasePluginConfig,
              significance: {
                brSizeDiffPercent: 10,
              },
            } as BasePluginConfig,
          },
        ],
      } as UserDefinedConfig,
    });
    const userConfig = await config();
    return expect(userConfig.plugins.find(({ name }) => name === 'size-changes')).toEqual({
      name: 'size-changes',
      config: {
        ...defaultBasePluginConfig,
        significance: {
          brSizeDiffPercent: 10,
        },
        hideMinorChanges: true,
      } as SizeChangesConfig,
    });
  });

  it('returns config extends and specified overriding base non-object with merging object', async () => {
    mockSearch.mockResolvedValue({
      filepath: './package.json',
      isEmpty: false,
      config: {
        extends: '@company/webpack-bundle-delta-config',
        plugins: [
          {
            name: 'trace-changes',
            config: {
              ...defaultBasePluginConfig,
              not: 'used',
            } as BasePluginConfig,
          },
        ],
      } as UserDefinedConfig,
    });
    const userConfig = await config();
    return expect(userConfig.plugins.find(({ name }) => name === 'trace-changes')).toEqual({
      name: 'trace-changes',
      config: {
        ...defaultBasePluginConfig,
        not: 'used',
      },
    });
  });

  it('returns config with base globals from extends', () => {
    mockSearch.mockResolvedValue({
      filepath: './package.json',
      isEmpty: false,
      config: {
        extends: '@company/extended-webpack-bundle-delta-config:baseGlobals',
      } as UserDefinedConfig,
    });

    const baseGlobals = {
      chunkFilename: '[id]-[hash].[ext]',
      showExisting: true,
    } as BasePluginConfig;

    return expect(config()).resolves.toEqual<UserDefinedConfig>({
      extends: '@company/extended-webpack-bundle-delta-config:baseGlobals',
      plugins: [
        {
          config: {
            ...baseGlobals,
            budget: null,
            hideMinorChanges: false,
            significance: {
              brSizeDiffPercent: 5,
              gzSizeDiffPercent: 5,
              sizeDiffBytes: 1000,
              sizeDiffPercent: 5,
            },
          } as SizeChangesConfig,
          name: 'size-changes',
        },
        {
          config: {
            ...baseGlobals,
          },
          name: 'trace-changes',
        },
        {
          config: {
            ...baseGlobals,
            ignore: null,
            minSize: '5KB',
          } as DuplicationDetectionConfig,
          name: 'duplication-detection',
        },
        {
          config: {
            ...baseGlobals,
            keepDefaultRemap: false,
            remap: [
              {
                aliasEntry: expect.any(Function),
                searchFor: 'lodash\\.([^/]+)',
              },
            ],
          } as ResolveAliasRemapConfig,
          name: 'resolve-alias-remap',
        },
        {
          config: false,
          name: 'restrict',
        },
      ],
    });
  });

  describe('error scenarios', () => {
    it('throws error when attempting to extend module not found', () => {
      mockSearch.mockResolvedValue({
        filepath: './package.json',
        isEmpty: false,
        config: {
          extends: 'not-found-config',
        } as UserDefinedConfig,
      });
      return expect(config()).rejects.toThrowError();
    });

    it('throws error when attempt to specify section on extends which does not exist', () => {
      mockSearch.mockResolvedValue({
        filepath: './package.json',
        isEmpty: false,
        config: {
          extends: '@company/webpack-bundle-delta-config:specific',
        } as UserDefinedConfig,
      });
      return expect(config()).rejects.toThrowError(
        'Unable to find section "specific" in config "@company/webpack-bundle-delta-config": is it a named export (i.e. module.exports = { specific: someConfig };)?'
      );
    });
  });
});
