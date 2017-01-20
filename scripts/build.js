process.env.NODE_ENV = 'production';

var webpack = require('webpack');
var config = require('./webpack.config');

webpack(config)
    .run(() => {
        console.log('build complete!');
    });
