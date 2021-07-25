import CopyWebpackPlugin from 'copy-webpack-plugin';
import fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';
// in case you run into any typescript error when configuring `devServer`

const nodeModules: Record<string, string> = {};

fs.readdirSync('node_modules')
    .filter((x) => {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach((mod) => {
        nodeModules[mod] = 'commonjs ' + mod;
    });

const config: webpack.Configuration = {
    mode: 'production',
    target: 'node',
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    // externalsPresets: {
    //     node: true
    // },
    externals: [
        (data, callback) => {
            if (typeof data.request === 'string' && new RegExp('bcrypt').test(data.request)) {
                return callback(undefined, 'commonjs ' + data.request);
            }
            callback();
        }
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        // 指定加载器
                        loader: 'babel-loader',
                        options: {
                            // 设置预定义的运行环境
                            presets: [
                                [
                                    // 指定环境的插件
                                    '@babel/preset-env',
                                    // 配置信息
                                    {
                                        // 要兼容的浏览器版本
                                        targets: {
                                            chrome: '45',
                                            ie: '10'
                                        },
                                        // 指定corejs的版本
                                        corejs: '3',
                                        // 使用corejs的方式： usage=>按需加载
                                        useBuiltIns: 'usage'
                                    }
                                ]
                            ],
                            plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/transform-runtime']
                        }
                    },
                    'ts-loader'
                ],
                exclude: /node-modules/
            }
        ]
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
