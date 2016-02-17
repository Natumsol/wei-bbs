/**
 *@description:
 *@author: Sulfer
 *@date: 2/10 0010
 */
var statistics = require("../controllers/statistics.server.controller.js");
var user  = require("../controllers/user.server.controller.js");
var chalk = require("chalk");
module.exports = function (app) {
    var nameSpace = "/statistics";
    app.use(statistics.doStatistics);
    app.post(nameSpace + "/getVisitors", user.checkAdminLogin, statistics.getVisitors);
    app.post(nameSpace + "/getPieData", user.checkAdminLogin, function(req, res, next){
        statistics.getPieData(function(err, result){
            if(err) res.send(err.message);
            else res.json(result);
        })
    });
    app.get(nameSpace + "/getIndexInfo", user.checkAdminLogin, function(req, res){
        statistics.getIndexInfo(function(err, result){
            if(err) res.send(err.message);
            else res.json(result);
        })
    });
    app.get("/manage" + nameSpace, user.checkAdminLogin, function(req, res){
        statistics.getIndexInfo(function(err, result){
            res.render("manage/index",{
                err: err,
                indexInfo: result
            })
        })
    })
};