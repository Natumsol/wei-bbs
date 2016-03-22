/**
 * Created by LiuJ on 2016/02/01.
 * 资讯数据模型
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var config = require("../../config/config");
var xss =  require("xss");
var myxss = new xss.FilterXSS(config.xss);
var NewsSchema = new Schema({
    author:  {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: String,
    content: String,
    isSlider: {
        type: Boolean,
        default: false
    },
    sliderImg:{
        type: String,
        default: null
    },
    createDate: {type: Date, default: Date.now},
    modifyDate: {type: Date, default: Date.now},
    viewCount: {type: Number, dafault: 0}
});

NewsSchema.pre("save", function(next){
    this.content = myxss.process(this.content.trim());
    next();
});

NewsSchema.pre('remove', function(next) {
    // 删除文章时，删除所以评论和赞
    next();
});
mongoose.model('News', NewsSchema);
