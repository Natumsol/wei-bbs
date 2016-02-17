/**
 * Created by LiuJ on 2016/1/7.
 * 用户数据模型
 */
var mongoose = require("mongoose");
crypto = require('crypto');
var UserSchema = new mongoose.Schema({
    openid:String,
    password:String,
    username:String,
    salt: String,
    nickname: {
        type:String,
        default: null
    },
    sex: Number,
    language: {
        type:String,
        default: null
    },
    city: String,
    provinc: {
        type:String,
        default: null
    },
    country:{
        type:String,
        default: null
    },
    headimgurl: {
        type:String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    privileg: []
});
/**
 * save方法前进行密码哈希化
 */
UserSchema.pre('save', function(next) {
    if(!this.username) {
        this.username = crypto.randomBytes(16).toString('base64');
    }
    if(!this.password) {
        this.password = crypto.randomBytes(16).toString('base64');
    }
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

/**
 * 为哈希密码创建实例方法
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * 为验证用户创建实例方法
 */
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);