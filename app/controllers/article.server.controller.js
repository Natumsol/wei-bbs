/**
 *@description: article controller
 *@author: LiuJ
 *@date: 2016/1/11
 */

var mongoose = require("mongoose");
var Article = mongoose.model("Article");
var Comment = mongoose.model("Comment");
var User = mongoose.model("User");
var is = require("is");
var chalk = require("chalk");
var formatter = require("../../tools/formatDate.js").format;
var fs = require('fs-extra')
var path = require("path");
var moment = require("moment");
var config = require("../../config/config");
var async = require("async");
var xss =  require("xss");
var myxss = new xss.FilterXSS(config.xss);
/**
 *
 * @param req
 * @param res
 * @param next
 */
function add(req, res, next) {
    var article = new Article(req.body);
    article.author = req.session.user._id;
    article.save(function (err, article) {
        if (err) {
            res.json({
                errInfo: err.message,
                status: 0
            });
        }
        else {
            for(var i = 0; i < article.images.length; i ++) {
                var oriFile = config.statics + "/uploads/temp/" + path.parse(article.images[i]).base;
                var targetFile = config.statics + "/uploads/images/" + path.parse(article.images[i]).base;
                fs.move(oriFile, targetFile, function(err) {
                    if (err) return console.error(err)
                    console.log(oriFile + " move success!");
                })
            }
            res.json({status: 1, id: article._id});
        }
    });
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function modify(req, res, next) {
    var article = new Article(req.body);
    var id = req.body.id;
    Article.findOneAndUpdate({_id: id}, {
        title: myxss.process(article.title),
        content: myxss.process(article.content),
        modifyDate: article.modifyDate,
        images: article.images,
        isTop: article.isTop
    }, function (err, article) {
        if (err) {
            res.json({
                errInfo: "update error",
                status: 0
            })
        } else {
            for(var i = 0; i < article.images.length; i ++) {
                var oriFile = config.statics + "/uploads/temp/" + path.parse(article.images[i]).base;
                var targetFile = config.statics + "/uploads/images/" + path.parse(article.images[i]).base;
                fs.move(oriFile, targetFile, function(err) {
                    if (err) return console.error(err)
                    console.log(oriFile + " move success!");
                })
            }
            res.json({
                status: 1,
                id: article._id
            })
        }
    })
}

/**
 *
 * @param id
 * @param callback
 */
function getArticleById(id, callback) {
    var options = [{path: 'comments'}, {path: 'author'}, {path: "column"}];
    /*Article.findOneAndUpdate({_id: id}, {$inc:{viewCount: 1}}, function(err){
        if(err) throw(err);
        else {
            console.log(chalk.green("article's viewCount update ok!"));
        }
    });*/
    Article.findOne({_id: id}).populate(options).exec(function (err, article) {
        Article.populate(article, [{
            path: 'comments.author',
            model: "User"
        }], function (err, article) {
            if (err) callback(err);
            else {
                if(article){
                    article = article.toObject();
                    article.createDate = moment(article.createDate).format("YYYY-MM-DD HH:mm:ss");
                    for(var i = 0 ; i < article.comments.length; i ++) {
                        article.comments[i].date =  moment(article.comments[i].date).format("YYYY-MM-DD HH:mm:ss");
                    }
                }
                callback(null, article);
            }
        });
    });

}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function getArticles(req, res, next) {
    var start = parseInt(req.body.start);
    var limit = parseInt(req.body.limit) || 10;
    if (!is.integer(start) || !is.integer(limit)) {
        res.json({
            errInfo: "param error",
            status: 0
        })
    }
    else {
        var options = [{path: 'comments'}, {path: 'likes'}, {path: 'author', select: 'nickname headimgurl -_id'}];
        Article.find().skip(start).sort({isTop: -1, createDate: -1}).limit(limit).populate(options).exec(function (err, articles) {
            Article.populate(articles, [{
                path: 'comments.author',
                model: "User",
                select: 'nickname headimgurl'
            }], function (err, articles) {
                articles = articles.map(function(value){
                    return value.toObject();
                });
                for(var i = 0; i < articles.length; i ++) {
                    articles[i].content = articles[i].content.substr(0, 400) + "...";
                    articles[i].createDate = moment(articles[i].createDate).format("YYYY-MM-DD HH:mm:ss");
                }
                res.json({articles: articles});
            });
        });  //  分页查询
    }


}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function remove(req, res, next) {
    var ids = req.body.id;
    if(!is.array(ids)) {
        ids = [ids];
    }
    async.each(ids, function(id, callback){
        Article.findOneAndRemove({_id: id}, function(err, article){
            for(var i = 0; i < article.comments.length; i ++) {
                Comment.findOneAndRemove({_id:article.comments[i]}, function(err){
                    if(err) throw(err);
                    else {
                        console.log("delete comments ok!");
                    }
                });
            }
            callback(err, article);
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

/**
 *
 * @param req
 * @param res
 * @param next
 */
function addComment(req, res, next) {
    var comment = new Comment(req.body);
    var articleId = req.body.id;
    comment.author = req.session.user._id;
    comment.save(function (err, comment) {
        if (err) {
            res.json({
                errInfo: err.message,
                status: 0
            });
        } else {
            Article.findOneAndUpdate({_id: articleId}, {$push: {"comments": comment._id}}, function (err, article) {
                if (err) {
                    res.json({
                        errInfo: "article update failed!",
                        status: 0
                    });
                } else {
                    res.json({
                        status: 1
                    });
                }
            });
        }
    });
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function deleteComment(req, res, next) {
    var id = req.body.id;
    Comment.findOneAndRemove({_id: id}, function (err, comment) {
        if (err) {
            res.json({
                errInfo: "delete failed!",
                status: 0
            });
        } else {
            res.json({
                status: 1
            });
        }
    });
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function like(req, res, next) {
    var like = new Like(req.body);
    var articleId = req.body.id;
    like.author = req.session.user._id;
    like.save(function (err, like) {
        if (err) {
            res.json({
                errInfo: err.message,
                status: 0
            });
        } else {
            Article.findOneAndUpdate({_id: articleId}, {$addToSet: {"likes": like._id}}, function (err) {
                if (err) {
                    res.json({
                        errInfo: "article update failed!",
                        status: 0
                    });
                } else {
                    res.json({
                        status: 1
                    });
                }
            });
        }
    });
}

function getNextArticle(article, callback){
    Article.find({createDate:{$lt: article.createDate}}).sort({createDate: -1}).limit(1).exec(function(err, article){
        callback(err, article);
    });
}
function getPrevArticle(article, callback){
    Article.find({createDate:{$gt: article.createDate}}).sort({createDate: 1}).limit(1).exec(function(err, article){
        callback(err, article);
    });
}
module.exports = {
    add: add,
    modify: modify,
    remove: remove,
    getArticleById: getArticleById,
    addComment: addComment,
    deleteComment: deleteComment,
    like: like,
    getArticles:getArticles,
    getPrevArticle: getPrevArticle,
    getNextArticle: getNextArticle
};