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
var moment = require("moment");

module.exports = function (app) {
    var nameSpace = "/news";
    app.post(nameSpace + "/add", weixinAuth.isAdmin, news.add);
    app.post(nameSpace + "/modify", weixinAuth.isAdmin, news.modify);
    app.post(nameSpace + "/delete", weixinAuth.isAdmin, news.remove);
    app.post(nameSpace + "/getNews", news.getNews);
    app.get(nameSpace, function(req, res, next){

        res.render("news/list");
    });
    app.get(nameSpace + "/view", function(req, res, next){
        var id = req.query.id || "";
        news.getNewsById(id, function(err, _news){
            if(err) res.send(err.message);
            else if(_news) {
                news.getPrevNews(_news, function(err, prevNews){
                    if(err) prevNews = null;
                    news.getNextNews(_news, function(err, nextNews){
                        if(err) nextNews = null;
                        _news = _news.toObject();
                        _news.createDate = moment(_news.createDate).format("YYYY-MM-DD");
                         // 格式化时间

                        res.render("news/view", {
                            news:_news,
                            prevNews: prevNews && prevNews[0],
                            nextNews: nextNews && nextNews[0],
                            user: req.session.user
                        });
                    });
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

};