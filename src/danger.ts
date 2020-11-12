/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */

import 'core-js';
import BaseDataSource, { DataSourceBranchType } from './dataSources/BaseDataSource';
import plugins from './plugins';
import config from './config';

// ref: https://danger.systems/js/usage/extending-danger.html#writing-your-plugin
// copied from: https://github.com/danger/generator-danger-plugin/blob/master/src/app/templates/ts/src/index.ts#L4-L10
declare function fail(content: string): void;
declare function warn(content: string): void;
declare function markdown(content: string): void;
declare function schedule(asyncFR: Promise<void>): void;

interface DangerExec {
  dataSource: BaseDataSource;
  baseSha: string;
  headSha: string;
}

const danger = ({ dataSource, baseSha, headSha }: DangerExec): void => {
  schedule(
    (async () => {
      try {
        const userConfig = await config();
        const baseCompilationStats = await dataSource.getCompilationStats(
          DataSourceBranchType.base,
          baseSha
        );
        const headCompilationStats = await dataSource.getCompilationStats(
          DataSourceBranchType.head,
          headSha
        );

        const pluginInstances = await plugins(
          userConfig,
          baseCompilationStats,
          headCompilationStats
        );

        const errors = (
          await Promise.all(pluginInstances.map((plugin) => plugin.errorMessages()))
        ).filter((line) => !!line && line.length);
        const warnings = (
          await Promise.all(pluginInstances.map((plugin) => plugin.warningMessages()))
        )
          .flat()
          .filter((line) => !!line && line.length);
        const summaryLines = (
          await Promise.all(pluginInstances.map((plugin) => plugin.summaryOutput()))
        )
          .flat()
          .filter((line) => !!line);
        const detailsLines = (
          await Promise.all(pluginInstances.map((plugin) => plugin.dangerOutput()))
        ).filter((line) => !!line);

        if (!summaryLines.length && !detailsLines.length) {
          throw new Error('no data to display, has it been configured correctly?');
        }

        if (errors.length) {
          fail(
            `Webpack Bundle Delta: ${
              errors.length === 1 ? errors[0] : `\n${errors.map((line) => `- ${line}`).join('\n')}`
            }`
          );
        }

        if (warnings.length) {
          warn(
            `Webpack Bundle Delta: ${
              warnings.length === 1
                ? warnings[0]
                : `\n${warnings.map((line) => `- ${line}`).join('\n')}`
            }`
          );
        }

        let formattedSummary = '';
        if (summaryLines.length === 1) {
          // eslint-disable-next-line prefer-destructuring
          formattedSummary = summaryLines[0];
        } else if (summaryLines.length) {
          formattedSummary = summaryLines.map((line) => `- ${line}`).join('\n');
        }

        markdown(
          `
# Webpack Bundle Delta

${formattedSummary}
${
  detailsLines
    ? `
<details>
  <summary>Click for more information</summary>

${detailsLines
  .join('\n\n')
  .split('\n')
  .map((line) => `  ${line}`)
  .join('\n')}
</details>
`
    : ''
}
        `.trim()
        );
      } catch (error) {
        const castedError = error as Error;
        warn(`webpack-bundle-delta ran into an issue: ${castedError.message}`);
        if (castedError.stack) {
          markdown(
            `
# Webpack Bundle Delta

<details>
  <summary>Stack trace (click to expand)</summary>

\`\`\`
${castedError.stack}
\`\`\`
</details>
`.trim()
          );
        }
      }
    })()
  );
};

export default danger;
