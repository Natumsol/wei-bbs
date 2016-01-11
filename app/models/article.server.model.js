/**
 * Created by LiuJ on 2016/1/11.
 * 文章数据模型
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
    body: String,
    author: Schema.Types.ObjectId,
    date: {
        type: Date,
        default: Date.now
    }
});
var ArticleSchema = new Schema({
    author: Schema.Types.ObjectId,
    title: String,
    content: String,
    column: Schema.Types.ObjectId,
    createDate: {type: Date, default: Date.now},
    modifyDate: {type: Date, default: Date.now},
    comments:[{
        type: Schema.Types.ObjectId
    }],
    likes:[{
        author: Schema.Types.ObjectId,
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
