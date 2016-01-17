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
    app.post(nameSpace + "/list_index", weixinAuth.checkAuth, article.list_index);
    app.post(nameSpace + "/addComment", weixinAuth.checkAuth, article.addComment);
    app.post(nameSpace + "/deleteComment", weixinAuth.checkAuth, article.deleteComment);
    app.post(nameSpace + "/like", weixinAuth.checkAuth, article.like);
    app.get(nameSpace + "/view",weixinAuth.checkAuth, function(req, res){
        var id = req.query.id;
        var isReverse = parseInt(req.query.isReverse) || 0;
        var onlyAuthor =  parseInt(req.query.onlyAuthor) || 0;
        article.getArticleById(id,isReverse, onlyAuthor,function(err, article){
            if(err) res.send(err.message);
            console.log(article);
            res.render("view", {
                article:article,
                user: req.session.user
            });
        });

    })
};