/**
 *@description: column router
 *@author: LiuJ
 *@date: 2016/1/6
 */

var weixinAuth = require("../controllers/user.server.controller.js");
var generateMenu =  require("../controllers/webchat.server.controller.js").generateMenu;
module.exports = function(app){

    app.get("/weixin/auth", weixinAuth.getCode, weixinAuth.getAccessCode, weixinAuth.getUserInfo, function(req, res){
        res.redirect("/");
    });
    app.get("/",weixinAuth.checkAuth, function(req, res){
        res.render("index", {
            user: req.session.user
        });
    });
    app.get("/test", weixinAuth.checkAuth, function(req, res){
        res.render("test", {
            user: req.session.user
        });
    });
    app.get("/logout", weixinAuth.checkAuth, weixinAuth.logout);
};

