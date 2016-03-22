/**
 * Created by LiuJ on 2016/1/11.
 * 文章数据模型
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var config = require("../../config/config");
var xss =  require("xss");
var myxss = new xss.FilterXSS(config.xss);
var CommentSchema = new Schema({
    body: String,
    author:  {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

var ArticleSchema = new Schema({
    author:  {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: String,
    content: String,
    images:[{
        type: String
    }],
    createDate: {type: Date, default: Date.now},
    modifyDate: {type: Date, default: Date.now},
    comments:[{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    viewCount: {type: Number, dafault: 0},
    isTop:{
        type: Boolean,
        default: false
    }
});

ArticleSchema.pre("save", function(next){
    this.content = myxss.process( this.content.trim());
    next();
});

CommentSchema.pre("save", function(next){
    this.body = myxss.process(this.body.trim());
    next();
});

mongoose.model('Comment', CommentSchema);
mongoose.model('Article', ArticleSchema);
