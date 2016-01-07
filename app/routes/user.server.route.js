/**
 * Created by LiuJ on 2016/1/6.
 */
var weixinAuth = require("../controllers/user.server.controller.js");
module.exports = function(app){

    app.get("/weixin/auth", weixinAuth.getCode, weixinAuth.getAccessCode,weixinAuth.getUserInfo, function(req, res){
        res.redirect("/");
    });
    app.get("/", function(req, res){
        res.render("index", {
            user: req.session.user
        });
    });
    app.get("/test", function(req, res){
        res.render("test", {
            user: req.session.user
        });
    });
};

