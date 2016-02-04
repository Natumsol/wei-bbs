/**
 *@description:
 *@author: LiuJ
 *@date: 2016/1/11
 */
require("../config/mongoose.js")();
var mongoose = require("mongoose");
var News = mongoose.model("News");
News.findOne({_id:"56b3154ae814d77904093b27"}, function(err, news){
    if(err) throw  err;
    console.log(news);

    News.find({createDate:{$lt: news.createDate}}).limit(1).exec(function(err, _news){
        if(err) throw err;
        else console.log(_news);
        process.exit();
    });
});
