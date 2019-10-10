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

Page({
    data: {
        score: 3.5, //传入的进度， 0~100，绘制到此参数处停止。
        currenttab: '0',
        trendDate: '',
        page: 1,
        tabIsShow: true
    },

    async onLoad(e) {
        console.log('eeeeeee',e)
        if (e.id) {
            const {result: {visDes: fatDes, score, des}} = await Protocol.postSetGradeInfo({id: e.id});
            this.setData({
                fatDes, score,fatText:des.zhCh, fatTextEn:des.en
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
        Circular.init(this);
    },

    async cellDataHandle({page = 1, isRefresh = true}) {
        toast.showLoading();
        let {result: {list}} = await Protocol.getBreathDataList({page, pageSize: 20});
        if (list.length) {
            list.map(value => {
                const {time, day, month, year} = tools.createDateAndTime(value.time*1000);
                value.date = `${year}/${month}/${day} ${time}`;
                let image = '../../images/result/cell';
                const dValue = value.dataValue;
                if (dValue > 0 && dValue <= 1) {
                    image = image + '1';
                } else if (dValue > 1 && dValue <= 2) {
                    image = image + '2';
                } else if (dValue > 2 && dValue <=4) {
                    image = image + '3';
                } else if (dValue > 4 && dValue <= 6) {
                    image = image + '4';
                } else if (dValue > 6) {
                    image = image + '5';
                }
                image = image + '.png';
                value.image = image
            });
            const endData = tools.createDateAndTime(list[0].createdTimestamp);
            const startData = tools.createDateAndTime(list[list.length - 1].createdTimestamp);
            let trendDate = `${startData.date}-${endData.month}月${endData.day}日`;

            if (isRefresh) {
                this.data.page = 1;
            } else {
                list = this.data.trendData.concat(list);
            }
            this.setData({trendDate, trendData: list});
        } else {
            --this.data.page;
        }
        wx.stopPullDownRefresh();
        toast.hiddenLoading();
    },

    onReady() {
        Circular.createSelectorQuery();
    },

    toBind() {
        HiNavigator.navigateToDeviceUnbind();
    },

    toIndex() {
        HiNavigator.navigateIndex();
    },

    //切换标签页
    selectTab(e) {
        let newtab = e.currentTarget.dataset.tabid;
        if (this.data.currenttab !== newtab) {
            this.setData({
                currenttab: newtab
            });
            if (newtab == 1) {
                this.handleTrend({});
            }
        }
    },

    handleTrend({data}) {
        let list = this.data.trendData;
        if (data) {
            list = data
        }
        Trend.initTouchHandler();
        let dataListX = [], dataListY = [];
        list.forEach((value) => {
            const y = tools.createDateAndTime(value.createdTimestamp).day;
            dataListX.push(y);
            dataListY.push(value.dataValue);
        });
        let dataTrend = {
            dataListX, dataListY, yAxisSplit: 5
        };
        Trend.setData(dataTrend);
    },

    toChooseDate() {
        let info = {
            end_time: this.data.trendData[0],
            type:"breath",
            start_time: this.data.trendData[this.data.trendData.length - 1],
        };
        wx.navigateTo({
            url: '../calendar/calendar?info=' + JSON.stringify(info)
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
            let {result: {list}} = await Protocol.postBreathDatalistAll({
                timeBegin: startTimeValue,
                timeEnd: endTimeValue + (24 * 60 * 60 * 1000)
            });
            if (list.length) {
                const endData = tools.createDateAndTime(list[0].createdTimestamp);
                const startData = tools.createDateAndTime(list[list.length - 1].createdTimestamp);
                let trendDate = `${startData.date}-${endData.month}月${endData.day}日`;
                this.setData({trendDate});
                this.handleTrend({data: list})
            }
        }
    }
})
