let webpack = require('webpack');
let htmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let rules = require('./webpack.config.rules')();
let path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin({
                sourceMap: isDev
            })
        ]
    }

    return config
};

rules.push({
    test: /\.css$/,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: isDev,
            }
        }, 'css-loader']
});

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: './index.js',
    },
    optimization: optimization(),
    devServer: {
        index: 'index.html',
        overlay: true
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@images': path.resolve(__dirname, 'src/images'),
        }
    },
    devtool: isDev ? 'source-map' : '',
    module: { rules },
    plugins: [
        new ExtractTextPlugin('css.css'),
        new htmlWebpackPlugin({
            title: 'Proj1-GeoFeedback',
            template: 'templates/index.hbs',
            minify: {
                collapseWhitespace: isProd,
                removeComments: isProd,
                removeRedundantAttributes: isProd,
                removeScriptTypeAttributes: isProd,
                removeStyleLinkTypeAttributes: isProd,
                useShortDoctype: isProd
            }
        }),
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: 'css/[hash].css'
        })
    ]
}
;
