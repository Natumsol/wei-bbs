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
            res.json({status: 1, id: news._id});
        }
    });
}

function remove(req, res, next){
    var id = req.body.id;
    News.findOneAndRemove({_id: id}, function(err, news){
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
        title: news.title,
        content: news.content,
        modifyDate: news.modifyDate
    }, function (err, news) {
        if (err) {
            res.json({
                errInfo: "update error",
                status: 0
            })
        } else {
            res.json({
                status: 1,
                id: news._id
            })
        }
    })
}

function getNews(req, res, next) {
    var start = parseInt(req.body.start);
    var limit = parseInt(req.body.limit) || 10;
    if (!is.integer(start) || !is.integer(limit)) {
        res.json({
            errInfo: "param error",
            status: 0
        })
    }
    else {
        var options = [{path: 'author', select: 'nickname headimgurl -_id'}];
        News.find().skip(start).sort({createDate: -1}).limit(limit).populate(options).exec(function (err, news) {
            for(var i = 0; i < news.length; i ++) {
                news[i].content = news[i].content.substr(0, 400) + "...";
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
        var _news;
        if(news) {
            _news = news.toObject();
            _news.date = formatter(_news.date);

        } // 格式化时间
        callback(null, _news);
    });

}

function getSliderNews(callback){
    News.find({isSlider: true}, function(err, news){
        callback(err, news);
    })
}

function getIndexNews(callback) {
    News.find().sort({createDate: -1}).limit(10).exec(function(err, news){
        news = news.map(function(value){
            return value.toObject();
        });
        for(var i = 0 ; i < news.length; i ++){
            news[i].createDate = moment(news[i].createDate).format("YYYY-MM-DD");
        }
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
    getIndexNews: getIndexNews
};
