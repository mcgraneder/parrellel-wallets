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