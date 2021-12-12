const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
// const lessToJs = require('less-vars-to-js');
// const fs  = require('fs');

const port = process.env.PORT || 3000;
// const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './ant-theme-vars.less'), 'utf8'));

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.less$/,
                include: /src/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName:
                                    '[name]__[local]___[hash:base64:5]'
                            },
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: { lessOptions: { javascriptEnabled: true } }
                    }
                ]
            },
            // {
            //     test: /\.css$/,
            //     exclude: /node_modules|antd\.css/,
            //     loader: 'typings-for-css-modules-loader?modules&namedExport&camelCase'
            // },
            {
                test: /\.css$/,
                exclude: /node_modules|antd\.css/,
                //include: /src/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localIdentName: '[name]_[local]_[hash:base64]',
                            sourceMap: true,
                            camelCase: true,
                            namedExport: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            // ident: 'postcss',
                            postcssOptions: {
                                plugins: () => [
                                    'postcss-flexbugs-fixes',
                                    autoprefixer({
                                        browsers: [
                                            '>1%',
                                            'last 4 versions',
                                            'Firefox ESR',
                                            'not ie < 9' // React doesn't support IE8 anyway
                                        ],
                                        flexbox: 'no-2009'
                                    })
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                include: /node_modules|antd\.css/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                            // change
                            // modules: true, // new support for css modules
                            // modules: {
                            //     localIdentName:
                            //       '[name]__[local]___[hash:base64:5]'
                            // }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            // ident: 'postcss',
                            postcssOptions: {
                                plugins: () => [
                                    'postcss-flexbugs-fixes',
                                    autoprefixer({
                                        browsers: [
                                            '>1%',
                                            'last 4 versions',
                                            'Firefox ESR',
                                            'not ie < 9' // React doesn't support IE8 anyway
                                        ],
                                        flexbox: 'no-2009'
                                    })
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: 'html-loader',
                include: /src/,
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico'
        }),
        new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            'process.env.REACT_APP_PORT': JSON.stringify(
                process.env.REACT_APP_PORT
            ),
            'process.env.REACT_APP_MQTT_BROKER': JSON.stringify(
                process.env.REACT_APP_MQTT_BROKER
            ),
            'process.env.REACT_APP_MQTT_PORT': JSON.stringify(
                process.env.REACT_APP_MQTT_PORT
            ),
            'process.env.REACT_APP_MQTT_WEBSOCKET_PORT': JSON.stringify(
                process.env.REACT_APP_MQTT_WEBSOCKET_PORT
            )
        }),
    ],
    devServer: {
        host: '0.0.0.0',
        port: port,
        historyApiFallback: true,
        hot: true,
        watchOptions: {
            aggregateTimeout: 0,
            poll: 1000
        },
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json', '.css', '.html'],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    }
};
