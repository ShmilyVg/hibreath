function createDateAndTime(timeStamp) {
    let date = new Date(timeStamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let dateT = date.getFullYear() + '年' + (month < 10 ? ('0' + month) : month) + '月' + (day < 10 ? ('0' + day) : day) + '日';
    let dateX = date.getFullYear() + '/' + (month < 10 ? ('0' + month) : month) + '/' + (day < 10 ? ('0' + day) : day);
    let time = (hour < 10 ? ('0' + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute);
    return {date: dateT, dateX, time: time, day: day, month: month, year: year};
}

function createDateAndTime06(timestamp01, timestamp02) {
    let date01 = new Date(timestamp01);
    let date02 = new Date(timestamp02);
    let month = date01.getMonth() + 1;
    let day = date01.getDate();
    let month02 = date02.getMonth() + 1;
    let dateT01 = date01.getFullYear() + '年' + (month < 10 ? ('0' + month) : month) + '月' + (day < 10 ? ('0' + day) : day) + '日';
    let dateT02 = (date02.getFullYear() === date01.getFullYear() ? '' : date02.getFullYear() + '年') + (month02 < 10 ? ('0' + month02) : month02) + '月' + (date02.getDate() < 10 ? ('0' + date02.getDate()) : date02.getDate()) + '日';
    return dateT01 + '-' + dateT02;
}

function deleteLineBreak(str) {
    return str.replace(/[\r\n]/g, "");
}

//PPM 小数位不为0则保留一位小数 不四舍五入  小数位为0 则取整 1.0=>1
/*function resultRe(score){
    return parseFloat(( parseInt( score * 100 ) / 100 ).toFixed(1))
}*/
function subStringNum(a) {
    var a_type = typeof(a);
    if (a_type == "number") {
        var aStr = a.toString();
        var aArr = aStr.split('.');
    } else if (a_type == "string") {
        var aArr = a.split('.');
    }

    if (aArr.length > 1) {
        a = aArr[0] + "." + aArr[1].substr(0, 1);
    }
    return parseFloat(a)
}
// 替换表情为空
function filterEmoji(name){
    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");
    return str;
}

// 替换空格
function filterSpace(name){
    var str = name.replace(/\s+/g, '');
    return str;
}
module.exports = {
    createDateAndTime,
    deleteLineBreak,
    subStringNum,
    createDateAndTime06,
    filterEmoji,
    filterSpace
}
