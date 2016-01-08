/**
 * Created by LiuJ on 2016/1/8.
 */
var webchat = require('weixin-api');
var mongoose = require("mongoose");
var User = mongoose.model("User");
var weixinAuthConfig = require("../../config/weixinAuthConfig.js");
var querystring = require("querystring");
webchat.token = 'qbtest';
// 监听文本消息
webchat.textMsg(function(msg) {
    console.log("textMsg received");
    console.log(JSON.stringify(msg));

    var resMsg = {};

    switch (msg.content) {
        case "微论坛" :
            // 返回文本消息
            var url = weixinAuthConfig.authorizeURL + "?" + querystring.stringify({
                    appid: weixinAuthConfig.appId,
                    redirect_uri: weixinAuthConfig.callback,
                    response_type: "code",
                    scope: "snsapi_userinfo",
                    state: "1"
                }) + "#wechat_redirect";
            resMsg = {
                fromUserName : msg.toUserName,
                toUserName : msg.fromUserName,
                msgType : "text",
                content : "<a href = '" + url + "'>点击进入微社区</a>",
                funcFlag : 0
            };
            webchat.sendMsg(resMsg);
            break;

        case "音乐" :
            // 返回音乐消息
            resMsg = {
                fromUserName : msg.toUserName,
                toUserName : msg.fromUserName,
                msgType : "music",
                title : "音乐标题",
                description : "音乐描述",
                musicUrl : "音乐url",
                HQMusicUrl : "高质量音乐url",
                funcFlag : 0
            };
            webchat.sendMsg(resMsg);
            break;

        case "图文" :

            var articles = [];
            articles[0] = {
                title : "PHP依赖管理工具Composer入门",
                description : "PHP依赖管理工具Composer入门",
                picUrl : "http://weizhifeng.net/images/tech/composer.png",
                url : "http://weizhifeng.net/manage-php-dependency-with-composer.html"
            };

            articles[1] = {
                title : "八月西湖",
                description : "八月西湖",
                picUrl : "http://weizhifeng.net/images/poem/bayuexihu.jpg",
                url : "http://weizhifeng.net/bayuexihu.html"
            };

            articles[2] = {
                title : "「翻译」Redis协议",
                description : "「翻译」Redis协议",
                picUrl : "http://weizhifeng.net/images/tech/redis.png",
                url : "http://weizhifeng.net/redis-protocol.html"
            };

            // 返回图文消息
            resMsg = {
                fromUserName : msg.toUserName,
                toUserName : msg.fromUserName,
                msgType : "news",
                articles : articles,
                funcFlag : 0
            };
            webchat.sendMsg(resMsg);
            break;
        default :
            User.findOne({openid: msg.fromUserName}, function(err, user){
                if(err) throw err;
                console.log(user);
                console.log(user.nickname);
                resMsg = {
                    fromUserName : msg.toUserName,
                    toUserName : msg.fromUserName,
                    msgType : "text",
                    content :  user.nickname + "， 你是傻逼吗？",
                    funcFlag : 0
                };
                webchat.sendMsg(resMsg);
            })


    }


});

// 监听图片消息
webchat.imageMsg(function(msg) {
    console.log("imageMsg received");
    console.log(JSON.stringify(msg));
});

// 监听位置消息
webchat.locationMsg(function(msg) {
    console.log("locationMsg received");
    console.log(JSON.stringify(msg));
});

// 监听链接消息
webchat.urlMsg(function(msg) {
    console.log("urlMsg received");
    console.log(JSON.stringify(msg));
});

// 监听事件消息
webchat.eventMsg(function(msg) {
    console.log("eventMsg received");
    console.log(JSON.stringify(msg));
});

exports.webchat = webchat;