import CopyWebpackPlugin from 'copy-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
// in case you run into any typescript error when configuring `devServer`

const config: webpack.Configuration = {
    mode: 'production',
    target: 'node',
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [{ test: /\.tsx?$/, use: 'ts-loader' }]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        fallback: {
            path: require.resolve('path-browserify'),
            url: require.resolve('url'),
            buffer: require.resolve('buffer'),
            util: require.resolve('util')
            // stream: require.resolve('stream-browserify')
        },
        alias: {
            '@types': path.resolve(__dirname, './src/types/'),
            '@util': path.resolve(__dirname, './src/util/index.ts'),
            '@src': path.resolve(__dirname, './src/')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_DEBUG': JSON.stringify(false)
            // Buffer: JSON.stringify(require("buffer/").Buffer)
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, './src/assets'),
                    to: path.join(__dirname, './build/assets')
                }
            ]
        })
    ]
};

export default config;
