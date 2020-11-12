/* eslint-disable no-console */
import path from 'path';
import danger from '../src/danger';
import LocalFileDataSource from '../src/dataSources/LocalFile';

declare global {
  function fail(content: string): void;
  function warn(content: string): void;
  function markdown(content: string): void;
  function schedule(asyncFR: Promise<any>): void;
}

const awaiting: Promise<any>[] = [];

// @ts-ignore
global.fail = (content: string): void => {
  console.error(content);
};

global.warn = (content: string): void => {
  console.warn(content);
};

global.markdown = (content: string): void => {
  console.log(content);
};

global.schedule = (asyncFR: Promise<any>): void => {
  awaiting.push(asyncFR);
};

(async () => {
  danger({
    dataSource: new LocalFileDataSource({
      baseFilePath: path.join(__dirname, './fixtures/base-compilation-stats.json'),
      headFilePath: path.join(__dirname, './fixtures/head-compilation-stats.json'),
    }),
    baseSha: '-',
    headSha: '-',
  });
  await Promise.all(awaiting);
})();
