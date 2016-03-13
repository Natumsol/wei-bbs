process.env.NODE_ENV = process.env.NODE_ENV || "development";
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var express = require("./config/express");
var db = require("./config/mongoose.js")();
var config = require("./config/config.js");
var app = express();
// 启动应用并开启监听端口
if (cluster.isMaster) {
    console.log('宿主启动...');

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('listening', function (worker, address) {
        console.log('核心' + i + ' pid:' + worker.process.pid);
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log('核心' + i + ' pid:' + worker.process.pid + ' 重启');
        setTimeout(function () {
            cluster.fork();
        }, 2000);
    });
} else if (cluster.isWorker){
    app.listen(config.port);
}
//app.listen(80);
module.exports = app;
console.log("Server running at http://localhost: " + config.port + "\nusing version: " + process.env.NODE_ENV);
