// pages/food/food.js
import * as Trend from "../../view/trend";
import Protocol from "../../modules/network/protocol";
import * as Tools from "../../utils/tools";
import {getEndZeroTimestamp, getFrontZeroTimestamp, getLatestOneWeekTimestamp, getTimeString} from "../../utils/time";
import HiNavigator from "../../navigator/hi-navigator";
import {Toast, WXDialog} from "heheda-common-view";
import {dealInputEvent} from "./manager";

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
            {
                type: 'weight',
                maxLength: 5,
                inputType: 'digit',
                text: '体重', addText: '记体重', addProjectList: [
                    {
                        id: 'weight',
                        title: '体重(kg)',
                        placeholder: '请输入您的体重',
                        type: 'weight'
                    }
                ]
            },
            {
                type: 'bloodPressure',
                maxLength: 3,
                inputType: 'number',
                text: '血压', addText: '记血压', addProjectList: [
                    {
                        id: 'high',
                        title: '高压(mmHg)',
                        placeholder: '请输入您的高压',
                        type: 'high'
                    },
                    {
                        id: 'low',
                        title: '低压(mmHg)',
                        placeholder: '请输入您的低压',
                        type: 'low'
                    }]
            },
            {
                type: 'heart',
                maxLength: 3,
                inputType: 'number',
                text: '心率', addText: '记心率', addProjectList: [
                    {
                        id: 'heart',
                        title: '心率(BMP)',
                        placeholder: '请输入您的心率',
                        type: 'heart'
                    }
                ]
            }
        ],
        currentIndex: 0,
        dataList: [],
        dataTrend: [],
        canvasShow: true,
        dataTrendTime: ''
    },

    onLoad() {
        Trend.init(this);
    },


    async onReady() {
        Trend.initTouchHandler();
        this.updateTrendTime({frontTimestamp: getLatestOneWeekTimestamp(), endTimestamp: Date.now()});
    },

    onShow() {
        const {trendTime} = getApp().globalData;

        if (trendTime) {
            const {startTimeValue: frontTimestamp, endTimeValue: endTimestamp} = trendTime;
            this.updateTrendTime({frontTimestamp, endTimestamp});
            getApp().globalData.trendTime = null;
        }

    },
    toCalendarPage() {
        HiNavigator.navigateToCalendar({type: this.data.topChose[this.data.currentIndex].type});
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
        const {currentIndex, topChose} = this.data, {frontTimestamp: timeBegin, endTimestamp: timeEnd} = timeObj,
            list = [];
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
        const isBloodPressure = topChose[currentIndex].type === 'bloodPressure';
        list.forEach((value) => {
            const {time, dateX} = Tools.createDateAndTime(value.time * 1000);
            value.date = {time, date: dateX};
            if (isBloodPressure) {
                value.isBloodPressure = true;
                value.dataValue = value.height + '/' + value.low;
            }
        });
        this.setData({dataList: list}, () => {
            this.handleTrendData();
        });
    },

    async handleTrendData() {
        let dataListX = [], dataListY = [], dataListY2 = [], dataListY1Name = '', dataListY2Name = '';
        this.data.dataList.sort(function (item1, item2) {
            return item1.createdTimestamp - item2.createdTimestamp;
        }).forEach((value) => {
            const {month,day} = Tools.createDateAndTime(value.createdTimestamp);
            dataListX.push(month + '月' + day+'日');
            if (value.isBloodPressure) {
                dataListY.push(value.height);
                dataListY2.push(value.low);
            } else {
                dataListY.push(value.dataValue);
            }
        });
        if (!dataListX.length) {
            dataListX.push(0);
            dataListY.push(0);
        }
        if (dataListY2.length) {
            dataListY1Name = '高压';
            dataListY2Name = '低压';
        } else {
            const {currentIndex, topChose} = this.data;
            dataListY1Name = topChose[currentIndex].text;
        }
        Trend.setData({dataListX, dataListY, dataListY1Name, dataListY2, dataListY2Name, yAxisSplit: 5}, 650);
    },

    bindTapTopChose(e) {
        const {currentTarget: {dataset: {index: currentIndex}}} = e;
        if (currentIndex !== this.data.currentIndex) {
            this.setData({currentIndex}, () => {
                this.handleListData({isRefresh: true});
            });
        }
    },
    onDialogShowEvent(e) {
        console.log(e);
        this.setData({
            canvasShow: !e.detail.show
        })
    },
    async onSubmitEvent(e) {
        console.log(e);

        const {currentIndex} = this.data, {detail: {inputType, value}} = e;
        let failed = false;
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                if (!parseInt(value[key])) {
                    failed = true;
                }
            }
        }
        if (!failed) {
            try {
                switch (currentIndex) {
                    case 0:
                        const {value: finalValue} = await dealInputEvent({value, inputType});
                        await Protocol.postWeightDataAdd(finalValue);
                        break;
                    case 1:
                        await Protocol.postBloodPressureDataAdd(value);
                        break;
                    case 2:
                        await Protocol.postHeartDataAdd(value);
                        break;
                    default:
                        break;
                }
                await this.handleListData({isRefresh: true});
            } catch (e) {
                console.error(e);
                WXDialog.showDialog({content: e.errMsg});
            }
        } else {
            Toast.warn('请填写完整信息');
        }

    },
    choseItem() {
        return this.data.currentIndex;
    },

});
