/**
 *@description: column router
 *@author: LiuJ
 *@date: 2016/1/6
 */

var weixinAuth = require("../controllers/user.server.controller.js");
var generateMenu =  require("../controllers/webchat.server.controller.js").generateMenu;
var column = require("../controllers/column.server.controller.js");
module.exports = function(app){

    app.get("/weixin/auth", weixinAuth.getCode, weixinAuth.getAccessCode, weixinAuth.getUserInfo, function(req, res){
        res.redirect("/");
    });
    app.get("/",weixinAuth.checkAuth, function(req, res, next){
        if(req.query.columnId) {
            column.getColumnById(req.query.columnId, function(err, column){
                if(err) throw err;
                else if(column) {
                    res.render('view', {
                        user: req.session.user,
                        column:column
                    });
                } else {
                    next();
                }
            });
        } else {
            res.render("index_", {
                user: req.session.user,
            });
        }

    });
    app.get("/test", weixinAuth.checkAuth, function(req, res){
        res.render("test", {
            user: req.session.user
        });
    });
    app.get("/logout", weixinAuth.checkAuth, weixinAuth.logout);
    app.get("/user", function (req, res, next) {
        res.render("userCenter", {user: req.session.user});
    })
};

