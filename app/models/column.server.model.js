/**
 * Created by LiuJ on 2016/1/11.
 * 栏目数据模型
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var xss = require("xss");
var ColumnSchema = new Schema({
    name: String,
    date: {
        type: Date,
        default:Date.now
    },
    isHot: {
        type: Boolean,
        default: false
    },
    topics:{
        type:Number,
        default:0
    },
    posts:{
        type:Number,
        default:0
    },
    img:String,

});

ColumnSchema.pre("save", function(next){
    this.name = xss( this.name.trim());
    next();
});


mongoose.model('Column', ColumnSchema);