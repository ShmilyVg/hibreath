import * as tools from "../../utils/tools";

export function dealInputEvent({value, inputType}) {
    if (inputType === 'digit' && value.weight) {
        let arr = value.weight.toString().split("."), [weightIndex0, weightIndex1] = arr;
        console.log(weightIndex0, weightIndex1);
        weightIndex0 = parseInt(weightIndex0) || 0;
        if (arr.length > 2) {
            return Promise.reject({errMsg: '体重至多支持3位整数+1位小数'});
        }
        if (weightIndex1 && weightIndex1.length > 1) {
            return Promise.reject({errMsg: '体重至多支持3位整数+1位小数'});
        } else {
            let weightIndex1 = parseInt(weightIndex1) || 0;
            if (weightIndex1 >= 10) {
                return Promise.reject({errMsg: '体重至多支持3位整数+1位小数'});
            }
        }
        if (weightIndex0 >= 1000) {
            return Promise.reject({errMsg: '体重至多支持3位整数+1位小数'});
        }
        value.weight = parseFloat(value.weight).toFixed(1);
        return Promise.resolve({value});
    }
}

export function oneDigit(e) {
    const weightNumber = e.detail.value.split(".");
    if(weightNumber[1]>9 ||weightNumber[1] === "0"){
        return tools.subStringNum(e.detail.value)
    }
    if(weightNumber.length>2){
        return parseInt(e.detail.value);
    }
}
