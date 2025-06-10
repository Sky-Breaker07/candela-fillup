const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://metrobundler.dev/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs'],
    unstable_enablePackageExports: false,
  },
};

// Merge the default config with our custom config
const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

module.exports = withNativeWind(mergedConfig, { input: './global.css' });