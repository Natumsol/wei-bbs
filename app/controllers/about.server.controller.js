/**
 *@description: about controller
 *@author: LiuJ
 *@date: 2016/1/11
 */

var mongoose = require("mongoose");
var About = mongoose.model("About");
var is = require("is");
var chalk = require("chalk");
var formatter = require("../../tools/formatDate.js").format;
var fs = require('fs-extra')
var path = require("path");
var moment = require("moment");

/**
 *
 * @param req
 * @param res
 * @param next
 */
function modify(req, res, next) {
    var about = new About(req.body);
    var id = req.body.id;
    About.findOneAndUpdate({_id: id}, {
        title: about.title,
        content: about.content
    }, function (err, about) {
        if (err) {
            res.json({
                errInfo: "update error",
                status: 0
            })
        } else {
            res.json({
                status: 1,
                id: about._id
            })
        }
    })
}

/**
 *
 * @param id
 * @param callback
 */
function getAbout(callback) {
    About.find().exec(function (err, about) {
        if (err) callback(err);
        else if(about.length) {
            callback(null, about[0]);
        } else {
            (new About()).save(function(err, about){
                if (err) callback(err);
                else callback(null, about);
            });
        }
    });
}

module.exports = {
    modify: modify,
    getAbout: getAbout
};