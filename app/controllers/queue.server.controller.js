var Queue = require("mongoose").model("Queue");
exports.getNumber = function(req, res, next) {
	Queue.find({}, function(err, queues){
		if(err){
			next(err);
		} else {
			if(!queues.length){
				var queue = new Queue({
					counter:1
				});
				queue.save(function(err){
					console.log("quene:1");
					res.json({total:1});
				});
			} else {
				var counter = ++ queues[0].counter;
				queues[0].save(function(err){
					console.log("quene:" + counter);
					res.json({total:counter});
				});
			}
		}
	});
};
exports.checkNumber = function(req, res, next) {
	Queue.find({}, function(err, queues){
		if(err) {
			next(err);
		} else {
			res.json({total:queues[0].counter});
		}
	});
};

exports.updateNumber = function(req, res, next) {
	var counter = req.body.total || req.query.total;
	Queue.find({}, function(err, queues){
		if(err){
			next(err);
		} else {
			if(!queues.length){
				var queue = new Queue({
					counter:counter
				});
				queue.save(function(err){
					console.log("quene:" + counter);
					res.json({total:counter});
				});
			} else {
				queues[0].counter = counter;
				queues[0].save(function(err){
					console.log("quene:" + counter);
					res.json({total:counter});
				});
			}
		}
	});	
};

exports.render = function(req, res) {
	res.render("queue", {
		title:"取号"
	});//控制器，用于控制MVC里面的MV
};