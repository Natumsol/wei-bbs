/**
 *@description: test async
 *@author: LiuJ
 *@date: 2016/1/15
 */
var async = require("async");
async.each([1,2,3], function(num, callback){
    if(num > 2) {
        callback("fuck", num)
    } else {
        callback(null, num);
    }
}, function(err){
    if(err) console.log(err);
    else console.log("ok!");
});