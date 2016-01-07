/**
 * Created by LiuJ on 2016/1/7.
 */
var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
    openid:String,
    nickname: String,
    sex: Number,
    language: String,
    city: String,
    provinc: String,
    country:String,
    headimgurl: String,
    privileg: []
});
mongoose.model('User', UserSchema);