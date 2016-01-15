/**
 *@description: test async
 *@author: LiuJ
 *@date: 2016/1/15
 */
require("../config/mongoose.js")();
var mongoose = require("mongoose");
var Article = mongoose.model("Article");
var Comment = mongoose.model("Comment");
var User = mongoose.model("User");
var Q = require("q");
var fs = require("fs");
var myarticles;
/*
 var getArticle = function(){
 return Q.promise(function(resolve, reject, notify){
 Article.find({}, function(err, artilces){
 if(err) reject(err);
 else resolve(artilces);
 });
 })
 };

 getArticle().then(function(articles){
 //console.log(articles);
 myarticles = articles;
 var articlePromsie = [];
 articles.forEach(function(article){
 var commentPromise = [];
 article.comments.forEach(function(comment, index, comments){
 commentPromise.push(
 Q.promise(function(resolve, reject){
 Comment.findOne({_id: comment}, function(err, comment){
 if(err) reject(err);
 else {
 comments[index] = comment;
 resolve(articles);
 }
 })
 })
 );
 });
 articlePromsie.push(Q.all(commentPromise));
 });
 return Q.all(articlePromsie);
 }).then(function(){
 return Q.promise(function(resolve, reject){
 User.findOne({_id: myarticles.author}, function(err, user){
 if(err) reject(err);
 else {

 resolve(user);
 }
 });
 })

 }).then(function(){
 fs.writeFile("test.json", JSON.stringify(myarticles), function(err){
 if(err) throw err;
 else console.log("save ok~");
 process.exit();
 })
 });*/
var options = [{path: 'comments'}, {path: 'author', select: 'nickname -_id'}];
Article.find().populate(options).exec(function (err, articles) {
    Article.populate(articles, [{
        path: 'comments.author',
        model: "User",
        select: 'nickname'
    }], function (err, articles) {

    });
});