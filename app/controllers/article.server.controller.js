/**
 *@description: article controller
 *@author: LiuJ
 *@date: 2016/1/11
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Article = mongoose.model("Article");
var Comment = mongoose.model("Comment");
var is = require("is");

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
                errInfo: "add failed!",
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
    Article.findOneAndUpdate({_id: id}, function (err, article) {
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
function getArticleById(id, callback) {
    Article.findOne({_id: id}, function (err, article) {
        if (err) callback(err);
        callback(null, article);
    })
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function list(req, res, next) {
    var start = req.body.start;
    var limit = req.body.limit || 10;
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
    comment.author = req.session.user.openid;
    comment.save(function (err, comment) {
        if (err) {
            res.json({
                errInfo: "save comment failed!",
                status: 0
            });
        } else {
            Article.findOne({_id: articleId}, function (err, article) {
                if (err) {
                    res.json({
                        errInfo: "find article error!",
                        status: 0
                    });
                } else {
                    article.comments.push(comment._id);
                    article.save(function (err) {
                        if (err) {
                            res.json({
                                errInfo: "article update failed!",
                                status: 0
                            });
                        } else {
                            res.json({
                                status: 1
                            })
                        }
                    });
                }
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
    var articleId = req.body.id;
    var author = req.session.user.openid;
    Article.findOne({_id: articleId}, function (err, article) {
        if (err) {
            res.json({
                errInfo: err.message,
                status: 0
            });
        } else {
            article.likes.push(author);
            article.save(function (err) {
                if (err) {
                    res.json({
                        errInfo: err.message,
                        status: 0
                    });
                } else {
                    res.json({
                        status: 1
                    })
                }
            })
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
    like: like
};