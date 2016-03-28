/**
 *@description:
 *@author: Sulfer
 *@date: 2/7 0007
 */
var product = require("../controllers/product.server.controller.js");
var news = require("../controllers/news.server.controller.js");
var article = require("../controllers/article.server.controller.js");
var about = require("../controllers/about.server.controller.js");
var statistics = require("../controllers/statistics.server.controller.js");
var user = require("../controllers/user.server.controller.js");
var moment = require("moment");
module.exports = function (app) {
    var nameSpace = "/manage";
    app.get(nameSpace + "/login", function(req, res){
        res.render("manage/login",{errInfo:null,manifest: app.get('manifest')});
    });
    app.get(nameSpace + "/logout", user.adminLogout);
    app.post(nameSpace + "/login", user.adminLogin);
    app.get(nameSpace, user.checkAdminLogin, function(req, res){
        statistics.getIndexInfo(function(err, result){
            res.render("manage/index",{
                err: err,
                indexInfo: result,
                manifest: app.get('manifest')
            })
        })
    });

    /** product **/
    app.get(nameSpace + "/product", user.checkAdminLogin, function(req, res){
        res.render("manage/product/list",{manifest: app.get('manifest')});
    });
    app.get(nameSpace + "/product/add", user.checkAdminLogin, function(req, res){
        res.render("manage/product/add",{manifest: app.get('manifest')});
    });
    app.get(nameSpace + "/product/view", user.checkAdminLogin, function(req, res, next){
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
                            user: req.session.user,
                            manifest: app.get('manifest')
                        });
                    });
                });
            } else {
                next();
            }

        });
    });
    app.get(nameSpace + "/product/modify", user.checkAdminLogin, function(req, res, next){
        var id = req.query.id || "";
        product.getProductById(id, function(err, product){
            if(product) {
                res.render("manage/product/modify", {product: product,manifest: app.get('manifest')});
            } else {
                next();
            }
        })
    });

    /** news **/

    app.get(nameSpace + "/news", user.checkAdminLogin, function(req, res){
        res.render("manage/news/list",{manifest: app.get('manifest')});
    });
    app.get(nameSpace + "/news/add", user.checkAdminLogin, function(req, res){
        res.render("manage/news/add",{manifest: app.get('manifest')});
    });
    app.get(nameSpace + "/news/view", user.checkAdminLogin, function(req, res, next){
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
                            user: req.session.user,
                            manifest: app.get('manifest')
                        });
                    });
                });
            } else {
                next();
            }

        });
    });
    app.get(nameSpace + "/news/modify", user.checkAdminLogin, function(req, res, next){
        var id = req.query.id || "";
        news.getNewsById(id, function(err, news){
            if(news) {
                res.render("manage/news/modify", {news: news,manifest: app.get('manifest')});
            } else {
                next();
            }
        })
    });

    /** bbs **/
    app.get(nameSpace + "/bbs", user.checkAdminLogin, function(req, res){
        res.render("manage/bbs/list",{manifest: app.get('manifest')});
    });
    app.get(nameSpace + "/bbs/add", user.checkAdminLogin, function(req, res){
        res.render("manage/bbs/add",{manifest: app.get('manifest')});
    });
    app.get(nameSpace + "/bbs/view", user.checkAdminLogin, function(req, res, next){
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

                        _article.createDate = moment(_article.createDate).format("YYYY-MM-DD");
                        // 格式化时间

                        res.render("manage/bbs/view", {
                            article:_article,
                            prevArticle: prevArticle && prevArticle[0],
                            nextArticle: nextArticle && nextArticle[0],
                            user: req.session.user,
                            manifest: app.get('manifest')
                        });
                    });
                });
            } else {
                next();
            }

        });
    });
    app.get(nameSpace + "/bbs/modify", user.checkAdminLogin, function(req, res, next){
        var id = req.query.id || "";
        article.getArticleById(id, function(err, article){
            if(article) {
                res.render("manage/bbs/modify", {article: article,manifest: app.get('manifest')});
            } else {
                next();
            }
        })
    });

    /** about **/
    app.get(nameSpace + "/about", user.checkAdminLogin, function(req, res, next){
        about.getAbout(function(err, about) {
            if (about) {
                res.render("manage/about/view", {about: about,manifest: app.get('manifest')});
            } else {
                next();
            }
        });
    });

    app.get(nameSpace + "/about/modify", user.checkAdminLogin, function(req, res, next){
        about.getAbout(function(err, about) {
            if (about) {
                res.render("manage/about/modify", {about: about,manifest: app.get('manifest')});
            } else {
                next();
            }
        });
    });

};