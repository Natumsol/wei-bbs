/**
 *@description: column controller
 *@author: LiuJ
 *@date: 2016/1/11
 */
var mongoose = require("mongoose");
var Column = mongoose.model("Column");
var is = require("is");
/**
 *
 * @param req
 * @param res
 * @param next
 */
function add(req, res, next){
    var column = new Column(req.body);
    column.save(function(err, column){
        if(err){
            throw err;
        }
        console.log("column 保存成功！");
    });
}
/**
 *
 * @param req
 * @param res
 * @param next
 */
function list(req, res, next){
    var start = req.body.start;
    var limit = req.body.limit || 10;
    if(!is.integer (start) || !is.integer(limit)) {
        throw "参数错误！";
    }
    Column.find({}, function(err, columns){
        if(err) throw err;
        res.json(columns);
    })
}
/**
 *
 * @param req
 * @param res
 * @param next
 */
function modify(req, res, next){
    // TODO
    var name = req.body.name;
    var id = req.body.id;
    Column.findOneAndUpdate({_id: id}, {name: name}, function(err, column){
        if(err) {
            res.json({
                message:"更新失败",
                status: 0
            });
        } else {
            res.json({
                message:"更新成功！",
                status: 1
            })
        }
    });
}
/**
 *
 * @param req
 * @param res
 * @param next
 */
function remove(req, res, next){
    // TODO
    var id = req.body.id;
    Column.findOneAndRemove({_id: id}, function(err, column){
        if(err) {
            res.json({
                message:"删除失败",
                status: 0
            });
        } else {
            res.json({
                message:"删除成功！",
                status: 1
            })
        }
    });
}

module.exports = {
    add: add,
    list: list,
    modify:modify,
    remove: remove
};