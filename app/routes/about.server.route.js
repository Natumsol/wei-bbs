/**
 *@description: article router
 *@author: LiuJ
 *@date: 2016/1/11
 */
var about = require("../controllers/about.server.controller.js");
var weixinAuth = require("../controllers/user.server.controller.js");

module.exports = function (app) {
    var nameSpace = "/about";
    app.post(nameSpace + "/modify", weixinAuth.checkAuth, about.modify);
};