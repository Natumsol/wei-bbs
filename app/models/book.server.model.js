var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var Book = new Schema({
	bookName:String,
	isbn:String,
	bookId:String
});

mongoose.model("Book", Book);