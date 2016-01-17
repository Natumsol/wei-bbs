/**
 *@description: article controller
 *@author: LiuJ
 *@date: 2016/1/11
 */

var mongoose = require("mongoose");
var Article = mongoose.model("Article");
var Comment = mongoose.model("Comment");
var Like = mongoose.model("Like");
var User = mongoose.model("User");
var is = require("is");
var formatter = require("../../tools/formatDate.js").format;
function getInputPromise(){
    return defer.promise;
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function add(req, res, next) {
    var article = new Article(req.body);
    article.author = req.session.user.openid;
    article.save(function (err, article) {
        if (err) {
            res.json({
                errInfo: err.message,
                status: 0
            });
        }
        else {
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
        title: article.title,
        content: article.content,
        modifyDate: article.modifyDate,
        column: article.column
    }, function (err, article) {
        if (err) {
            res.json({
                errInfo: "update error",
                status: 0
            })
        } else {
            res.json({
                status: 1
            })
        }
    })
}

/**
 *
 * @param id
 * @param callback
 */
function getArticleById(id, isReverse, onlyAuthor,callback) {
    var options = [{path: 'comments'}, {path: 'author'}];
    Article.findOne({_id: id}).populate(options).exec(function (err, article) {
        Article.populate(article, [{
            path: 'comments.author',
            model: "User"
        }], function (err, article) {
            if (err) callback(err);
            callback(null, article);
        });
    });

}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function list(req, res, next) {
    var start = parseInt(req.body.start);
    var limit = parseInt(req.body.limit) || 10;
    if (!is.integer(start) || !is.integer(limit)) {
        res.json({
            errInfo: "param error",
            status: 0
        })
    }

    //  分页查询
    Article.find().skip(start).limit(limit).exec(function (err, articles) {
        if (err) {
            res.json({
                errInfo: "数据库查询出错",
                status: 0
            })
        }
        res.json(articles);
    });

}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function list_index(req, res, next) {
    var start = parseInt(req.body.start);
    var limit = parseInt(req.body.limit) || 10;
    if (!is.integer(start) || !is.integer(limit)) {
        res.json({
            errInfo: "param error",
            status: 0
        })
    }

    var options = [{path: 'comments'}, {path: 'likes'}, {path: 'author', select: 'nickname headimgurl -_id'}];
    Article.find().skip(start).limit(limit).populate(options).exec(function (err, articles) {
        Article.populate(articles, [{
            path: 'comments.author',
            model: "User",
            select: 'nickname headimgurl'
        }], function (err, articles) {
            res.json({articles: articles});
        });
    });



    //  分页查询


}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function remove(req, res, next) {
    Article.findOneAndRemove({_id: req.body.id}, function (err, article) {
        if (err) res.json({
            errInfo: "delete error",
            status: 0
        });
        res.json({
            status: 1
        });
    })
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
            Article.findOneAndUpdate({_id: articleId}, {$push: {"comments": comment._id}}, function (err) {
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
            })
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

module.exports = {
    add: add,
    modify: modify,
    list: list,
    remove: remove,
    getArticleById: getArticleById,
    addComment: addComment,
    deleteComment: deleteComment,
    like: like,
    list_index:list_index
};