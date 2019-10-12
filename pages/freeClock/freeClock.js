import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {Toast} from "heheda-common-view";

Page({
    data: {},
    onLoad(options) {
        this.dataId = options.dataId;
    },

    async submit(e) {
        console.log('提交打卡所有内容', e.detail.value);
        const {value: {sportDuration: duration, sportFeel, sportWays}} = e.detail;
        if (!sportWays || !sportWays.length) {
            Toast.showText('至少要选择一项运动方式', 3000);
            return;
        }
        const freestyleIds = sportWays.map(item => item.id);
        const calorie = sportWays.map(item => item.calorie).reduce((total, current) => {
            return total + current;
        });
        const {result: {id: dataId}} = await Protocol.postTaskSportStyle({
            duration, freestyleIds, calorie, feelDesc: sportFeel.trim(),
            dataId: this.dataId
        });
        HiNavigator.redirectToFinishCheck({dataId});
    }
});
