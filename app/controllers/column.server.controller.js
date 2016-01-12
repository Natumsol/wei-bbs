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
            res.json({
                status: 0,
                errInfo: err.message
            });
        }
        res.json({
            status: 1
        });
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
    var start = parseInt(req.body.start);
    var limit = parseInt(req.body.limit) || 10;
    if(!is.integer (start) || !is.integer(limit)) {
        res.json({
            errInfo: "参数错误",
            status: 0
        })
    } else {
        Column.find().skip(start).limit(limit).exec(function (err, columns) {
            if (err) {
                res.json({
                    errInfo: "数据库查询出错",
                    status: 0
                })
            }
            res.json(columns);
        })
    }
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
                errInfo: "更新失败",
                status: 0
            });
        } else {
            res.json({
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
                errInfo: "删除失败",
                status: 0
            });
        } else {
            res.json({
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