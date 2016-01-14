/**
 *@description:
 *@author: LiuJ
 *@date: 2016/1/14
 */

require.config({
    baseUrl: "/js",
    paths: {
        "zepto": "/lib/zeptojs/zepto.js",
        "ejs": "/lib/ejs/ejs.js"
    },
    shim: {
        'zepto': {
            exports: '$'
        }
    }
});