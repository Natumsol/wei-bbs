/**
 * Created by LiuJ on 2016/1/11.
 * 文章数据模型
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var xss = require("xss");
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
    this.content = xss( this.content.trim());
    next();
});

mongoose.model('Comment', CommentSchema);
mongoose.model('Article', ArticleSchema);
