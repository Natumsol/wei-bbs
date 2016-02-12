/**
 *@description: test async
 *@author: LiuJ
 *@date: 2016/1/15
 */
var async = require("async");
/*async.each([1,2,3], function(num, callback){
    if(num > 2) {
        callback("fuck", num)
    } else {
        callback(null, num);
    }
}, function(err){
    if(err) console.log(err);
    else console.log("ok!");
});*/

var tasks = [];
var task1 = function(callback){
    callback(null, "task1");
}
var task2 = function(callback){
    callback(null, "task2");
}
tasks.push(task1);
tasks.push(task2);
async.parallel(tasks, function(err, result) {
    if(err) console.log(err);
    else console.log(result);
});