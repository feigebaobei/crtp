const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');


// 未测试
module.exports = (env) => {
    let isProd = env.production === 'production'
    return {
        mode: isProd ? 'production' : 'development',
        entry: {
            main: './src/main.js',
            index: './src/index.html',
        },
        devtool: 'inline-source-map',
        devServer: {
            allowedHosts: 'auto',
            client: {
                loggin: 'log',
                overlay: true,
                progess: true,
                reconnect: 5,
                webSocketTransport: 'ws',
                // webSocketURL: '',
            },
            compress: true,
            // devMiddleware: () => {},
            // https
            // headers: {k: 'v'},
            // host: 
            hot: true,          // 启动hmr
            port: 'auto',
            // proxy: {
            //     'path': 'newPath',
            //     'path': {
            //         target: 'host',
            //         pathRewrite: {'path': ''},
            //     },
            //     'path': {
            //         bypass: (req, res, proxyOptions) => {
            //             return result
            //         }
            //     },
            // },
            // proxy: [
            //     {
            //         context: ['/path1', '/path2'],
            //         target: 'host'
            //     }
            // ],
            static: './dist',
            // static: {
            //     redirect,
            //     publicPath,
            //     serveIndex,
            //     watch,
            //     watchFiles,
            // },
        },
        output: {
            // asyncChunks: true,
            // auxiliaryComment: 'string',
            // chunkFileName: '[name][fullhash].js',
            clean: true,
            // crossOriginLoading: false,
            filename: '[name][fullhash].js',
            // library: '',
            sourceMapFilename: '[name].map[query]',
            path: path.resolve(__dirname, 'dist'),
        },
        // 定义node_modules里的包的解析方案
        module: {
            // generator: {
            //     dataUrl: {
            //         encoding: 'base64',
            //     },
            //     publicPath: 'public',
            // },
            // parser: {
            //     javascript: {
            //         commonjsMagicCommonts: false,
            //         exportsPresence: 'error',
            //     }
            // },
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        useBuiltIns: 'usage',
                                        corejs: {verson: '3.11'},
                                        targets: '> 0.25%, not dead'
                                    }
                                ]
                            ]
                        }
                    }
                },
                // demo
                // {
                //     exclude: '',
                //     include: '',
                //     loader: '',
                //     oneOf: [],
                //     test: '' / regexp,
                //     use: [],
                // },
            ]
        },
        // 定义自己开始的包的解析方案
        resolve: {
            // alias: path.resolve(__dirname, ''),
            extensions: ['.js', '.json', '.wasm'],
            // fallback: () => { console.log('解析失败') },
            mainFiles: 'index',
            // plugins: [],
            // symlinks: false,
            // restirctions: [],
        },
        optimization: {
            emitOnErrors: true,
            minimize: isProd,
            // nodeEnv: '',
            runtimeChunk: 'single',
            usedExports: true,
        },
        plugins: [
            new MiniCssExtractPlugin(),
            new OptimizeCssAssetsPlugin(),
            new HtmlWebpackPlugin({
                template: 'src/index.html'
            }),
            // new ESLintPlugin({fix: true}), // 启动自动修复功能，会更改源文件。
            new WorkboxPlugin.GenerateSW({
                clientsClaim: true,
                skipWaiting: true,
            })
        ],
        externals: [],
        stats: {
            assets: true,
            colors: true,
            errors: true,
            errorDetails: true,
            hash: true,
        },
        // target: 'web'
        watch: isProd,
        watchOptions: {
            number: 800,
            ignored: ['**/node_modules'],
            poll: 1200,
            // followSymlinks: false,
        },
        performance: {
            maxAssetSize: 250000,
            maxEntrypointSize: 250000,
        },
    }
}