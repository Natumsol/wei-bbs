/**
 *@description:网站初始化
 *@author: LiuJ
 *@date: 2016/2/17
 */
require("./config/mongoose.js")();
var mongoose = require("mongoose");
var User = mongoose.model("User");

var admin = new User({
    username:"admin",
    password:"123456789",
    isAdmin:true
});
admin.save(function(err){
    if(err){
        console.log("初始化失败：" + err.message)
    } else {
        console.log("初始化成功！");
    }
    process.exit();
});
