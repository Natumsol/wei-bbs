/**
 *@description: article router
 *@author: LiuJ
 *@date: 2016/1/11
 */
var article = require("../controllers/article.server.controller.js");
module.exports = function (app) {
    var nameSpace = "/article";
    app.post(nameSpace + "/add", article.add);
    app.post(nameSpace + "/modify", article.modify);
    app.post(nameSpace + "/delete", article.remove);
    app.post(nameSpace + "/list", article.list);
    app.post(nameSpace + "/addComment", article.addComment);
    app.post(nameSpace + "/deleteComment", article.deleteComment);
};