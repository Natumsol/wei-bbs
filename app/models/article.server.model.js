/**
 * Created by LiuJ on 2016/1/11.
 * 文章数据模型
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
    author: Schema.Types.ObjectId,
    title: String,
    content: String,
    column: Schema.Types.ObjectId,
    date: { type: Date, default: Date.now },
    comments:[{
        body: String,
        author: Schema.Types.ObjectId,
        date:{
            type: Date,
            default: Date.now
        }
    }],
    likes:[{
        author: Schema.Types.ObjectId,
        date:{
            type: Date,
            default: Date.now
        }
    }],
    viewCount:{type: Number, dafault: 0},
    isRead: Boolean

});
mongoose.model('Article', ArticleSchema);