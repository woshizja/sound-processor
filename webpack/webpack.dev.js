const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common');

/**
 * 本地开发配置
 */
module.exports = env => merge(common(env), {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    watch: true,
    devServer: {
        contentBase: path.resolve(__dirname, '../public'),
        host: '0.0.0.0',
        port: '4105',
        disableHostCheck: true,
        compress: true
    },
    output: {
        path: path.resolve(__dirname, '../public'),
        pathinfo: true,
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|mp3|json|dae)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
});
