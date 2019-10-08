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
        const {currentIndex} = this.data, {frontTimestamp: timeBegin, endTimestamp: timeEnd} = timeObj, list = [];
        switch (currentIndex) {
            case 0: {
                let {result: {list: weightDataList}} = await Protocol.postWeightDataListAll({
                    timeBegin,
                    timeEnd
                });
                list.push(...weightDataList);
            }
                break;
            case 1: {
                let {result: {list: bloodPressureDataList}} = await Protocol.postBloodPressureDataListAll({
                    timeBegin,
                    timeEnd
                });
                list.push(...bloodPressureDataList);
            }
                break;
            case 2: {
                let {result: {list: heartDataList}} = await Protocol.postHeartDataListAll({
                    timeBegin,
                    timeEnd
                });
                list.push(...heartDataList);
            }
                break;
            default:
                break;
        }

        if (isRefresh) {
            this.data.dataList = [];
        }
        list.forEach((value) => {
            const {time, dateX} = Tools.createDateAndTime(value.time * 1000);
            value.date = {time, date: dateX};
            if (!value.dataValue) {
                value.isBloodPressure = true;
                value.dataValue = value.height + '/' + value.low;
            }
        });
        this.setData({dataList: list}, () => {
            this.handleTrendData();
        });
    },

    async handleTrendData() {
        let dataListX = [], dataListY = [];
        this.data.dataList.forEach((value) => {
            if (value.isBloodPressure) {

            } else {
                const {day: y} = Tools.createDateAndTime(value.createdTimestamp);
                dataListX.push(y);
                dataListY.push(value.dataValue);
            }
        });
        if (!dataListX.length) {
            dataListX.push(0);
            dataListY.push(0);
        }
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
                await Protocol.postBloodPressureDataAdd({height: 120, low: 80});
                break;
            case 2:
                await Protocol.postHeartDataAdd({dataValue: 70});
                break;
            default:
                break
        }
    },
})
