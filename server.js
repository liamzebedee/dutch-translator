const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);
var proxy = require('http-proxy-middleware');


// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

const BACKEND = 'http://0.0.0.0:5000/'
app.use('/backend',
    proxy({
        target: BACKEND,
        changeOrigin: true,
        pathRewrite: {
            '^/backend' : '/',
        }
    })
)

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});