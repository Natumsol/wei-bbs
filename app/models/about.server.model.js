/**
 * Created by LiuJ on 2016/1/11.
 * 文章数据模型
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var xss = require("xss");

var AboutSchema = new Schema({
    title: {
        type:String,
        default:"关于我们"
    },
    content: {
        type: String,
        default: "（空）"
    }
});

AboutSchema.pre("save", function(next){
    this.content = xss( this.content.trim());
    next();
});

mongoose.model('About', AboutSchema);
