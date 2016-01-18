/**
 *@description: requireJS 配置文件
 *@author: LiuJ
 *@date: 2016/1/14
 */

require.config({
    baseUrl: "/js", // 根目录
    paths: {
        "zepto": "lib/zeptojs/zepto",
        "ejs": "lib/ejs/ejs",
        "moment": "lib/moment/moment",
        "moment-locale": "lib/moment/locale/zh-cn"
    }, // 别名
    shim: {
        "zepto": {
            exports: "$"
        },
        "ejs": {
            exports: "EJS"
        }// 处理不满足AMD规范的库
    }
});