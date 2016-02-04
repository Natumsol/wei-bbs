/**
 *@description:
 *@author: Sulfer
 *@date: 2/4 0004
 */
var product = require("../controllers/product.server.controller.js");
var weixinAuth = require("../controllers/user.server.controller.js");
var multer = require('multer');
var crypto = require('crypto')
var mime = require("mime");
var fs = require('fs-extra');
var path = require("path");
var moment = require("moment");

module.exports = function (app) {
    var nameSpace = "/product";
    app.post(nameSpace + "/add", weixinAuth.isAdmin, product.add);
    app.post(nameSpace + "/modify", weixinAuth.isAdmin, product.modify);
    app.post(nameSpace + "/delete", weixinAuth.isAdmin, product.remove);
    app.post(nameSpace + "/getProduct", weixinAuth.isAdmin, product.getProduct);
    app.get(nameSpace, function(req, res, next){
        res.render("product/list");
    });

    app.get(nameSpace + "/view", function(req, res, next){
        var id = req.query.id || "";
        product.getProductById(id, function(err, _product){
            if(err) res.send(err.message);
            else if(product) {
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

                        res.render("product/view", {
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

    app.get(nameSpace + "/add", weixinAuth.isAdmin, function(req, res, next){
        res.render("addProduct", {
            user: req.session.user
        });

    });

    app.get(nameSpace + "/modify", weixinAuth.checkAuth, function(req, res, next){
        var id = req.query.id || "";
        product.getProductById(id, function(err, product){
            if(err) res.send(err.message);
            else if(product) {
                res.render("modifyProduct", {
                    product:product,
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