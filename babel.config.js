module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Exclude test files from compilation
    // ignore: [
    //   '**/__tests__/**',
    //   '**/*.test.ts',
    //   '**/*.test.tsx',
    //   '**/*.test.js',
    // ],
  };
};
