/**
 *@description:
 *@author: Sulfer
 *@date: 2/1 0001
 */
var fs = require("fs");
fs.readFile("font-awesome.css", function(err, data){
    //console.log(data.toString("utf-8"));
    var data = data.toString("utf-8");
    var icons = data.match(/\.(fa-.*?):/g);
    var result = [];
    for(var i = 0; i < icons.length; i ++){
        result.push("<li class='fa " + icons[i].replace(/\.|:|,|\s/g, "") + "'></li>");
    }
    console.log(result.join("\n"));
    fs.writeFile("result.html",result.join("\n"), function(err){
        console.log("ok!");
    })
});