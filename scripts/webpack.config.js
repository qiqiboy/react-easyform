var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

var resolvePath = function(_path) {
    return path.resolve('example', _path);
}

var isDev = process.env.NODE_ENV == 'development';


module.exports = {
    entry: [
        require.resolve('react-dev-utils/webpackHotDevClient'),
        resolvePath('app/index.js')
    ],
    output: {
        pathinfo: true,
        path: resolvePath('build'),
        filename: 'static/js/[name].[hash:8].js'
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '']
    },

    module: {
        preLoaders: [{
            test: /\.(js|jsx)$/,
            loader: 'eslint',
            include: resolvePath('app')
        }],
        loaders: [
            {
                test: /\.(js|jsx)$/,
                include: [resolvePath('app'), resolvePath('../src')],
                loader: 'babel',
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.s[ac]ss$/,
                loader: 'style!css?importLoaders=2!sass!postcss'
            }
        ]
    },

    postcss: function() {
        return [
            autoprefixer({
                browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                ]
            }),
        ];
    },

    plugins: process.env.NODE_ENV == 'development' ? [
        new HtmlWebpackPlugin({
            inject: true,
            template: resolvePath('index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ] : [
        new HtmlWebpackPlugin({
            inject: true,
            template: resolvePath('index.html')
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        // Try to dedupe duplicated modules, if any:
        new webpack.optimize.DedupePlugin(),
        // Minify the code.
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true, // React doesn't support IE8
                warnings: false
            },
            mangle: {
                screw_ie8: true
            },
            output: {
                comments: false,
                screw_ie8: true
            }
        })
    ]
};
