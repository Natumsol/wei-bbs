/**
 * Created by LiuJ on 2016/1/11.
 * 文章数据模型
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var xss = require("xss");
var ProductSchema = new Schema({
    name: String,
    image_url: {
        type: String,
        default: null
    },
    introduction: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
});
mongoose.model('Product', ProductSchema);
ProductSchema.pre("save", function(next){
    this.introduction = xss( this.introduction.trim());
    next();
});
