module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|react-redux' +
      '|@react-navigation' +
  '|expo' +
  '|expo-router' +
  '|expo-modules-core' +
  '|expo-asset' +
  '|expo-constants' +
  '|expo-[a-zA-Z0-9_]+' +
      '|@expo' +
      '|@expo/vector-icons' +
      '|@unimodules' +
      '|unimodules' +
      '|sentry-expo' +
      '|native-base' +
      '|@react-native-community' +
      '|redux-mock-store' +
      ')/)'
  ],
};
