/**
 *@description:
 *@author: LiuJ
 *@date: 2016/1/15
 */
var moment = require("moment");
moment.locale("zh_cn");
function format(string) {
    return moment(new Date(string)).fromNow();
}
exports.format = format;
