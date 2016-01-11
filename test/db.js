/**
 *@description:
 *@author: LiuJ
 *@date: 2016/1/11
 */
require("../config/mongoose.js")();
var mongoose = require("mongoose");
var User = mongoose.model("User");
User.findOne({_id:"568e6e9514c8f84806d0c158"}, function(err, user){
    if(err) throw  err;
    if(!user) console.log("查询为空！");
    else console.log(user._id);
    process.exit();
});
