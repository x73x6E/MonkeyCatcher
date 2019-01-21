'use strict'

let path = require('path')

module.exports = {
    entry: './game.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'dist.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        overlay: true
    }
}