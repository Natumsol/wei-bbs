/**
 *@description: article router
 *@author: LiuJ
 *@date: 2016/1/11
 */
var article = require("../controllers/article.server.controller.js");
var column = require("../controllers/column.server.controller.js");
var weixinAuth = require("../controllers/user.server.controller.js");
var multer = require('multer');
var crypto = require('crypto')
var mime = require("mime");
var fs = require('fs-extra');
var path = require("path");

/** 上传配置信息 **/
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = "public/uploads/images/";
        fs.ensureDir(dir, function (err) {
           if(err) throw err;
           else cb(null, dir);
        })
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(err, err ? undefined : raw.toString('hex') + '.' + mime.extension(file.mimetype))
        })
    }
});

var upload = multer({ storage: storage }); // 上传中间件

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

    app.post("/upload", upload.single('wangEditorMobileFile'), function(req, res){
        var file = req.file;
        var result;
        if(file) {
            result = "/uploads/images/" + file.filename;

        } else {
            result = 'error|save error';
        }
        res.setHeader('Content-type','text/html');
        res.send(result);
    });

    app.get("/upload", function(req, res){
        res.render("upload");
    })
};