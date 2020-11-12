/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { isEqual } from 'lodash';
import BasePlugin, { BasePluginOptions } from '../BasePlugin';
import { RestrictConfig } from './config';
import restrict, { RestrictedModule } from './restrict';

const emoji = {
  info: 'ℹ️',
  warn: '⚠️',
  error: '🚫',
};

const issuerPathNote =
  'Note: Issuer path is the trace of the first time this file was referenced, refer to chunks for where it is included elsewhere.';

export interface RestrictPluginOptions extends BasePluginOptions {
  config: RestrictConfig;
}

export default class RestrictPlugin extends BasePlugin<RestrictPluginOptions> {
  private restrictions: RestrictedModule[];

  constructor(options: RestrictPluginOptions) {
    super(options);

    const { showExisting, chunkFilename, restrictions } = options.config;
    const baseRestrictions = restrict(options.baseCompilationStats, chunkFilename, restrictions);
    const headRestrictions = restrict(options.headCompilationStats, chunkFilename, restrictions);
    this.restrictions = showExisting
      ? headRestrictions
      : headRestrictions.filter(
          (headRestriction) =>
            !baseRestrictions.some((baseRestriction) => {
              // don't want to use issuerPath because it can change per builds as it is only the first call, and then cached there after
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { issuerPath: baseIssuePath, ...baseWithoutIssuers } = baseRestriction;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { issuerPath: headIssuePath, ...headWithoutIssuers } = headRestriction;
              return isEqual(baseWithoutIssuers, headWithoutIssuers);
            })
        );
  }

  errorMessages(): string[] {
    return [
      ...new Set(
        this.restrictions
          .filter(({ restriction: { responseType } }) => responseType === 'error')
          .map(({ filename }) => filename)
      ),
    ].map((filename) => `${filename} is restricted`);
  }

  warningMessages(): string[] {
    return [
      ...new Set(
        this.restrictions
          .filter(({ restriction: { responseType } }) => responseType === 'warn')
          .map(({ filename }) => filename)
      ),
    ].map((filename) => `${filename} is restricted`);
  }

  summaryOutput(): string {
    if (this.restrictions.length) {
      const uniqueFileCount = [...new Set(this.restrictions.map(({ filename }) => filename))];
      return `${uniqueFileCount.length} restricted file${
        uniqueFileCount.length !== 1 ? 's' : ''
      } found`;
    }
    return null;
  }

  dangerOutput(): string {
    let text = 'No restricted files found';
    if (this.restrictions.length) {
      text = `
The following restrictions were found:

<ul>
${this.restrictions
  .map(
    ({ filename, restriction: { message, responseType }, issuerPath, chunkNames }) =>
      `  <li>${emoji[responseType]} <code>${filename}</code>: ${message}${
        chunkNames && chunkNames.length
          ? `
    <details>
      <summary>Used in</summary>
      <ul>
${chunkNames.map((chunkName) => `        <li><code>${chunkName}</code></li>`).join('\n')}
      </ul>
    </details>`
          : ''
      }${
        issuerPath && issuerPath.length
          ? `
    <details>
      <summary>Issuer path</summary>
      <ul>
${issuerPath.map((path) => `        <li><code>${path}</code></li>`).join('\n')}
      </ul>
    </details>`
          : ''
      }
  </li>`
  )
  .join('\n')}
</ul>

*${issuerPathNote}*`.trim();
    }

    return `## Restricted files\n\n${text}`;
  }

  cliOutput(): string {
    let text = 'No restricted files found';
    if (this.restrictions.length) {
      text = `
The following restrictions were found:
${this.restrictions
  .map(
    ({ filename, restriction: { message, responseType }, issuerPath, chunkNames }) =>
      `- ${emoji[responseType]} ${filename}: ${message}${
        chunkNames && chunkNames.length
          ? `
  - Used in
${chunkNames.map((chunkName) => `    - ${chunkName}`).join('\n')}`
          : ''
      }${
        issuerPath && issuerPath.length
          ? `
  - Issuer path
${issuerPath.map((path) => `    - ${path}`).join('\n')}`
          : ''
      }`
  )
  .join('\n\n')}

${issuerPathNote}`.trim();
    }

    return `## Restricted files\n\n${text}`;
  }
}
