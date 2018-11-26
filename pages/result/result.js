// pages/result/result.js
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import toast from "../../view/toast";

Page({
    data: {
        dateText: {},
        backgroundColor: '#000000',
        viewUnscramble: false,
        isChose: false,
        cardTitle: '请问本次是在什么状态下检测的？',
        score: 60,
    },

    onLoad: function (options) {
        let that = this;
        Protocol.getAnalysisSituation().then(data => {
            let list = data.result.list;
            that.setData({
                list: list
            })
        });
        let date = tools.createDateAndTime(new Date());
        let dateText = date.date + '\n' + date.time;
        let backgroundColor = '';
        let score = this.data.score;
        if (score <= 5) {
            backgroundColor = '#3E3E3E'
        } else if (score > 5 && score <= 30) {
            backgroundColor = '#FF7C00'
        } else if (score > 30 && score <= 80) {
            backgroundColor = '#FF5E00'
        } else if (score > 80) {
            backgroundColor = '#E64D3D'
        }
        that.setData({
            dateText: dateText,
            backgroundColor: backgroundColor,
            score: score
        });
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: backgroundColor
        });
    },

    clickChoose: function (e) {
        if (e.currentTarget.dataset.index) {
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
        }
    },

    clickBtn: function () {
        if (!this.data.index) {
            return;
        }
        let that = this;
        toast.showLoading();
        Protocol.getAnalysisFetch(
            {dataValue: this.data.score, situation: parseInt(this.data.index)}
        ).then(data => {
            let description = data.result.description;
            that.setData({
                description: description,
                viewUnscramble: true,
                cardTitle: this.data.cardTitle
            });
            toast.hiddenLoading();
        });
    }
})