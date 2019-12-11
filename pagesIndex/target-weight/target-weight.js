import * as tools from "../../utils/tools";

Page({


    data: {
        targetWeightValue: ''
    },


    onLoad(options) {

    },

    targetWeightBindInputEvent(e) {
        console.log("targetWeightBindInputEvent", e.detail.value);
        const value = this.oneDigit(e);
        console.log(value);
        this.setData({"targetWeightValue": value});
        return value;
    },

    saveTargetWeightEvent() {
        let {targetWeightValue: value} = this.data;
        if (value) {
            if (value.indexOf('.') !== -1) {
                value += '0';
            }
            console.log('tempValue.targetWeightValue', value);
            getApp().globalData.tempValue.targetWeightValue = value;
        }
    },

    oneDigit(e) {
        const {value} = e.detail, weightNumber = value.split(".");
        console.log(weightNumber);
        if (weightNumber[1] > 9 || weightNumber[1] === "0") {
            return tools.subStringNum(value)
        }
        if (weightNumber.length > 2) {
            const [first, second] = weightNumber;
            return first + '.' + second;
        }
        return value;
    }
});
