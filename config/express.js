var config = require("./config");
var express = require("express");
var morgan = require("morgan"); //logger
var compress = require("compression");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var session = require("express-session");
var RedisStore = require('connect-redis')(session);
var ueditor = require("ueditor");
var path = require("path");
module.exports = function () {
    var app = express();
    if (process.env.NODE_ENV == "development") {
        app.use(morgan("dev"));
    } else if (process.env.NODE_ENV == "production") {
        app.use(compress());
    }
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: "500kb"
    }));
    app.use(bodyParser.json({limit: "500kb"}));
    app.use(methodOverride());
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: new RedisStore()
    }));

    app.use(express.query());

    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    app.engine("ejs", require("ejs").renderFile);

    app.use(express.static(config.statics, config.staticsOptions)); // 设置静态资源路径

    require("../app/routes/statistics.server.route.js")(app);//引入路由信息
    require("../app/routes/user.server.route.js")(app);
    require("../app/routes/webchat.server.route.js")(app);
    require("../app/routes/article.server.route.js")(app);
    require("../app/routes/news.server.route.js")(app);
    require("../app/routes/product.server.route.js")(app);
    require("../app/routes/manage.server.route.js")(app);
    require("../app/routes/about.server.route.js")(app);

    app.use("/ueditor/ue", ueditor(config.statics, function (req, res, next) {
        // ueditor 客户发起上传图片请求
        if (req.query.action === 'uploadimage') {
            var foo = req.ueditor;
            var date = new Date();
            var imgname = req.ueditor.filename;

            var img_url = '/uploads/images/';
            res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        }
        //  客户端发起图片列表请求
        else if (req.query.action === 'listimage') {
            var dir_url = '/uploads/images/';
            res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
        }
        // 客户端发起其它请求
        else {

            res.setHeader('Content-Type', 'application/json');
            res.redirect('/plugins/ueditor/ueditor.json')
        }
    }));

    //The 404 Route (ALWAYS Keep this as the last route)
    app.use(function (err, req, res, next) {
        console.log(err);
        next(err);
    });
    return app;
};