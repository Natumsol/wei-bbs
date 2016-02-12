/**
 *@description:统计分析
 *@author: Sulfer
 *@date: 2/9 0009
 */
var mongoose = require("mongoose");
var Visitor = mongoose.model("Visitor");
var User = mongoose.model("User");
var News = mongoose.model("News");
var Product = mongoose.model("Product");
var Article = mongoose.model("Article");
var getRequestInfo = require("../../tools/getRequestInfo.js");
var moment = require("moment");
var async = require("async");
function doStatistics(req, res, next){
    if(!/\/css|js|img|plugins|uploads|font|test|view\//.test(req.url)) {
        var visitor = new Visitor(getRequestInfo.getUserInformation(req));
        //visitor.date = new Date(moment(new Date()).format("YYYY-MM-DD"));
        visitor.date = new Date("2016-02-" + parseInt((Math.random() * 30) % 30));
        visitor.save(function (err) {
            if (err) throw err;
            else {
                console.log("visitor save ok!");
            }
        });
    }
    next();
}

function getVisitors(req, res, next){
    var dateStart = new Date(req.body.date || Date.now());
    var dateEnd = new Date(dateStart.getFullYear() + "-" + (dateStart.getMonth() + 2));
    Visitor.find({date:{$gt:dateStart, $lt:dateEnd}}).exec(function(err, visitors){
        visitors = visitors.map(function(value){
            return value.toObject();
        });
        var result = {};
        for(var i = 0; i < visitors.length; i ++) {
            var day = moment(visitors[i].date).format("D");
            if(result[day] != undefined) {
                result[day] ++
            } else {
                result[day] = 1;
            }
        }
        var label = [], data = [];
        for(var i in result) {
            if(result.hasOwnProperty(i)) {
                label.push(i);
                data.push(result[i]);
            }
        }
        res.json({label: label, data:data});
    });
}

function getTotalVisit(callback){
    Visitor.count(function(err, count){
        callback(err, count);
    })
}
function getTotalUser(callback){
    User.count(function(err, count){
        callback(err, count);
    })
}
function getTotalArticle(callback){
    Article.count(function(err, count){
        callback(err, count);
    })
}
function getTotalProduct(callback){
    Product.count(function(err, count){
        callback(err, count);
    })
}
function getTotalNews(callback){
    News.count(function(err, count){
        callback(err, count);
    })
}

function getIndexInfo(callback){
    var tasks = [getTotalVisit, getTotalUser, getTotalArticle, getTotalProduct, getTotalNews];
    async.parallel(tasks, function(err, result){
        callback(err, result);
    })
}

function getAndroid(callback){
    Visitor.where("os","Android").count(function(err, count){
        callback(err, count);
    })
}

function getWindows(callback){
    Visitor.where("os","Windows").count(function(err, count){
        callback(err, count);
    })
}
function getLinux(callback){
    Visitor.where("os","Linux").count(function(err, count){
        callback(err, count);
    })
}

function getIOS(callback){
    Visitor.where("os","iOS").count(function(err, count){
        callback(err, count);
    })
}

function getPieData(callback) {
    var tasks = [getAndroid, getIOS, getWindows, getLinux];
    async.parallel(tasks, function(err, result){
        callback(err, result);
    })
}
module.exports = {
    doStatistics: doStatistics,
    getVisitors:getVisitors,
    getIndexInfo:getIndexInfo,
    getPieData: getPieData
};