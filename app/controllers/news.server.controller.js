/**
 *@description: 资讯 controller
 *@author: Sulfer
 *@date: 2/1 0001
 */
var mongoose = require("mongoose");
var News = mongoose.model("News");
var is = require("is");
var formatter = require("../../tools/formatDate.js").format;
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

function getNewsById(id,callback) {
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
            _news.createDate = formatter(_news.createDate);
            _news.modifyDate = formatter(_news.modifyDate);
            for(var i = 0; i < _news.comments.length; i ++) {
                _news.comments[i].date = formatter( _news.comments[i].date);
            }
        } // 格式化时间
        callback(null, _news);
    });

}
module.exports = {
    add: add,
    modify: modify,
    remove: remove,
    getNews: getNews
};
