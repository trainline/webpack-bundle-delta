/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import commander from 'commander';
import BaseDataSource from './dataSources/BaseDataSource';

export interface ExecOptions {
  dataSource: BaseDataSource;
  baseSha: string;
  headSha: string;
}

export interface CliProgram {
  (program: commander.Command, execAction: (options: ExecOptions) => Promise<void>): void;
}
