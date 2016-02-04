/**
 *@description:
 *@author: Sulfer
 *@date: 2/4 0004
 */
var news = require("../controllers/news.server.controller.js");
var weixinAuth = require("../controllers/user.server.controller.js");
var multer = require('multer');
var crypto = require('crypto')
var mime = require("mime");
var fs = require('fs-extra');
var path = require("path");

module.exports = function (app) {
    var nameSpace = "/news";
    app.post(nameSpace + "/add", weixinAuth.isAdmin, news.add);
    app.post(nameSpace + "/modify", weixinAuth.isAdmin, news.modify);
    app.post(nameSpace + "/delete", weixinAuth.isAdmin, news.remove);
    app.post(nameSpace + "/getNews", weixinAuth.isAdmin, news.getNews);
    app.get(nameSpace + "/view", function(req, res, next){
        var id = req.query.id || "";
        news.getNewsById(id, function(err, news){
            if(err) res.send(err.message);
            else if(news) {
                res.render("viewNews", {
                    news:news,
                    user: req.session.user
                });
            } else {
                next();
            }

        });

    });

    app.get(nameSpace + "/add", weixinAuth.isAdmin, function(req, res, next){
        res.render("addNews", {
            user: req.session.user
        });

    });

    app.get(nameSpace + "/modify", weixinAuth.checkAuth, function(req, res, next){
        var id = req.query.id || "";
        news.getNewsById(id, function(err, news){
            if(err) res.send(err.message);
            else if(news) {
                res.render("modifyNews", {
                    news:news,
                    user: req.session.user
                });
            } else {
                next();
            }

        });

    });

    /*app.post("/upload", upload.single('wangEditorMobileFile'), function(req, res){
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
    })*/
};