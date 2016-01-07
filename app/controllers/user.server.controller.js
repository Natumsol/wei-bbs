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
            req.session.user = req.weixin.user = JSON.parse(Buffer.concat(body));
            console.log(req.weixin.user);
            User.count({
                openId:req.session.user.openId
            }, function(err, count){
                if(!count) {
                    (new User(req.session.user)).save(function (err, user) {
                        if(err) throw err;
                        else console.log(chalk.green("用户信息保存成功~"));
                    });
                }
            });
            next();
        });
    })
}

exports.getCode = getCode;
exports.getAccessCode = getAccessCode;
exports.getUserInfo = getUserInfo;
