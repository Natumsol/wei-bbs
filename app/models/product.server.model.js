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
    level:{
        type: String,
        default: ''
    },
    production_place:{
        type: String,
        default: ''
    },
    type:{
        type: String,
        default: ''
    },
    alcohol:{
        type: String,
        default: ''
    },
    year:{
        type: String,
        default: ''
    },
    brewing:{
        type: String,
        default: ''
    },
    tasting:{
        type: String,
        default: ''
    },
    honor:{
        type: String,
        default: ''
    },
    note: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
});
mongoose.model('Product', ProductSchema);
ProductSchema.pre("save", function(next){
    this.name = xss(this.name.trim());
    this.level = xss(this.level.trim());
    this.type = xss(this.type.trim());
    this.alcohol = xss(this.alcohol.trim());
    this.year = xss(this.year.trim());
    this.brewing = xss(this.brewing.trim());
    this.tasting = xss(this.tasting.trim());
    this.honor = xss(this.honor.trim());
    this.note = xss(this.note.trim());
    next();
});
