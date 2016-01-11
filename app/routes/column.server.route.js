/**
 *@description: column router
 *@author: LiuJ
 *@date: 2016/1/11
 */
var column = require("../controllers/column.server.controller.js");
var weixinAuth = require("../controllers/user.server.controller.js");
module.exports = function (app) {
    var nameSpace = "/column";
    app.post(nameSpace + "/add", weixinAuth.isAdmin, column.add);
    app.post(nameSpace + "/modify", weixinAuth.isAdmin, column.modify);
    app.post(nameSpace + "/delete", weixinAuth.isAdmin, column.remove);
    app.post(nameSpace + "/list", weixinAuth.isAdmin, column.list);
};