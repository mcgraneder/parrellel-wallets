const webpack = require("webpack");

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            return {
                ...webpackConfig,
                // Polyfills for stream and buffer, required by
                // @renproject/chains dependencies.
                resolve: {
                    ...webpackConfig.resolve,
                    fallback: {
                        stream: require.resolve("stream-browserify"),
                        buffer: require.resolve("buffer"),
                        assert: require.resolve("assert/"),
                        crypto: require.resolve("crypto-browserify"),
                        url: require.resolve("url/"),
                        http: require.resolve("stream-http"),
                        https: require.resolve("https-browserify")
                    },
                },
                // Ignore errors thrown by @terra-money/terra.proto.
                ignoreWarnings: [/Failed to parse source map/],
                plugins: [
                    ...webpackConfig.plugins,
                    new webpack.ProvidePlugin({
                        Buffer: ["buffer", "Buffer"],
                    }),
                ],
            };
        },
    },
};