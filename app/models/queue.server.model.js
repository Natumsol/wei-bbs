var mongoose = require("mongoose"),
	Schema = mongoose.Schema;

var Queue = new Schema({
	counter:Number
});

mongoose.model("Queue", Queue);