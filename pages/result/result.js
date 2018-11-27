// pages/result/result.js
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import toast from "../../view/toast";

Page({
    data: {
        dateText: {},
        mainColor: '#000000',
        showUnscramble: false,//是否显示解读
        isChose: false,
        cardTitle: '请问本次是在什么状态下检测的？',
        score: 0,
    },

    onLoad: function (options) {
        let that = this;

        Protocol.getAnalysisSituation().then(data => {
            let list = data.result.list;
            that.setData({
                list: list
            });
            // 是否直接显示解读
            if (options.showUnscramble === 'true') {
                that.setData({
                    cardTitle: list[options.situation]['text_zh'],
                    showUnscramble: true,
                    index: options.situation
                });
                that.postAnalysisFetch(that);
            }
        });
        let date = tools.createDateAndTime(new Date());
        let dateText = date.date + '\n' + date.time;
        let mainColor = '';
        let score = options.score;
        if (score <= 5) {
            mainColor = '#3E3E3E'
        } else if (score > 5 && score <= 30) {
            mainColor = '#FF7C00'
        } else if (score > 30 && score <= 80) {
            mainColor = '#FF5E00'
        } else if (score > 80) {
            mainColor = '#E64D3D'
        }
        that.setData({
            dateText: dateText,
            mainColor: mainColor,
            score: score
        });
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: mainColor
        });
    },

    clickChoose: function (e) {
        if (e.currentTarget.dataset.index) {
            let index = e.currentTarget.dataset.index;
            let list = this.data.list;
            for (let i in list) {
                list[i]['isChose'] = index == list[i]['key'];
                if (list[i]['isChose']) {
                    this.data.cardTitle = tools.deleteLineBreak(list[i]['text_zh']);
                }
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
        that.postAnalysisFetch(that);
    },

    postAnalysisFetch(that) {
        toast.showLoading();
        Protocol.getAnalysisFetch(
            {dataValue: that.data.score, situation: parseInt(that.data.index)}
        ).then(data => {
            let description = data.result.description;
            that.setData({
                description: description,
                showUnscramble: true,
                cardTitle: that.data.cardTitle
            });
            toast.hiddenLoading();
        });
    }
})