// hipee/pages/calendar/calendar.js
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";

Page({
    data: {
        week: [{value: "日"}, {value: "一"}, {value: "二"}, {value: "三"}, {value: "四"}, {value: "五"}, {value: "六"}],
        monthList: [],
        dateObj: {
            startDate: '',
            endDate: '',
            middleDate: {}
        },
        chooseIndexObj: {
            startMonthTimestamp: 0,
            endMonthTimestamp: 0,
            startTimestamp: 0,
            endTimestamp: 0
        },
        info: {
            // item_code: "HEALTH_SCORE",
            // member_id: 2585,
            // type: 'other-health'
        },
        loadingMonthListFailed: false,
        firstLoadingItems: true,
        isNetworkConnected: true,
        isFirst: true
    },
    onLoad(options) {
        let info = JSON.parse(options.info);
        // console.log(info);
        this.data.info = {member_id: info.member_id, item_code: info.item_code, type: info.type};
        this.clearAndRefresh();
    },

    clearAndRefresh() {
        let that = this;
        that.data.dateObj.middleDate = new Date();
        that.data.monthList.splice(0, that.data.monthList.length);
        this.findDateNeedShow(function (startDate, endDate) {
            that.getTrendTime(startDate, endDate);
        });
    },
    findDateNeedShow(cbOk) {
        if (cbOk) {
            let middleDate = this.data.dateObj.middleDate;
            let startDate = '', endDate = '', endTemp;
            if (middleDate.getMonth() === 11) {
                endDate = (middleDate.getFullYear() + 1) + "-1-1";
            } else {
                endDate = middleDate.getFullYear() + "-" + (middleDate.getMonth() + 2) + "-1";
            }

            endTemp = new Date(endDate.replace(/-/g, "/"));
            endTemp.setDate(endTemp.getDate() - 1);
            endDate = endTemp.getFullYear() + "-" + (endTemp.getMonth() + 1) + '-' + endTemp.getDate();

            if (middleDate.getMonth() === 0) {
                startDate = (middleDate.getFullYear() - 1) + '-12-1';

            } else {
                startDate = middleDate.getFullYear() + "-" + middleDate.getMonth() + "-1";
            }
            this.data.dateObj.startDate = startDate;
            this.data.dateObj.endDate = endDate;

            let temp = new Date(this.data.dateObj.startDate.replace(/-/g, "/")), middleStr = '';
            if (temp.getMonth() === 0) {
                middleStr = (temp.getFullYear() - 1) + '-12-1';
            } else {
                middleStr = temp.getFullYear() + "-" + temp.getMonth() + "-1";
            }
            this.data.dateObj.middleDate = new Date(middleStr.replace(/-/g, "/"));
            cbOk(this.data.dateObj.startDate, this.data.dateObj.endDate);
        }
    },
    getTrendTime(startTime, endTime) {
        Protocol.postItemCalendar({startTime,endTime}).then(res => {
            this.commonCalendarCbFun(res);
        });
    },
    commonCalendarCbFun(res) {
        if (res.code === 1) {
            res.result = res.result.list;
            if (res.result && res.result.length) {
                let date = new Date();
                let nowDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                nowDate.setHours(0);
                let now = nowDate.getTime();
                let currentMonthTimestamp = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/1').getTime();
                res.result.forEach((item) => {
                    date.setTime(item.month);
                    item.date = date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
                    if (item.month === currentMonthTimestamp) {
                        item.days.forEach((daysItem) => {
                            if (daysItem.timestamp === now) {
                                daysItem.is_today = true;
                            }
                        })
                    }

                    let week = date.getDay();
                    item.emptyCount = 0;
                    while (week--) {
                        item.emptyCount++;
                        item.days.splice(0, 0, {});
                    }
                });
                this.setData({
                    monthList: res.result.concat(this.data.monthList || []),
                    firstLoadingItems: false
                });
            }
            wx.stopPullDownRefresh && wx.stopPullDownRefresh();
        } else {
            this.setData({
                loadingMonthListFailed: true
            });
            wx.stopPullDownRefresh && wx.stopPullDownRefresh();
        }
    },

    clickCalendarEvent(e) {
        // console.log(e);
        let event = e.currentTarget.dataset;

        let dayTimestamp = parseInt(event.dayTimestamp);
        let monthTimestamp = parseInt(event.monthTimestamp);
        if (!!this.data.chooseIndexObj.startTimestamp && !!this.data.chooseIndexObj.endTimestamp) {
            this.data.chooseIndexObj.startTimestamp = this.data.chooseIndexObj.endTimestamp = 0;
        }

        if (this.data.chooseIndexObj.startTimestamp === 0) {
            this.data.chooseIndexObj.startTimestamp = dayTimestamp;
            this.data.chooseIndexObj.startMonthTimestamp = monthTimestamp;

        } else if (this.data.chooseIndexObj.startTimestamp !== dayTimestamp && dayTimestamp >= this.data.chooseIndexObj.endTimestamp) {
            this.data.chooseIndexObj.endTimestamp = dayTimestamp;
            this.data.chooseIndexObj.endMonthTimestamp = monthTimestamp;
        }
        if (this.data.chooseIndexObj.endTimestamp !== 0 && this.data.chooseIndexObj.startTimestamp > this.data.chooseIndexObj.endTimestamp) {
            this.data.chooseIndexObj.startTimestamp = this.data.chooseIndexObj.endTimestamp;
            this.data.chooseIndexObj.startMonthTimestamp = this.data.chooseIndexObj.endMonthTimestamp;
            this.data.chooseIndexObj.endTimestamp = 0;
            this.data.chooseIndexObj.endMonthTimestamp = 0;
        }
        if (this.data.chooseIndexObj.endTimestamp !== 0) {
            this.data.chooseIndexObj.date = tools.createDateAndTime06(this.data.chooseIndexObj.startTimestamp, this.data.chooseIndexObj.endTimestamp);
        }
        let that = this;
        that.createChooseDate();
        that.setData({
            chooseIndexObj: that.data.chooseIndexObj,
            disable: (that.data.chooseIndexObj.endTimestamp - that.data.chooseIndexObj.startTimestamp) / 86400000 <= 30
        });
    },
    confirmChooseTime() {
        let that = this;
        getApp().globalData.trendTime = {
            startTimeValue: tools.createDateAndTime(that.data.chooseIndexObj.startTimestamp).date,
            endTimeValue: tools.createDateAndTime(that.data.chooseIndexObj.endTimestamp).date
        };
        console.log(getApp().globalData.trendTime);
        wx.navigateBack({
            delta: 1
        });
    },
    createChooseDate() {
        //生成日期
        this.data.chooseIndexObj.date = tools.createDateAndTime06(this.data.chooseIndexObj.startTimestamp, this.data.chooseIndexObj.endTimestamp);
    },
    rePostEvent(e) {
        if (e.currentTarget.dataset.isConnected) {
            this.clearAndRefresh();
        }
    },
    handlerNetworkChanged(isNetworkConnected) {
        if (!this.data.isNetworkConnected && isNetworkConnected) {//从无网变成有网
            this.refreshPage();
            // wx.showShareMenu({});
        } else if (!isNetworkConnected) {
            wx.hideShareMenu();
        }
        this.setData({
            isNetworkConnected: isNetworkConnected,
            loadingMonthListFailed: !isNetworkConnected,
        });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        if (this.data.isNetworkConnected) {
            let that = this;
            this.findDateNeedShow(function (startTime, endTime) {
                that.getTrendTime(startTime, endTime);
            });
        } else {
            wx.stopPullDownRefresh && wx.stopPullDownRefresh();
        }

    }
})