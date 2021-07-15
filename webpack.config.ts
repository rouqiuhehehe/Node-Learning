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
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader' },
            {
                test: /\.png/,
                type: 'asset/resource'
            },
            {
                test: /\.html/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/[hash][ext][query]' // 单独指定 名字
                }
            },
            {
                test: /\.svg/,
                type: 'asset/inline' // inline 的时候不需要指定文件名
            },
            {
                test: /\.txt/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        // tslint:disable-next-line:no-magic-numbers
                        maxSize: 4 * 1024 // 4kb  指定大小
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        fallback: {
            path: require.resolve('path-browserify'),
            url: require.resolve('url'),
            buffer: require.resolve('buffer/'),
            util: require.resolve('util/'),
            stream: require.resolve('stream-browserify/')
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
        })
    ]
};

export default config;
