/**
 *@description: requireJS 配置文件
 *@author: LiuJ
 *@date: 2016/1/14
 */

require.config({
    baseUrl: "/js", // 根目录
    paths: {
        "zepto": "lib/zeptojs/zepto",
        "zepto-touch":"lib/zeptojs/zepto.touch",
        "ejs": "lib/ejs/ejs",
        "moment": "lib/moment/moment",
        "moment-locale": "lib/moment/locale/zh-cn",
        "editor":"lib/editor/js/editor"
    }, // 别名
    shim: {
        "zepto": {
            exports: "$"
        },
        "ejs": {
            exports: "EJS"
        },// 处理不满足AMD规范的库
        "zepto-touch":["zepto"],
        "editor":["zepto"]
    }
});