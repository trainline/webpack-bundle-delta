/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import BasePlugin, { BasePluginOptions } from '../BasePlugin';
import { ResolveAliasRemapConfig, defaultResolveAliasRemapConfig } from './config';
import resolveAliasRemap, { ResolveAliasRemapSuggestion } from './resolveAliasRemap';

interface ResolveAliasRemapPluginOptions extends BasePluginOptions {
  config: ResolveAliasRemapConfig;
}

export default class ResolveAliasRemapPlugin extends BasePlugin<ResolveAliasRemapPluginOptions> {
  private suggestions: ResolveAliasRemapSuggestion[] = [];

  constructor(options: ResolveAliasRemapPluginOptions) {
    super(options);

    const { remap, keepDefaultRemap, showExisting } = options.config;
    let remapList = remap;
    if (keepDefaultRemap) {
      remapList = remapList.concat(defaultResolveAliasRemapConfig.remap);
    }
    const baseRemap = resolveAliasRemap(options.baseCompilationStats, remapList);
    const headRemap = resolveAliasRemap(options.headCompilationStats, remapList);
    this.suggestions = showExisting
      ? headRemap
      : headRemap.filter(
          ({ name, suggestion }) =>
            !baseRemap.some((br) => br.name === name && br.suggestion === suggestion)
        );
  }

  summaryOutput(): string {
    if (this.suggestions.length) {
      return `${this.suggestions.length} webpack resolve.alias suggestion${
        this.suggestions.length !== 1 ? 's' : ''
      } available`;
    }
    return null;
  }

  output(backtick = false): string {
    let text = 'No suggestions available';
    if (this.suggestions.length) {
      text = `
The following suggestions may be added to the webpack resolve.alias section to reduce duplicated functionality:
${this.suggestions
  .map(({ suggestion }) => (backtick ? `- \`${suggestion}\`` : `- ${suggestion}`))
  .join('\n')}
`.trim();
    }

    return `## Resolve Alias Remap\n\n${text}`;
  }

  dangerOutput(): string {
    return this.output(true);
  }

  cliOutput(): string {
    return this.output();
  }
}
