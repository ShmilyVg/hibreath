// pages/result/result.js
/**
 * @Date: 2019-09-23 14:30:30
 * @LastEditors: 张浩玉
 */
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import toast from "../../view/toast";
import HiNavigator from "../../navigator/hi-navigator";
import * as Trend from "./view/trend";
import * as Circular from "./view/circular";

Page({
    data: {
        score: 6.5, //传入的进度， 0~100，绘制到此参数处停止。
        currenttab: '0',
        trendDate: '',
        page: 1,
        tabIsShow: true
    },

    onLoad() {
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
        const imageIndexArr = ['1', '1', '1', '2', '2', '3', '3', '4', '4', '5', '5'];
        if (list.length) {
            list.map(value => {
                const {time, day, month, year} = tools.createDateAndTime(value.createdTimestamp);
                value.date = `${year}/${month}/${day} ${time}`;
                value.image = `../../images/result/cell${imageIndexArr[value.dataValue]}.png`;
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
                this.handleTrend();
            }
        }
    },

    handleTrend() {
        let list = this.data.trendData;
        Trend.initTouchHandler();
        let dataListX = [], dataListY = [];
        list.forEach((value) => {
            const y = tools.createDateAndTime(value.createdTimestamp).day;
            dataListX.push(y);
            dataListY.push(value.dataValue);
        });
        let data = {
            dataListX, dataListY, yAxisSplit: 5
        };
        Trend.setData(data);
    },

    toChooseDate() {
        let info = {
            end_time: this.data.trendData[0],
            start_time: this.data.trendData[this.data.trendData.length - 1],
        };
        wx.navigateTo({
            url: '../calendar/calendar?info=' + JSON.stringify(info)
        });
    },

    onReachBottom() {
        console.log('onReachBottom');
        if (this.data.currenttab) {
            this.cellDataHandle({page: ++this.data.page, isRefresh: false})
        }
    },

    onPullDownRefresh() {
        console.log('onPullDownRefresh');
        this.cellDataHandle({});
    },

    onPageScroll: function (e) {
        this.data.tabIsShow = !(e.scrollTop > 430);
        this.setData({
            tabIsShow: this.data.tabIsShow
        })
    }
})
