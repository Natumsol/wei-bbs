/**
 *@description: 资讯 controller
 *@author: Sulfer
 *@date: 2/1 0001
 */
var mongoose = require("mongoose");
var News = mongoose.model("News");
var is = require("is");
var formatter = require("../../tools/formatDate.js").format;
var chalk = require("chalk");
var moment = require("moment");
var async = require("async");
var fs = require("fs-extra");
var path = require("path");
var config = require("../../config/config");
var xss =  require("xss");
var myxss = new xss.FilterXSS(config.xss);
function add(req, res, next) {
    var news = new News(req.body);
    //news.author = req.session.user
    news.save(function(err, news){
        if (err) {
            res.json({
                errInfo: err.message,
                status: 0
            });
        }
        else {
            if(news.sliderImg) {
                var oriFile = config.statics + "/uploads/temp/" + path.parse(news.sliderImg).base;
                var targetFile = config.statics + "/uploads/images/" + path.parse(news.sliderImg).base;
                fs.move(oriFile, targetFile, function(err) {
                    if (err) return console.error(err)
                    console.log(oriFile + " move success!");
                });
            }
            res.json({status: 1, id: news._id});
        }
    });
}

function remove(req, res, next){
    var ids = req.body.id;
    if(!is.array(ids)) {
        ids = [ids];
    }
    async.each(ids, function(id, callback){
        News.findOneAndRemove({_id: id}, function(err, news){
            callback(err, news);
        });
    }, function(err){
        if (err) {
            res.json({
                errInfo: err.message,
                status: 0
            });
        }
        else {
            res.json({status: 1});
        }
    });
}

function modify(req, res, next){
    var news = new News(req.body);
    var id = req.body.id;
    News.findOneAndUpdate({_id: id}, {
        title: myxss.process(news.title),
        content: myxss.process(news.content),
        modifyDate: news.modifyDate,
        sliderImg: news.sliderImg,
        isSlider: news.isSlider
    },function (err, news) {
        if (err) {
            res.json({
                errInfo: "update error",
                status: 0
            })
        } else {
            if(news.sliderImg) {
                var oriFile = config.statics + "/uploads/temp/" + path.parse(news.sliderImg).base;
                var targetFile = config.statics + "/uploads/images/" + path.parse(news.sliderImg).base;
                fs.move(oriFile, targetFile, function(err) {
                    if (err) return console.error(err)
                    console.log(oriFile + " move success!");
                });
            }
            res.json({
                status: 1,
                id: news._id
            })
        }
    })
}

function getNews(req, res, next) {
    var start = parseInt(req.body.start) || 0;
    var limit = parseInt(req.body.limit) || 10;
    var keyword = new RegExp(req.body.keyword || "", "i");
    if (!is.integer(start) || !is.integer(limit)) {
        res.json({
            errInfo: "param error",
            status: 0
        })
    }
    else {
        var options = [{path: 'author', select: 'nickname headimgurl -_id'}];
        News.find({title: keyword}).select("title createDate").skip(start).sort({createDate: -1}).limit(limit).populate(options).exec(function (err, news) {
            news = news.map(function(value){
                return value.toObject();
            });
            for(var i = 0; i < news.length; i ++) {
                news[i].createDate = moment(news[i].createDate).format("YYYY-MM-DD HH:mm:ss");
            }
            res.json({news: news});
        });  //  分页查询
    }
}


function getNewsById(id, callback) {
    var options = [{path: 'author'}];
    News.findOneAndUpdate({_id: id}, {$inc:{viewCount: 1}}, function(err){
        if(err) throw(err);
        else {
            console.log(chalk.green("article's viewCount update ok!"));
        }
    });

    News.findOne({_id: id}).populate(options).exec(function (err, news) {

        callback(null, news);
    });

}

function getSliderNews(callback){
    News.find({isSlider: true}, function(err, news){
        callback(err, news);
    })
}

function getIndexNews(callback) {
    News.find().sort({createDate: -1}).limit(4).exec(function(err, news){
        news = news.map(function(value){
            return value.toObject();
        });
        for(var i = 0 ; i < news.length; i ++){
            news[i].createDate = moment(news[i].createDate).format("YYYY-MM-DD HH:mm:ss");
        }
        callback(err, news);
    });
}

function getNextNews(news, callback){
    News.find({createDate:{$lt: news.createDate}}).sort({createDate: -1}).limit(1).exec(function(err, news){
        callback(err, news);
    });
}
function getPrevNews(news, callback){
    News.find({createDate:{$gt: news.createDate}}).sort({createDate: 1}).limit(1).exec(function(err, news){
        callback(err, news);
    });
}

module.exports = {
    add: add,
    modify: modify,
    remove: remove,
    getNews: getNews,
    getNewsById: getNewsById,
    getSliderNews: getSliderNews,
    getIndexNews: getIndexNews,
    getPrevNews: getPrevNews,
    getNextNews: getNextNews
};
