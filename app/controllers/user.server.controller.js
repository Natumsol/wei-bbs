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

function checkAuth(req, res, next){
    req.session.user = {
        "_id": "568e6e9514c8f84806d0c158",
        "openid": "oXlgUwu85jlX0lLPRA3vDBSYEVhw",
        "nickname": "文刀十口",
        "sex": 1,
        "language": "zh_CN",
        "city": "Wuhan",
        "country": "CN",
        "headimgurl": "http://wx.qlogo.cn/mmopen/PiajxSqBRaELcdA2GG1zGRacttOfviaAiahmIO8MBX6mfibu3qZQ1waG2sIKCBic3qu9kov41o7P6XFpBSG3ibkbBM6g/0",
        "privileg": [],
        "__v": 0,
        "isAdmin": true
    };
    if(!req.session.user) {
        res.send("没有授权");
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