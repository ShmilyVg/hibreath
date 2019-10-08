// pages/food/food.js
import * as Trend from "../../view/trend";
import Protocol from "../../modules/network/protocol";
import * as Tools from "../../utils/tools";
import {getEndZeroTimestamp, getFrontZeroTimestamp, getLatestOneWeekTimestamp, getTimeString} from "../../utils/time";

const timeObj = {
    _frontTimestamp: 0,
    _endTimestamp: 0,
    set frontTimestamp(timestamp) {
        this._frontTimestamp = getFrontZeroTimestamp({timestamp});
    },
    get frontTimestamp() {
        return this._frontTimestamp;
    },
    set endTimestamp(timestamp) {
        this._endTimestamp = getEndZeroTimestamp({timestamp});
    },
    get endTimestamp() {
        return this._endTimestamp;
    }
};
Page({

    data: {
        topChose: [
            {text: '体重', addText: '记体重'},
            {text: '血压', addText: '记血压'},
            {text: '心率', addText: '记心率'}
        ],
        currentIndex: 0,
        dataList: [],
        dataTrend: [],

        dataTrendTime: ''
    },

    onLoad() {
    },


    async onReady() {
        Trend.init(this);
        this.updateTrendTime({frontTimestamp: getLatestOneWeekTimestamp(), endTimestamp: Date.now()});
    },

    updateTrendTime({frontTimestamp, endTimestamp}) {
        // const {timeObj} = this.data;
        timeObj.frontTimestamp = frontTimestamp;
        timeObj.endTimestamp = endTimestamp;
        this.setData({
            dataTrendTime: getTimeString({
                frontTimestamp: timeObj.frontTimestamp,
                endTimestamp: timeObj.endTimestamp
            })
        }, async () => {
            await this.handleListData({isRefresh: true});
        });
    },

    async handleListData({isRefresh = false} = {}) {
        const {currentIndex} = this.data, {frontTimestamp: timeBegin, endTimestamp: timeEnd} = timeObj;
        switch (currentIndex) {
            case 0:
                let {result: {list}} = await Protocol.postWeightDataListAll({
                    timeBegin,
                    timeEnd
                });
                if (isRefresh) {
                    this.data.dataList = [];
                }
                list.forEach((value) => {
                    const {time, dateX} = Tools.createDateAndTime(value.time * 1000);
                    value.date = {time, date: dateX};
                });
                this.setData({dataList: list}, () => {
                    this.handleTrendData();
                });
                break;
            case 1:
                break;
            case 2:
                break;
            default:
                break
        }
    },

    async handleTrendData() {
        let dataListX = [], dataListY = [];
        this.data.dataList.forEach((value) => {
            const {day: y} = Tools.createDateAndTime(value.createdTimestamp);
            dataListX.push(y);
            dataListY.push(value.dataValue);
        });
        Trend.setData({dataListX, dataListY, yAxisSplit: 5});
    },

    bindTapTopChose(e) {
        const {currentTarget: {dataset: {index: currentIndex}}} = e;
        if (currentIndex !== this.data.currentIndex) {
            this.setData({currentIndex}, () => {
                this.handleListData({isRefresh: true});
            });
        }
    },

    choseItem() {
        return this.data.currentIndex;
    },

    async bindTapAddData() {
        const {currentIndex} = this.data;
        switch (currentIndex) {
            case 0:
                await Protocol.postWeightDataAdd({dataValue: 70});
                break;
            case 1:
                break;
            case 2:
                break;
            default:
                break
        }
    },
})
