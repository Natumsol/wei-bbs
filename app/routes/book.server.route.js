// 不同的路由应用不同的控制器
var book = require('../controllers/book.server.controller.js');
module.exports = function(app){
	app.get("/", book.renderIndex);
	app.post("/su", book.su);
	app.post("/search", book.findBook);
};