// pages/result/result.js
import * as tools from "../../utils/tools";

Page({
    data: {
        dateText: {},
        backgroundColor: '#000000',
        viewUnscramble: false,
        isChose: false,
        cardTitle: '请问本次是在什么状态下检测的？',
        list: [{
            key: "0",
            text_zh: "其他",
            text_en: "1",
        }, {
            key: "1",
            text_zh: "晚餐前",
            text_en: "1",
        }, {
            key: "2",
            text_zh: "运动前",
            text_en: "1",
        }, {
            key: "3",
            text_zh: "运动结束时",
            text_en: "1",
        }, {
            key: "4",
            text_zh: "运动结束1小时",
            text_en: "1",
        }, {
            key: "5",
            text_zh: "运动结束2小时",
            text_en: "1",
        }, {
            key: "6",
            text_zh: "运动结束3小时",
            text_en: "1",
        }]
    },

    onLoad: function (options) {
        let date = tools.createDateAndTime(new Date());
        let dateText = date.date + '\n' + date.time;
        let backgroundColor = '#000000';
        let score = 99;
        if (score < 6) {
            backgroundColor = '#3E3E3E'
        } else if (score > 5 && score < 31) {
            backgroundColor = '#FF7C00'
        } else if (score > 30 && score < 81) {
            backgroundColor = '#FF5E00'
        } else if (score > 80) {
            backgroundColor = '#E64D3D'
        }
        this.setData({
            dateText: dateText,
            backgroundColor: backgroundColor
        });
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: backgroundColor
        })
    },

    clickChoose: function (e) {
        let index = e.currentTarget.dataset.index;
        let list = this.data.list;
        for (let i in list) {
            list[i]['isChose'] = index == list[i]['key'];
            this.data.cardTitle = list[i]['text_zh'];
        }
        this.setData({
            list: list,
            isChose: true,
        })
    },

    clickBtn: function () {
        this.setData({
            viewUnscramble: true,
            cardTitle: this.data.cardTitle
        })
    }
})