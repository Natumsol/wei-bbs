var Queue = require("mongoose").model("Book");
exports.findBook = function(req, res, next) {
	var regex = new RegExp(req.body.keyword, "i");
	Queue.find({"bookName":regex}, function(err, results){
		if(err){
			next(err);
		} else {
			res.json({books:results})
		}
	});
};
exports.su = function(req, res, next) {
	var regex = new RegExp(req.body.keyword, "i");
	Queue.find({"bookName":regex}, 'bookName',function(err, results){
		if(err){
			next(err);
		} else {
			res.json({books:results})
		}
	});
};
exports.renderIndex = function(req, res) {
	res.render("index", {
		title:"取号",
		user: req.user
	});//控制器，用于控制MVC里面的MV
};