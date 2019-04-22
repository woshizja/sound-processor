/* eslint-disable no-unused-vars */
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function walk(_path) {
    const entries = [];
    const dirList = fs.readdirSync(_path);

    for (var i = 0; i < dirList.length; i++) {
        if(/^\./.test(dirList[i])) {
            // 不处理隐藏文件
            continue;
        }
        const subPage = _path + '/' + dirList[i];

        if (!fs.statSync(subPage).isDirectory()) {
            // 只处理目录
            continue;
        }
       
        // 认为应该有 index.html 和 index.js
        const htmlkPath = subPage + '/index.html';
        const indexPath = subPage + '/index.js';

        try {
            if (!fs.statSync(htmlkPath).isFile() || !fs.statSync(indexPath).isFile()) {
                continue;
            }
        } catch(e) {
            continue;
        }
        
        
        entries.push({
            entry: indexPath,
            view: htmlkPath,
            name: dirList[i]
        });
    }
    return entries;
}

module.exports = () => {
    const WEBPACK_CONFIG = {
        entry: {
            "index.min.js": './src/index.js'
        },
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
                exclude: /(node_modules)/
            },
            {
                test: /\.(less|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            // eslint-disable-next-line
                            plugins: () => [require('autoprefixer')({
                            browsers: ['Android >= 4', 'iOS >=9']
                            })]
                        }
                    }, {
                        loader: 'less-loader',
                        options: {
                            strictMath: true,
                            noIeCompat: true
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: [{
                    loader: 'babel-loader'
                },
                {
                    loader: 'react-svg-loader',
                    options: {
                        jsx: true,
                        svgo: {
                            plugins: [{
                                removeTitle: true
                            }, {
                                cleanupIDs: false
                            }],
                            floatPrecision: 2
                        }
                    }
                }
                ]
            }
            ]
        },

        plugins: [],

        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /\/node_modules\/|\/lib\/|\/app\/css\//,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        },

        resolve: {
            extensions: ['.js', '.jsx', '.json', '.less', '.css'],
            alias: {
                '@common': path.resolve(__dirname, '../example/common'),
                '@sound-processor': path.resolve(__dirname, '../src/index.js')
            }
        }
    };

    /**
     * 多入口处理
    */
    const entries = walk(path.resolve(__dirname, '../example/'));
    entries.forEach((page) => {
        WEBPACK_CONFIG.entry[page.name] = page.entry;

        WEBPACK_CONFIG.plugins.push(
            new HtmlWebpackPlugin({
                title: `${page.name}`,
                template: page.view,
                filename: `${page.name}.html`,
                inject: true,
                chunks: ['runtime', 'vendors', 'main', page.name],
            })
        );
    });


    return WEBPACK_CONFIG;
};
