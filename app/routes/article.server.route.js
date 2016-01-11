/**
 *@description: article router
 *@author: LiuJ
 *@date: 2016/1/11
 */
var article = require("../controllers/article.server.controller.js");
var weixinAuth = require("../controllers/user.server.controller.js");
module.exports = function (app) {
    var nameSpace = "/article";
    app.post(nameSpace + "/add", weixinAuth.checkAuth, article.add);
    app.post(nameSpace + "/modify", weixinAuth.checkAuth, article.modify);
    app.post(nameSpace + "/delete", weixinAuth.checkAuth, article.remove);
    app.post(nameSpace + "/list", weixinAuth.checkAuth, article.list);
    app.post(nameSpace + "/addComment", weixinAuth.checkAuth, article.addComment);
    app.post(nameSpace + "/deleteComment", weixinAuth.checkAuth, article.deleteComment);
};