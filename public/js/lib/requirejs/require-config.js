/**
 *@description: requireJS 配置文件
 *@author: LiuJ
 *@date: 2016/1/14
 */

require.config({
    baseUrl: "/js", // 根目录
    paths: {
        "zepto": "lib/zeptojs/zepto",
        "ejs": "lib/ejs/ejs"
    }, // 别名
    shim: {
        'zepto': {
            exports: '$'
        },
        'ejs': {
            exports: "ejs"
        }// 处理不满足AMD规范的库
    }
});