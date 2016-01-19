/**
 *@description: article controller
 *@author: LiuJ
 *@date: 2016/1/11
 */

var mongoose = require("mongoose");
var Article = mongoose.model("Article");
var Comment = mongoose.model("Comment");
var Column = mongoose.model("Column");
var Like = mongoose.model("Like");
var User = mongoose.model("User");
var is = require("is");
var formatter = require("../../tools/formatDate.js").format;

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
            Column.findOne({_id: article.column},{$inc:{}}, function (err, column) {

            });
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
function getArticleById(id, isReverse, onlyAuthor,callback) {
    var options = [{path: 'comments'}, {path: 'author'}, {path: "column"}];
    Article.findOne({_id: id}).populate(options).exec(function (err, article) {
        Article.populate(article, [{
            path: 'comments.author',
            model: "User"
        }], function (err, article) {
            if (err) callback(err);
            var _article = article.toObject();
            if(article) {
                _article.createDate = formatter(_article.createDate);
                _article.modifyDate = formatter(_article.modifyDate);
                for(var i = 0; i < _article.comments.length; i ++) {
                    _article.comments[i].date = formatter( _article.comments[i].date);
                }
                console.log(_article);
            } // 格式化时间
            callback(null, _article);
        });
    });
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function getArticlesByColumn(req, res, next) {
    var column = req.body.column;
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
        Article.find({column: column}).sort({createDate: -1}).skip(start).limit(limit).populate(options).exec(function (err, articles) {
            Article.populate(articles, [{
                path: 'comments.author',
                model: "User",
                select: 'nickname headimgurl'
            }], function (err, articles) {
                for(var i = 0; i < articles.length; i ++) {
                    articles[i].content = articles[i].content.substr(0, 400) + "...";
                }
                res.json({articles: articles});
            });
        });
    }

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
        Article.find().skip(start).sort({createDate: -1}).limit(limit).populate(options).exec(function (err, articles) {
            Article.populate(articles, [{
                path: 'comments.author',
                model: "User",
                select: 'nickname headimgurl'
            }], function (err, articles) {
                for(var i = 0; i < articles.length; i ++) {
                    articles[i].content = articles[i].content.substr(0, 400) + "...";
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
    getArticlesByColumn: getArticlesByColumn,
    remove: remove,
    getArticleById: getArticleById,
    addComment: addComment,
    deleteComment: deleteComment,
    like: like,
    getArticles:getArticles
};