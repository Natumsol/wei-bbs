/**
 * Created by LiuJ on 2016/1/6.
 */
var webchat = require("../controllers/webchat.server.controller.js").webchat;
module.exports = function(app){
    app.get("/webchat", function(req, res, next){
        if (webchat.checkSignature(req)) {
            res.send(req.query.echostr)
        } else {
            res.send('fail');
        }
    });
    app.post("/webchat", function(req, res){
        webchat.loop(req, res);
    })
};

