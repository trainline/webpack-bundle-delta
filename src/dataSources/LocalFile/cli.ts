/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import LocalFile from './index';
import { CliProgram } from '../../CliProgram';

const createCli: CliProgram = (program, execAction) => {
  program
    .command('local <baseFilePath> <headFilePath>')
    .action(async (baseFilePath: string, headFilePath: string) => {
      await execAction({
        dataSource: new LocalFile({ baseFilePath, headFilePath }),
        baseSha: '-',
        headSha: '-',
      });
    });
};

export default createCli;
