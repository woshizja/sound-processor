const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const common = require('./webpack.common');

/**
 * 测试环境和线上配置
 */
module.exports = (env) => {
    return merge(common(env), {
        mode: 'production',
        output: {
            path: path.resolve(__dirname, '../public'),
            filename: '[name].[chunkhash:8].js',
            chunkFilename: '[name].[chunkhash:8].js',
            publicPath: '/sound-processor/public'
        },
        module: {
            rules: [
                {
                    test: /\.(png|jpg|gif|mp3|json|dae)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[hash].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:8].css'
            }),
            new webpack.HashedModuleIdsPlugin(),
            new InlineManifestWebpackPlugin()
        ],
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        }
    });
};
