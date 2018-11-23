// pages/result/result.js
import * as tools from "../../utils/tools";

Page({
    data: {
        dateText: {},
        backgroundColor: '#3E3E3E',
        isFinishChose: false,
        cardTitle: '请问本次是在什么状态下检测的？'
    },

    onLoad: function (options) {
        let date = tools.createDateAndTime(new Date());
        let dateText = date.date + '\n' + date.time;
        this.setData({
            dateText: dateText,
        });
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: this.data.backgroundColor,
        })
    },

    clickChoose: function (e) {
        console.log(e.currentTarget.dataset.index);
        this.setData({
            isFinishChose: true
        })
    }
})