module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  testRegex: '.*\\.test\\.tsx?$',
  testPathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',
  verbose: true,
  globalSetup: './test/globalSetup.ts',
};
