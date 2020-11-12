/*
 * Copyright (c) Trainline Limited, 2020. All rights reserved.
 * See LICENSE.md in the project root for license information.
 */
import TeamCityDataSource, { TeamCityDataSourceConfiguration } from '.';
import { CliProgram } from '../../CliProgram';

const createCli: CliProgram = (program, execAction) => {
  program
    .command('teamcity <baseSha> <headSha>')
    .requiredOption('-s, --server-url <serverUrl>', 'server url')
    .requiredOption('-u, --username <username>', 'username to log into TeamCity')
    .requiredOption('-p, --password <password>', 'password to log into TeamCity')
    .requiredOption(
      '-b, --build-type <buildType>',
      '<your build pipeline> > Edit Configuration > General Settings > Build configuration ID'
    )
    .action(
      async (baseSha: string, headSha: string, cmdObject: TeamCityDataSourceConfiguration) => {
        await execAction({
          dataSource: new TeamCityDataSource(cmdObject),
          baseSha,
          headSha,
        });
      }
    );
};

export default createCli;
