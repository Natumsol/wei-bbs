/**
 * Created by LiuJ on 2016/1/6.
 */
var weixinAuth = require("../controllers/user.server.controller.js");
module.exports = function(app){

    app.get("/weixin/auth", weixinAuth.getCode, weixinAuth.getAccessCode,weixinAuth.getUserInfo);
};

