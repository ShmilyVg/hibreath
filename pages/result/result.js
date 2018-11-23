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
        score: 99,
    },

    onLoad: function (options) {
        let list = protocol.getAnalysisSituation();
        let date = tools.createDateAndTime(new Date());
        let dateText = date.date + '\n' + date.time;
        let backgroundColor = '#000000';
        let score = this.data.score;
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
            backgroundColor: backgroundColor,
            score:score
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
            index: index
        })
    },

    clickBtn: function () {
        let content = protocol.getAnalysisFetch({dataValue: this.data.score, situation: this.data.index});
        this.setData({
            viewUnscramble: true,
            cardTitle: this.data.cardTitle
        })
    }
})