/**
 *@description: user router
 *@author: LiuJ
 *@date: 2016/1/6
 */

var weixinAuth = require("../controllers/user.server.controller.js");
var generateMenu =  require("../controllers/webchat.server.controller.js").generateMenu;
var news = require("../controllers/news.server.controller.js");
var product = require("../controllers/product.server.controller.js");
module.exports = function(app){

    app.get("/weixin/auth", weixinAuth.getCode, weixinAuth.getAccessCode, weixinAuth.getUserInfo, function(req, res){
        res.redirect("/bbs");
    });
    app.get("/", function(req, res, next){

        news.getSliderNews(function(err, sliderNews){
            if(err) {
                sliderNews = [];
            }
            news.getIndexNews(function(err, news){
                if(err) news = [];
                product.getIndexProduct(function(err, products){
                    if(err) products = [];
                    res.render("index", {
                        sliderNews: sliderNews,
                        news: news,
                        products: products,
                        manifest: app.get('manifest')
                    });
                });
            });
        });

    });
    app.get("/test", weixinAuth.checkAuth, function(req, res){
        res.render("test", {
            user: req.session.user,
            manifest: app.get('manifest')
        });
    });
    app.get("/logout", weixinAuth.checkAuth, weixinAuth.logout);
    app.get("/user", function (req, res, next) {
        res.render("userCenter", {user: req.session.user,manifest: app.get('manifest')});
    })
};

