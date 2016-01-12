/**
 * Created by LiuJ on 2016/1/11.
 * 文章数据模型
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
    body: String,
    author: String,
    date: {
        type: Date,
        default: Date.now
    }
});
var ArticleSchema = new Schema({
    author: String,
    title: String,
    content: String,
    column: Schema.Types.ObjectId,
    createDate: {type: Date, default: Date.now},
    modifyDate: {type: Date, default: Date.now},
    comments:[{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes:[{
        author: String,
        date:{
            type: Date,
            default: Date.now
        },
        isRead: Boolean
    }],
    viewCount: {type: Number, dafault: 0}
});

mongoose.model('Comment', CommentSchema);
mongoose.model('Article', ArticleSchema);
