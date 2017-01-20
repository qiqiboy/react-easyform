process.env.NODE_ENV = 'development';

var chalk = require('chalk');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var historyApiFallback = require('connect-history-api-fallback');
var detect = require('detect-port');
var clearConsole = require('react-dev-utils/clearConsole');
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
var openBrowser = require('react-dev-utils/openBrowser');
var prompt = require('react-dev-utils/prompt');
var config = require('./webpack.config');

// Tools like Cloud9 rely on this.
var DEFAULT_PORT = 3000;
var compiler;
var handleCompile;

function setupCompiler(host, port, protocol) {
    compiler = webpack(config, handleCompile);

    compiler.plugin('invalid', function() {
        clearConsole();
        console.log('Compiling...');
    });

    // "done" event fires when Webpack has finished recompiling the bundle.
    // Whether or not you have warnings or errors, you will get this event.
    compiler.plugin('done', function(stats) {
        clearConsole();

        // We have switched off the default Webpack output in WebpackDevServer
        // options so we are going to "massage" the warnings and errors and present
        // them in a readable focused way.
        var messages = formatWebpackMessages(stats.toJson({}, true));
        if (!messages.errors.length && !messages.warnings.length) {
            console.log(chalk.green('编译通过！'));
            console.log();
            console.log('应用已启动:');
            console.log();
            console.log('  ' + chalk.cyan(protocol + '://' + host + ':' + port + '/'));
            console.log();
        }

        // If errors exist, only show errors.
        if (messages.errors.length) {
            console.log(chalk.red('编译失败！！'));
            console.log();
            messages.errors.forEach(message => {
                console.log(message);
                console.log();
            });
            return;
        }

        // Show warnings if no errors were found.
        if (messages.warnings.length) {
            console.log(chalk.yellow('编译有警告产生：'));
            console.log();
            messages.warnings.forEach(message => {
                console.log(message);
                console.log();
            });
            // Teach some ESLint tricks.
            console.log('You may use special comments to disable some warnings.');
            console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
            console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
        }
    });
}

function addMiddleware(devServer) {
    devServer.use(historyApiFallback({
        disableDotRule: true,
        htmlAcceptHeaders: ['text/html']
    }));
    devServer.use(devServer.middleware);
}

function runDevServer(host, port, protocol) {
    var devServer = new WebpackDevServer(compiler, {
        compress: true,
        clientLogLevel: 'none',
        quiet: true,
        watchOptions: {
            ignored: /node_modules/
        },
        hot: true,
        https: protocol === "https",
        host: host
    });

    addMiddleware(devServer);

    // Launch WebpackDevServer.
    devServer.listen(port, (err, result) => {
        if (err) {
            return console.log(err);
        }

        clearConsole();
        console.log(chalk.cyan('正在启动服务...'));
        console.log();
        openBrowser(protocol + '://' + host + ':' + port + '/');
    });
}

function run(port) {
    var protocol = process.env.HTTPS === 'true' ? "https" : "http";
    var host = 'localhost';
    setupCompiler(host, port, protocol);
    runDevServer(host, port, protocol);
}

detect(DEFAULT_PORT).then(port => {
    if (port === DEFAULT_PORT) {
        run(port);
        return;
    }

    clearConsole();
    var question =
        chalk.yellow('端口被占用： ' + DEFAULT_PORT + '.') +
        '\n\n要换一个端口运行本程序吗？';

    prompt(question, true).then(shouldChangePort => {
        if (shouldChangePort) {
            run(port);
        }
    });
});
