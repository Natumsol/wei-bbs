var querystring = require("querystring");
var https = require("https");
var chalk = require('chalk');
var weixinAuthConfig = require("../../config/weixinAuthConfig.js");
var mongoose = require("mongoose");
var User = mongoose.model("User");
function getCode(req, res, next) {
    req.weixin = {};
    req.weixin.code = req.query.code;
    next();
}
function getAccessCode(req, res, next) {
    var params = {
        appid: weixinAuthConfig.appId,
        secret: weixinAuthConfig.appSecret,
        code: req.weixin.code,
        grant_type: "authorization_code"
    };
    var url = weixinAuthConfig.access_tokenURL + "?" + querystring.stringify(params);

    https.get(url, function (clientRes) {
        var body = [];
        clientRes.on("data", function(data){
            body.push(data);
        });
        clientRes.on("end", function(){
            body = JSON.parse(Buffer.concat(body));
            req.weixin.access_token = body.access_token;
            req.weixin.refresh_token = body.refresh_token;
            req.weixin.openid = body.openid;
            console.log(chalk.green(JSON.stringify(req.weixin)));
            next();
        })

    });
}

function getUserInfo(req, res, next) {
    var params = {
        access_token: req.weixin.access_token,
        openid: req.weixin.openid
    };
    var url = weixinAuthConfig.getUserInfoURL + "?" + querystring.stringify(params);
    https.get(url, function(clientRes){
        var body = [];
        clientRes.on("data", function(data){
            body.push(data);
        });
        clientRes.on("end", function(){
            req.weixin.user = JSON.parse(Buffer.concat(body));
            console.log(req.weixin.user);
            User.findOne({
                openid:req.weixin.user.openid
            }, function(err, user){
                if(err) res.end("登录出错！");
                if(!user) { // 找不到，则新建用户
                    (new User(req.weixin.user)).save(function (err, user) {
                        if(err) throw err;
                        else{
                            console.log(chalk.green("用户信息保存成功~"));
                            req.session.regenerate(function(){
                                req.session.user = user;
                                next();
                            });

                        }
                    });
                } else {
                    req.session.regenerate(function(){
                        req.session.user = user; // 找得到，则直接登录
                        next();
                    });
                }

            });

        });
    })
}

function checkAuth(req, res, next){
    req.session.user = {
        "_id" : "569a4aada22d37007435e322",
        "openid" : "oXlgUwkexLQQVXeCy0cIkWFiUAbE",
        "nickname" : "小草",
        "sex" : 2,
        "language" : "zh_CN",
        "city" : "Wuhan",
        "province" : "Hubei",
        "country" : "CN",
        "headimgurl" : "http://wx.qlogo.cn/mmopen/ajNVdqHZLLBEib6uc6W4Q5qeJhnXvANTVPGjLjFmk6f6QjdAaZZVAQUyHvuNlGqhkoFgicxCaI50ok8luWebml8g/0",
        "privilege" : [],
        "isAdmin": true
    };
    if(!req.session.user) {
        res.end("请在微信打开。");
    } else {
        console.log(chalk.red("验证通过"));
        next();
    }
}
function logout(req, res, next){
    delete req.session.user;
    res.setHeader("Location","/");
    res.statusCode = 301;
    res.send("注销成功");
}
function isAdmin(req, res, next) {
    User.findOne({openid: req.session.user.openid}, function (err, user) {
        if (err) throw err;
        if (user.isAdmin) {
            next();
        } else {
            res.send("您没有权限进行此操作！");
        }
    })
}

module.exports = {
    getCode: getCode,
    getAccessCode: getAccessCode,
    getUserInfo: getUserInfo,
    checkAuth: checkAuth,
    logout: logout,
    isAdmin: isAdmin
};