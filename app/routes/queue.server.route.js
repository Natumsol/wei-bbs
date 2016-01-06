// 不同的路由应用不同的控制器
var queue = require('../controllers/queue.server.controller.js');
module.exports = function(app){
	app.get("/getNumber", queue.getNumber).post("/getNumber", queue.getNumber);
	app.get("/checkNumber", queue.checkNumber).post("/getNumber", queue.getNumber);
	app.get("/", queue.render);
	app.route("/updateNumber").post(queue.updateNumber).get(queue.updateNumber);
};