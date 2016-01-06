var config = require("./config");
var express = require("express");
var morgan = require("morgan");//logger
var compress = require("compression");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var session = require("express-session");
var passport = require("passport");
module.exports = function () {
	var app = express();
	if (process.env.NODE_ENV == "development") {
		app.use(morgan("dev"));
	} else if (process.env.NODE_ENV == "production") {
		app.use(compress());
	}
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));

	/* 引入passport */
	app.use(passport.initialize());
	app.use(passport.session());

	app.set('views', './app/views');
	app.set('view engine', 'ejs');
	app.engine("ejs", require("ejs").renderFile);

	require("../app/routes/book.server.route.js")(app);//引入路由信息
	require("../app/routes/user.server.route.js")(app);//引入路由信息
	app.use(express.static("./public"));
	return app;
};