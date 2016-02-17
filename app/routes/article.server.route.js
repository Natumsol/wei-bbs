/**
 *@description: article router
 *@author: LiuJ
 *@date: 2016/1/11
 */
var article = require("../controllers/article.server.controller.js");
var weixinAuth = require("../controllers/user.server.controller.js");
var multer = require('multer');
var crypto = require('crypto');
var mime = require("mime");
var fs = require('fs-extra');
var path = require("path");
var config = require("../../config/config");

/** 上传配置信息 **/
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = config.statics + "/uploads/temp/";
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
    var nameSpace = "/bbs";
    app.post(nameSpace + "/add", weixinAuth.checkAuth, article.add);
    app.post(nameSpace + "/modify", weixinAuth.checkAuth, article.modify);
    app.post(nameSpace + "/delete", weixinAuth.checkAuth, article.remove);
    app.post(nameSpace + "/getArticles", weixinAuth.checkAuth, article.getArticles);
    app.post(nameSpace + "/addComment", weixinAuth.checkAuth, article.addComment);
    app.post(nameSpace + "/deleteComment", weixinAuth.checkAuth, article.deleteComment);
    app.post(nameSpace + "/like", weixinAuth.checkAuth, article.like);
    app.get(nameSpace, weixinAuth.checkAuth, function (req, res, next) {
       res.render("bbs/list", {
           user: req.session.user
       });
    });
    app.get(nameSpace + "/view",weixinAuth.checkAuth, function(req, res, next){
        var id = req.query.id || "";
        article.getArticleById(id, function(err, article){
            if(err) res.send(err.message);
            else if(article) {
                res.render("bbs/view", {
                    article:article,
                    user: req.session.user
                });
            } else {
                next();
            }

        });

    });

    app.get(nameSpace + "/add", weixinAuth.checkAuth, function(req, res, next){
        res.render("bbs/add", {
            user: req.session.user
        });
    });

    app.get(nameSpace + "/modify", weixinAuth.checkAuth, function(req, res, next){
        var id = req.query.id || "";
        var isReverse = parseInt(req.query.isReverse) || 0;
        var onlyAuthor =  parseInt(req.query.onlyAuthor) || 0;
        article.getArticleById(id, function(err, article){
            if(err) res.send(err.message);
            else if(article) {
                res.render("bbs/modify", {
                    article:article,
                    user: req.session.user
                });
            } else {
                next();
            }

        });

    });
    var cpUpload = upload.fields([{ name: 'myImage', maxCount: 1 }, { name: 'upload', maxCount: 1 }])
    app.post("/upload", cpUpload, function(req, res, next){
        if(req.files['myImage']) {
            var file = req.files['myImage'][0];
            var result;
            if(file) {
                result = "/uploads/images/" + file.filename;
            } else {
                result = 'error|save error';
            }
            res.setHeader('Content-type','text/html');
            res.send(result);
        } else if(req.files['upload']) {
            var file = req.files['upload'][0];
            var result;
            if(file) {
                var url = "/uploads/images/" + file.filename;
                result = "<span style='font-size: 12px'>图片地址为: <a href='" + url + "'>" + url + "</a></span>";
            } else {
                result = 'error|save error';
            }
            var oriFile = "public/uploads/temp/" + file.filename;
            var targetFile = "public/uploads/images/" + file.filename;
            fs.move(oriFile, targetFile, function (err) {
                if (err) {
                    return console.error(err)
                } else{
                    res.setHeader('Content-type','text/html');
                    res.send(result);
                }
            });

        } else {
            next();
        }

    });

    app.get("/upload", function(req, res){
        res.render("upload");
    })
};