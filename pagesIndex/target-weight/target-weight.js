import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {Toast} from "heheda-common-view";

Page({


    data: {
        targetWeightValue: ''
    },


    onLoad(options) {
        this.setData({
            targetWeightValue: options.targetWeight || 0
        });
    },

    targetWeightBindInputEvent(e) {
        console.log("targetWeightBindInputEvent", e.detail.value);
        const value = this.oneDigit(e);
        console.log(value);
        this.setData({"targetWeightValue": value});
        return value;
    },

    async saveTargetWeightEvent() {
        let {targetWeightValue: value} = this.data;
        if (value) {
            if (value.indexOf('.') !== -1) {
                value += '0';
            }
            console.log('tempValue.targetWeightValue', value);
            await Protocol.postMembersPutInfo({weightGoal: value});
            HiNavigator.navigateBack({delta: 1});
        } else {
            Toast.showText('请输入目标体重');
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
