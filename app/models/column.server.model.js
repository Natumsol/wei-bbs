/**
 * Created by LiuJ on 2016/1/11.
 * 栏目数据模型
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ColumnSchema = new Schema({

});
mongoose.model('Column', ColumnSchema);