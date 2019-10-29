// pages/result/result.js
/**
 * @Date: 2019-09-23 14:30:30
 * @LastEditors: 张浩玉
 */
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import {Toast as toast} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";
import * as Trend from "../../view/trend";
import * as Circular from "./view/circular";
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
        score: 3.5, //传入的进度， 0~100，绘制到此参数处停止。
        currenttab: '0',
        trendDate: '',
        page: 1,
        tabIsShow: true
    },

    async onLoad(e) {
        console.log('eeeeeee', e)
        if (e.id) {
            const {result: {visDes: fatDes, score, des}} = await Protocol.postSetGradeInfo({id: e.id});
            this.setData({
                fatDes, score, fatText: des.zhCh, fatTextEn: des.en
            });
        } else if (e.score) {
            const {fatText, fatTextEn, fatDes, score} = e;
            this.setData({
                fatText, fatTextEn, fatDes, score
            });
        }
        this.init();
        Circular.run();
        this.cellDataHandle({});
    },

    init() {
        Trend.init(this);
        Trend.initTouchHandler();
        Circular.init(this);
    },

    async cellDataHandle({page = 1, isRefresh = true}) {
        toast.showLoading();
        let {result: {list}} = await Protocol.getBreathDataList({page, pageSize: 20});
        if (list.length) {
            list.map(value => {
                const {time, day, month, year} = tools.createDateAndTime(value.time * 1000);
                value.date = `${year}/${month}/${day} ${time}`;
                let image = '../../images/result/cell';
                const dValue = value.dataValue;
                if (dValue >= 0 && dValue < 1) {
                    image = image + '1';
                } else if (dValue >= 1 && dValue < 2) {
                    image = image + '2';
                } else if (dValue >= 2 && dValue < 4) {
                    image = image + '3';
                } else if (dValue >= 4 && dValue < 6) {
                    image = image + '4';
                } else if (dValue >= 6) {
                    image = image + '5';
                }
                image = image + '.png';
                value.image = image
            });

            if (isRefresh) {
                this.data.page = 1;
            } else {
                list = this.data.trendData.concat(list);
            }
            this.setData({trendData: list});
        } else {
            --this.data.page;
        }
        wx.stopPullDownRefresh();
        toast.hiddenLoading();
    },

    toBind() {
        HiNavigator.navigateToDeviceUnbind();
    },

    toIndex() {
        HiNavigator.navigateIndex();
    },
    handlerGobackClick(){
        HiNavigator.switchToSetInfo()
    },
    //切换标签页
    selectTab(e) {
        let newtab = e.currentTarget.dataset.tabid;
        if (this.data.currenttab !== newtab) {
            this.setData({
                currenttab: newtab
            });
            if (newtab == 1) {
                const {frontTimestamp, endTimestamp} = timeObj;
                this.updateTrendTime({
                    frontTimestamp: frontTimestamp || getLatestOneWeekTimestamp(),
                    endTimestamp: endTimestamp || Date.now()
                });
            }
        }
    },

    async handleTrend({list}) {
        if (list && list.length) {
            let dataListX = [], dataListY = [];
            list.sort(function (item1, item2) {
                return item1.createdTimestamp - item2.createdTimestamp;
            }).forEach((value) => {
                const {month, day} = tools.createDateAndTime(value.createdTimestamp);
                dataListX.push(month + '月' + day + '日');
                dataListY.push(value.dataValue);
            });
            let dataTrend = {
                dataListX, dataListY, dataListY1Name: 'PPM', yAxisSplit: 5
            };
            Trend.setData(dataTrend);
        } else {
            toast.showText('该时间段内没有燃脂数据');
        }

    },

    toChooseDate() {
        wx.navigateTo({
            url: '../calendar/calendar?type=' + 'breath'
        });
    },

    onReachBottom() {
        console.log('onReachBottom');
        if (this.data.currenttab === '0') {
            this.cellDataHandle({page: ++this.data.page, isRefresh: false})
        }
    },

    onPullDownRefresh() {
        console.log('onPullDownRefresh');
        if (this.data.currenttab === '0') {
            this.cellDataHandle({});
        } else {
            wx.stopPullDownRefresh();
        }
    },

    onPageScroll: function (e) {
        this.data.tabIsShow = !(e.scrollTop > 430);
        this.setData({
            tabIsShow: this.data.tabIsShow
        })
    },

    async onShow() {
        const trendTime = getApp().globalData.trendTime;
        console.log('trendTime:', trendTime);
        if (trendTime) {
            const {startTimeValue, endTimeValue} = trendTime;
            this.updateTrendTime({
                frontTimestamp: startTimeValue,
                endTimestamp: endTimeValue
            });
            getApp().globalData.trendTime = null;
        }
    },

    onReady() {
        Circular.createSelectorQuery();
        Trend.init(this);
        Trend.initTouchHandler();
    },
    async updateTrendTime({frontTimestamp, endTimestamp}) {
        timeObj.frontTimestamp = frontTimestamp;
        timeObj.endTimestamp = endTimestamp;
        let {result: {list}} = await Protocol.postBreathDatalistAll({
            timeBegin: timeObj.frontTimestamp,
            timeEnd: timeObj.endTimestamp
        });
        if (list && list.length) {
            this.setData({
                trendDate: getTimeString({
                    frontTimestamp: timeObj.frontTimestamp,
                    endTimestamp: timeObj.endTimestamp
                })
            }, async () => {
                this.handleTrend({list});
            });
        } else {
            toast.showText('该时间段内没有燃脂数据');
        }

    },
});
