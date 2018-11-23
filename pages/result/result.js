// pages/result/result.js
import * as tools from "../../utils/tools";
import protocol from "../../modules/network/protocol";

Page({
    data: {
        dateText: {},
        backgroundColor: '#000000',
        viewUnscramble: false,
        isChose: false,
        cardTitle: '请问本次是在什么状态下检测的？',
    },

    onLoad: function (options) {
        let list = protocol.getAnalysisSituation();
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
            list: list,
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