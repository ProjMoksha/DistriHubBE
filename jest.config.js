module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/swagger/**',
    '!src/config/**',
  ],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
};
