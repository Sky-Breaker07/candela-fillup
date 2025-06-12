module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "module:metro-react-native-babel-preset",
      "@babel/preset-typescript",
      "nativewind/babel"
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "~": "./"
          }
        }
      ]
    ]
  };
};