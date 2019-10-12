import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {Toast} from "heheda-common-view";

Page({
    data: {
        freestyleIds: [],
        duration: 20,
        feelDesc: ''
    },
    async onLoad(options) {
        this.dataId = options.dataId;
        if (this.dataId) {
            const {result: {id, freestyleIds, duration, feelDesc}} = await Protocol.postSportDataInfo({id: this.dataId});
            this.setData({
                freestyleIds: freestyleIds.map(item => parseInt(item)),
                duration: duration || 20,
                feelDesc
            })
        }
    },

    async submit(e) {
        const {value: {sportDuration: duration, sportFeel, sportWays}} = e.detail;
        if (!sportWays || !sportWays.length) {
            Toast.showText('至少要选择一项运动方式', 3000);
            return;
        }
        const freestyleIds = sportWays.map(item => item.id);
        const calorie = sportWays.map(item => item.calorie).reduce((total, current) => {
            return total + current;
        });
        if (!this.dataId) {
            const {result: {id: dataId}} = await Protocol.postTaskSportStyle({
                duration, freestyleIds, calorie, feelDesc: sportFeel.trim(),
                id: this.dataId
            });
            HiNavigator.redirectToFinishCheck({dataId, clockWay: 'free'});
        } else {
            await Protocol.postSportDataPut({
                duration, freestyleIds, calorie, feelDesc: sportFeel.trim(),
                id: this.dataId
            });
            HiNavigator.redirectToFinishCheck({dataId: this.dataId, clockWay: 'free'});
        }
    }
});
