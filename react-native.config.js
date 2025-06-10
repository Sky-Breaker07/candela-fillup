const linkAssets = require('@react-native-community/cli-link-assets');

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/'],
  commands: [linkAssets.commands.linkAssets]
}; 