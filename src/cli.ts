#!/usr/bin/env node

/* eslint-disable no-console, header/header */
/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import { Command } from 'commander';
import { readFileSync } from 'fs';
import path from 'path';
import { DataSourceBranchType } from './dataSources/BaseDataSource';
import * as cliDataSources from './dataSources/cliIndex';
import { ExecOptions } from './CliProgram';
import config from './config';
import plugins from './plugins';

const packageJson = JSON.parse(
  readFileSync(path.normalize(path.join(__dirname, '../package.json')), 'utf-8')
);

const program = new Command('webpack-bundle-delta');
program.version(packageJson.version);

async function exec({ dataSource, baseSha, headSha }: ExecOptions) {
  let exitCode = 0;
  const userConfig = await config();
  const baseCompilationStats = await dataSource.getCompilationStats(
    DataSourceBranchType.base,
    baseSha
  );
  const headCompilationStats = await dataSource.getCompilationStats(
    DataSourceBranchType.head,
    headSha
  );

  const pluginInstances = await plugins(userConfig, baseCompilationStats, headCompilationStats);
  const errors = (await Promise.all(pluginInstances.map((plugin) => plugin.errorMessages())))
    .flat()
    .filter((line) => !!line && line.length);
  const warnings = (await Promise.all(pluginInstances.map((plugin) => plugin.warningMessages())))
    .flat()
    .filter((line) => !!line && line.length);
  const summaryLines = (
    await Promise.all(pluginInstances.map((plugin) => plugin.summaryOutput()))
  ).filter((line) => !!line);
  const detailsLines = (
    await Promise.all(pluginInstances.map((plugin) => plugin.cliOutput()))
  ).filter((line) => !!line);

  if (!summaryLines.length && !detailsLines.length) {
    throw new Error('no data to display, has it been configured correctly?');
  }

  let formattedSummary = '';
  if (summaryLines.length === 1) {
    // eslint-disable-next-line prefer-destructuring
    formattedSummary = summaryLines[0];
  } else if (summaryLines.length) {
    formattedSummary = summaryLines.map((line) => `- ${line}`).join('\n');
  }

  console.log(
    `
# Webpack Bundle Delta

${formattedSummary}

${detailsLines.join('\n\n\n')}`.trim()
  );

  if (errors.length) {
    console.error(
      `\n\nThe follow error${errors.length > 1 ? 's' : ''} occurred: ${
        errors.length === 1 ? errors[0] : `\n${errors.map((line) => `- ${line}`).join('\n')}`
      }`
    );
    exitCode = errors.length;
  }

  if (warnings.length) {
    console.warn(
      `\n\nThe follow warning${warnings.length > 1 ? 's' : ''} occurred: ${
        warnings.length === 1 ? warnings[0] : `\n${warnings.map((line) => `- ${line}`).join('\n')}`
      }`
    );
  }
  process.exit(exitCode);
}

(async () => {
  try {
    Object.values(cliDataSources).forEach((cliDataSource) => cliDataSource(program, exec));
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
