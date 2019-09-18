function createDateAndTime(timeStamp) {
    let date = new Date(timeStamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let dateT = date.getFullYear() + '年' + (month < 10 ? ('0' + month) : month) + '月' + (day < 10 ? ('0' + day) : day) + '日';
    let time = (hour < 10 ? ('0' + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute);
    return {date: dateT, time: time, day: day, month: month, year: year};
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
    if(a_type == "number"){
        var aStr = a.toString();
        var aArr = aStr.split('.');
    }else if(a_type == "string"){
        var aArr = a.split('.');
    }

    if(aArr.length > 1) {
        a = aArr[0] + "." + aArr[1].substr(0, 1);
    }
    return parseFloat(a)
}



module.exports = {
    createDateAndTime,
    deleteLineBreak,
    subStringNum
}
