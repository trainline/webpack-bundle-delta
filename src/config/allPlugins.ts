/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { PluginConfig } from './PluginConfig';
import { defaultSizeChangesConfig } from '../plugins/size-changes/config';
import { defaultDuplicationDetectionConfig } from '../plugins/duplication-detection/config';
import { defaultResolveAliasRemapConfig } from '../plugins/resolve-alias-remap/config';
import { defaultRestrictConfig } from '../plugins/restrict/config';

const allPlugins: PluginConfig[] = [
  {
    name: 'size-changes',
    config: defaultSizeChangesConfig,
  },
  {
    name: 'trace-changes',
    config: true,
  },
  {
    name: 'duplication-detection',
    config: defaultDuplicationDetectionConfig,
  },
  {
    name: 'resolve-alias-remap',
    config: defaultResolveAliasRemapConfig,
  },
  {
    name: 'restrict',
    config: defaultRestrictConfig,
  },
];

export default allPlugins;
