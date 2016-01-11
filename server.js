process.env.NODE_ENV  = process.env.NODE_ENV || "development";
var express = require("./config/express");
var db = require("./config/mongoose.js")();
var app = express();
app.listen(80);
module.exports = app;
console.log("Server running at http://localhost.\n" + "using version: " + process.env.NODE_ENV);
