// pages/result/result.js
/**
 * @Date: 2019-09-23 14:30:30
 * @LastEditors: 张浩玉
 */
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import {Toast, WXDialog} from "heheda-common-view";
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
        score: 0, //传入的进度， 0~100，绘制到此参数处停止。
        currenttab: '0',
        trendDate: '',
        page: 1,
        tabIsShow: true,
        fatText:'',
        fatTextEn:'',
        fatDes:''
    },

    async onLoad(e) {
        console.log('eeeeeee', e)
        this.e= e;
        this.cellDataHandle({});
        this.init();
        if (e.id) {
            this.dataId =e.id;
            const {result: {visDes: fatDes, score, des}} = await Protocol.postSetGradeInfo({id: this.dataId});
            this.setData({
                fatDes, score, fatText: des.zhCh, fatTextEn: des.en
            });
            setTimeout(() => {
                console.log('绘制一次')
                Circular.run();
            },500)
        } else if (e.score) {
            const {fatText, fatTextEn, fatDes, score} = e;
            this.setData({
                fatText, fatTextEn, fatDes, score
            });
            setTimeout(() => {
                console.log('绘制一次')
                Circular.run();
            },500)
        }
    },

    init() {
        Trend.init(this);
        Trend.initTouchHandler();
        setTimeout(() => {
            Circular.init(this);
        },200)
    },

    async cellDataHandle({page = 1, isRefresh = true}) {
        Toast.showLoading();
        let {result: {list}} = await Protocol.getBreathDataList({page, pageSize: 20,timeEnd:Date.now(),timeBegin:getLatestOneWeekTimestamp()});
        if (list.length) {
            if(!this.e.id && !this.e.score){
                this.setData({
                    fatText:list[0].desZh,
                    score:list[0].dataValue,
                    fatTextEn:list[0].des.en,
                    fatDes:list[0].visDes,
                })
                setTimeout(() => {
                    console.log('绘制一次')
                    Circular.run();
                },500)
            }
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
        Toast.hiddenLoading();
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
                console.log('getLatestOneWeekTimestamp()',getLatestOneWeekTimestamp())
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
            Toast.showText('该时间段内没有燃脂数据');
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
        this.cellDataHandle({});
      /*  setTimeout(() => {
            console.log('绘制两次')
            Circular.run();
        },650)*/
    },

    onReady() {
        Circular.createSelectorQuery();
        Trend.init(this);
        Trend.initTouchHandler();
    },
    onUnload(){
        getApp().globalData.issueRefresh = true
        HiNavigator.switchToSetInfo()
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
            wx.showToast({
                title: '暂无燃脂数据',
                icon: 'none',
                duration: 2000
            })
        }

    },
});
