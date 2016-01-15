/**
 *@description:
 *@author: LiuJ
 *@date: 2016/1/15
 */
define(['moment'], function(moment){
    moment.locale("zh_cn");
    function format(string) {
        return moment(new Date(string)).fromNow();
    }

    return {
        format: format
    }
});