/**
 *@description:
 *@author: Sulfer
 *@date: 2/10 0010
 */

'use strict';

/**
 * 获取用户信息
 */
var UAParser = require('user-agent-parser');
var parser = new UAParser();
exports.getUserInformation = function (req) {
    var ua = parser.setUA(req.headers['user-agent']).getResult();
    var ip = req.ip;
    return {
        browser: ua.browser.name,
        version: ua.browser.version,
        os: ua.os.name,
        osversion: ua.os.version,
        ip: ip,
        url: req.url
    };
};
