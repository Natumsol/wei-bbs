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
var LikeSchema = new Schema({
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
    column: {
        type: Schema.Types.ObjectId,
        ref: "Column"
    },
    createDate: {type: Date, default: Date.now},
    modifyDate: {type: Date, default: Date.now},
    comments:[{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes:[{
        type: Schema.Types.ObjectId,
        ref: "Like"
    }],
    viewCount: {type: Number, dafault: 0}
});

ArticleSchema.pre("save", function(next){
    this.content = xss( this.content.trim());
    next();
});
ArticleSchema.pre('remove', function(next) {
    // 删除文章时，删除所以评论和赞

    next();
});
mongoose.model('Comment', CommentSchema);
mongoose.model('Like', LikeSchema);
mongoose.model('Article', ArticleSchema);
