var mongoose = require("mongoose"),
	config = require("./config.js");
module.exports = function(){
	var db = mongoose.connect(config.db, function(err){
		if(err) {
			console.log("数据库连接失败！");
		} else {
			console.log("数据库连接成功！");
		}
	});

	require("../app/models/user.server.model.js");
	require("../app/models/column.server.model.js");
	require("../app/models/article.server.model.js");
	return db;
};