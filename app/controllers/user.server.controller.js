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
        clientRes.on("data", function (data) {
            body.push(data);
        });
        clientRes.on("end", function () {
            body = JSON.parse(Buffer.concat(body));
            req.weixin.access_token = body.access_token;
            req.weixin.refresh_token = body.refresh_token;
            req.weixin.openid = body.openid;
            //console.log(chalk.green(JSON.stringify(req.weixin)));
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
    https.get(url, function (clientRes) {
        var body = [];
        clientRes.on("data", function (data) {
            body.push(data);
        });
        clientRes.on("end", function () {
            req.weixin.user = JSON.parse(Buffer.concat(body));
            User.findOne({
                openid: req.weixin.user.openid
            }, function (err, user) {
                if (err) res.end("登录出错！");
                if (!user) { // 找不到，则新建用户
                    (new User(req.weixin.user)).save(function (err, user) {
                        if (err) throw err;
                        else {
                            console.log(chalk.green("用户信息保存成功~"));
                            req.session.regenerate(function () {
                                req.session.user = user;
                                next();
                            });

                        }
                    });
                } else {
                    req.session.regenerate(function () {
                        req.session.user = user; // 找得到，则直接登录
                        next();
                    });
                }

            });

        });
    })
}

function checkAuth(req, res, next) {
    /*req.session.user = {
        "_id": "56e670aa300e9ba36bb44866",
        "salt": "N!��\u0012c݊�dU�K�\u0019\u0014",
        "password": "ZDdtH05jQwjL/qn0B4TL6Wl8iKXRJrgLHNpTiU2y+OedhKR5bS7vQ3QxtB89YQU6M97tzM3ieM01DvuQTFyBKA==",
        "username": "sBupv77PB9O3pkdVJ2SLKw==",
        "openid": "oXlgUwu85jlX0lLPRA3vDBSYEVhw",
        "sex": 1,
        "city": "Wuhan",
        "privileg": [],
        "isAdmin": true,
        "headimgurl": "http://wx.qlogo.cn/mmopen/OxUBpiaYgpHjwibjCdQ68BgOnU9669ClWdpEg5pibJoe38ic3zJSKmOR4KctCoUbcjyBbicVoJdMRrpfpveWCxyNoKw/0",
        "country": "CN",
        "provinc": null,
        "language": "zh_CN",
        "nickname": "文刀十口",
        "__v": 0
    };*/

    if (!req.session.user) {
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        res.send("<h1>请在微信打开。</h1>");
    } else if(req.session.user) { // 确认是微信用户而不是admin
        console.log(chalk.red("验证通过"));
        next();
    }
}
function logout(req, res, next) {
    delete req.session.user;
    res.setHeader("Location", "/");
    res.statusCode = 301;
    res.send("注销成功");
}
function isAdmin(req, res, next) {

    User.findOne({ openid: req.session.user.openid }, function (err, user) {
        if (err) throw err;
        if (user.isAdmin) {
            next();
        } else {
            res.send("您没有权限进行此操作！");
        }
    })
}

function adminLogin(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var originUrl = req.originUrl || "/manage";
    User.findOne({ username: username }, function (err, user) {
        if (err) send("Error!");
        else if (user) {
            if (user.authenticate(password)) {
                req.session.regenerate(function () {
                    req.session.user = user;
                    res.redirect(originUrl);
                })
            } else {
                req.session.regenerate(function () {
                    res.render("manage/login", {
                        errInfo: "用户名或密码错误！"
                    });
                })

            }
        } else {
            req.session.regenerate(function () {
                res.render("manage/login", {
                    errInfo: "用户不存在"
                });
            })

        }
    }
        );
}

function checkAdminLogin(req, res, next) {
    //console.log(req.session.user);
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.redirect("/manage/login");
    }
}

function adminLogout(req, res, next) {
    delete req.session.user;
    res.redirect("/manage/login");
}
module.exports = {
    getCode: getCode,
    getAccessCode: getAccessCode,
    getUserInfo: getUserInfo,
    checkAuth: checkAuth,
    logout: logout,
    adminLogin: adminLogin,
    isAdmin: isAdmin,
    checkAdminLogin: checkAdminLogin,
    adminLogout: adminLogout
};