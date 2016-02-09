/**
 *@description:
 *@author: Sulfer
 *@date: 2/7 0007
 */
var product = require("../controllers/product.server.controller.js");
var news = require("../controllers/news.server.controller.js");
var article = require("../controllers/article.server.controller.js");
var about = require("../controllers/about.server.controller.js");
var moment = require("moment");
module.exports = function (app) {
    var nameSpace = "/manage"
    app.get(nameSpace, function(req, res){
        res.render("manage/index");
    });

    /** product **/
    app.get(nameSpace + "/product", function(req, res){
        res.render("manage/product/list");
    });
    app.get(nameSpace + "/product/add", function(req, res){
        res.render("manage/product/add");
    });
    app.get(nameSpace + "/product/view", function(req, res, next){
        var id = req.query.id || "";
        product.getProductById(id, function(err, _product){
            if(err) res.send(err.message);
            else if(_product) {
                product.getPrevProduct(_product, function(err, prevProduct){
                    if(err) prevProduct = null;
                    product.getNextProduct(_product, function(err, nextProduct){
                        if(err) {
                            nextProduct = null;
                            throw err;
                        }
                        console.log(prevProduct);
                        console.log(nextProduct);

                        _product = _product.toObject();
                        _product.date = moment(_product.date).format("YYYY-MM-DD");
                        // 格式化时间

                        res.render("manage/product/view", {
                            product:_product,
                            prevProduct: prevProduct && prevProduct[0],
                            nextProduct: nextProduct && nextProduct[0],
                            user: req.session.user
                        });
                    });
                });
            } else {
                next();
            }

        });
    });
    app.get(nameSpace + "/product/modify", function(req, res, next){
        var id = req.query.id || "";
        product.getProductById(id, function(err, product){
            if(product) {
                res.render("manage/product/modify", {product: product});
            } else {
                next();
            }
        })
    });

    /** news **/

    app.get(nameSpace + "/news", function(req, res){
        res.render("manage/news/list");
    });
    app.get(nameSpace + "/news/add", function(req, res){
        res.render("manage/news/add");
    });
    app.get(nameSpace + "/news/view", function(req, res, next){
        var id = req.query.id || "";
        news.getNewsById(id, function(err, _news){
            if(err) res.send(err.message);
            else if(_news) {
                news.getPrevNews(_news, function(err, prevNews){
                    if(err) prevNews = null;
                    news.getNextNews(_news, function(err, nextNews){
                        if(err) {
                            nextNews = null;
                            throw err;
                        }
                        console.log(prevNews);
                        console.log(nextNews);

                        _news = _news.toObject();
                        _news.createDate = moment(_news.createDate).format("YYYY-MM-DD");
                        // 格式化时间

                        res.render("manage/news/view", {
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
    app.get(nameSpace + "/news/modify", function(req, res, next){
        var id = req.query.id || "";
        news.getNewsById(id, function(err, news){
            if(news) {
                res.render("manage/news/modify", {news: news});
            } else {
                next();
            }
        })
    });

    /** bbs **/
    app.get(nameSpace + "/bbs", function(req, res){
        res.render("manage/bbs/list");
    });
    app.get(nameSpace + "/bbs/add", function(req, res){
        res.render("manage/bbs/add");
    });
    app.get(nameSpace + "/bbs/view", function(req, res, next){
        var id = req.query.id || "";
        article.getArticleById(id, function(err, _article){
            if(err) res.send(err.message);
            else if(_article) {
                article.getPrevArticle(_article, function(err, prevArticle){
                    if(err) prevArticle = null;
                    article.getNextArticle(_article, function(err, nextArticle){
                        if(err) {
                            nextArticle = null;
                            throw err;
                        }
                        console.log(prevArticle);
                        console.log(nextArticle);

                        _article = _article.toObject();
                        _article.createDate = moment(_article.createDate).format("YYYY-MM-DD");
                        // 格式化时间

                        res.render("manage/bbs/view", {
                            article:_article,
                            prevArticle: prevArticle && prevArticle[0],
                            nextArticle: nextArticle && nextArticle[0],
                            user: req.session.user
                        });
                    });
                });
            } else {
                next();
            }

        });
    });
    app.get(nameSpace + "/bbs/modify", function(req, res, next){
        var id = req.query.id || "";
        article.getArticleById(id, function(err, article){
            if(article) {
                res.render("manage/bbs/modify", {article: article});
            } else {
                next();
            }
        })
    });

    /** about **/
    app.get(nameSpace + "/about", function(req, res, next){
        about.getAbout(function(err, about) {
            if (about) {
                res.render("manage/about/view", {about: about});
            } else {
                next();
            }
        });
    });

    app.get(nameSpace + "/about/modify", function(req, res, next){
        about.getAbout(function(err, about) {
            if (about) {
                res.render("manage/about/modify", {about: about});
            } else {
                next();
            }
        });
    });

};