module.exports = {
  name: 'app',
  displayName: 'Phone App',
  rootDir: './',
  setupFiles: ['<rootDir>/jest.setup.js'],
  clearMocks: true,
  preset: '@testing-library/react-native',
  moduleFileExtensions: ['js'],
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '\\.snap$',
    '<rootDir>/node_modules/',
    '<rootDir>/__e2e__/',
  ],
  cacheDirectory: '.jest/cache',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@egendata/react-native-jose|react-native-collapsible|react-native-modal|react-native-animatable)/)',
  ],
  unmockedModulePathPatterns: ['react-native-jose'],
  autoMock: false,
  verbose: true,
}
