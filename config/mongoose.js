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

	require("../app/models/book.server.model.js");
	return db;
};