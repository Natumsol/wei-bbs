/**
 *@description:统计分析
 *@author: Sulfer
 *@date: 2/9 0009
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VisitorSchema = new Schema({
    url:String,
    date: {
        type: Date,
        default: Date.now
    },
    os: {
        type: String,
        default: ""
    },
    osversion: {
        type: String,
        default: ""
    },
    bit: {
        type: String,
        default: ""
    },
    browser: {
        type: String,
        default: ""
    },
    version: {
        type: String,
        default: ""
    },
    ip: {
        type: String,
        default: ""
    }
});

mongoose.model('Visitor', VisitorSchema);