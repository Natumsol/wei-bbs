/**
 *@description: article router
 *@author: LiuJ
 *@date: 2016/1/11
 */
var article = require("../controllers/article.server.controller.js");
var column = require("../controllers/column.server.controller.js");
var weixinAuth = require("../controllers/user.server.controller.js");
module.exports = function (app) {
    var nameSpace = "/article";
    app.post(nameSpace + "/add", weixinAuth.checkAuth, article.add);
    app.post(nameSpace + "/modify", weixinAuth.checkAuth, article.modify);
    app.post(nameSpace + "/delete", weixinAuth.checkAuth, article.remove);
    app.post(nameSpace + "/getArticlesByColumn", weixinAuth.checkAuth, article.getArticlesByColumn);
    app.post(nameSpace + "/getArticles", weixinAuth.checkAuth, article.getArticles);
    app.post(nameSpace + "/addComment", weixinAuth.checkAuth, article.addComment);
    app.post(nameSpace + "/deleteComment", weixinAuth.checkAuth, article.deleteComment);
    app.post(nameSpace + "/like", weixinAuth.checkAuth, article.like);
    app.get(nameSpace + "/view",weixinAuth.checkAuth, function(req, res, next){
        var id = req.query.id || "";
        var isReverse = parseInt(req.query.isReverse) || 0;
        var onlyAuthor =  parseInt(req.query.onlyAuthor) || 0;
        article.getArticleById(id,isReverse, onlyAuthor,function(err, article){
            if(err) res.send(err.message);
            else if(article) {
                res.render("viewArticle", {
                    article:article,
                    user: req.session.user
                });
            } else {
                next();
            }

        });

    });
    app.get(nameSpace + "/add", weixinAuth.checkAuth, function(req, res, next){
        column.getAllColumns(function(err, columns){
            if(err) throw err;
            else if(columns.length) {
                res.render("addArticle", {
                    user: req.session.user,
                    columns: columns
                });
            } else {
                next();
            }

        })

    });
    app.get(nameSpace + "/modify", weixinAuth.checkAuth, function(req, res, next){
        var id = req.query.id || "";
        var isReverse = parseInt(req.query.isReverse) || 0;
        var onlyAuthor =  parseInt(req.query.onlyAuthor) || 0;
        article.getArticleById(id,isReverse, onlyAuthor,function(err, article){
            if(err) res.send(err.message);
            else if(article) {
                column.getAllColumns(function(err, columns){
                    if(err) throw err;
                    res.render("modifyArticle", {
                        article:article,
                        columns: columns,
                        user: req.session.user
                    });
                })
            } else {
                next();
            }

        });

    });
};