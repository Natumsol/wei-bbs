/**
 *@description:
 *@author: Sulfer
 *@date: 2/4 0004
 */
var mongoose = require("mongoose");
var Product = mongoose.model("Product");
var is = require("is");
var formatter = require("../../tools/formatDate.js").format;
var moment = require("moment");
function add(req, res, next) {
    var product = new Product(req.body);
    //product.author = req.session.user
    product.save(function(err, product){
        if (err) {
            res.json({
                errInfo: err.message,
                status: 0
            });
        }
        else {
            res.json({status: 1, id: product._id});
        }
    });
}

function remove(req, res, next){
    var id = req.body.id;
    Product.findOneAndRemove({_id: id}, function(err, product){
        if (err) {
            res.json({
                errInfo: err.message,
                status: 0
            });
        }
        else {
            res.json({status: 1});
        }
    });
}

function modify(req, res, next){
    var product = new Product(req.body);
    var id = req.body.id;
    Product.findOneAndUpdate({_id: id}, {
        image_url: product.image_url,
        introduction: product.introduction,
        name: product.name,
        date: product.date
    }, function (err, product) {
        if (err) {
            res.json({
                errInfo: "update error",
                status: 0
            })
        } else {
            res.json({
                status: 1,
                id: product._id
            })
        }
    })
}

function getProduct(req, res, next) {
    var start = parseInt(req.body.start);
    var limit = parseInt(req.body.limit) || 10;
    if (!is.integer(start) || !is.integer(limit)) {
        res.json({
            errInfo: "param error",
            status: 0
        })
    }
    else {
        Product.find().skip(start).sort({createDate: -1}).limit(limit).exec(function (err, product) {
            res.json({products: product});
        });  //  分页查询
    }
}

function getProductById(id, callback) {
    Product.findOne({_id: id}).exec(function (err, product) {
        callback(null, product);
    });

}
function getIndexProduct(callback) {
    Product.find().sort({date: -1}).limit(6).exec(function(err, products){
        products = products.map(function(value){
            return value.toObject();
        });
        for(var i = 0 ; i < products.length; i ++){
            products[i].date = moment(products[i].date).format("YYYY-MM-DD");
        }
        callback(err, products);
    });
}
function getNextProduct(product, callback){
    Product.find({date:{$gt: product.date}}).sort({date: 1}).limit(1).exec(function(err, product){
        callback(err, product);
    });
}
function getPrevProduct(product, callback){
    Product.find({date:{$lt: product.date}}).sort({date: -1}).limit(1).exec(function(err, product){
        callback(err, product);
    });
}
module.exports = {
    add: add,
    modify: modify,
    remove: remove,
    getProduct: getProduct,
    getProductById: getProductById,
    getIndexProduct:getIndexProduct,
    getNextProduct: getNextProduct,
    getPrevProduct: getPrevProduct
};
