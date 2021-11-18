module.exports = {
  target: "node",
  externals: [
    (function () {
      var IGNORES = ["electron"];
      return (context, request, callback) => {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, "require('" + request + "')");
        }
        return callback();
      };
    })(),
  ],
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: "node-loader",
      },
    ],
  },
};

// resolve: {
//     fallback: {
//       url: require.resolve("url/"),
//       http: require.resolve("stream-http"),
//       https: require.resolve("https-browserify"),
//       os: require.resolve("os-browserify/browser"),
//       crypto: require.resolve("crypto-browserify"),
//       assert: require.resolve("assert/"),
//       fs: false,
//       tls: false,
//       net: false,
//       path: false,
//       zlib: false,
//       stream: false,
//     },
//   },
