module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "@react-native/babel-preset",
      [
        "@babel/preset-typescript",
        {
          allowDeclareFields: true,
        },
      ],
      "nativewind/babel"
    ],
    plugins: [
      "babel-plugin-syntax-hermes-parser",
      ["@babel/plugin-transform-private-methods", {"loose": true}],
      ["@babel/plugin-transform-private-property-in-object", {"loose": true}],
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
    ],
    overrides: [
      {
        test: "./node_modules/react-native/index.js",
        plugins: [["@babel/plugin-transform-typescript", {allowDeclareFields: true}]],
      },
    ],
  };
};