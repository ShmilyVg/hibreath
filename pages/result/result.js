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
        Protocol.getAnalysisSituation().then(data => {
            let list = data.result.list;
            // 是否直接显示解读
            if (options.showUnscramble === 'true') {
                let date = tools.createDateAndTime(new Date(parseInt(options.timestamp)));
                let dateText = `${date.date}\n${date.time}`;
                this.setData({
                    list: list,
                    cardTitle: list[options.situation]['text_zh'],
                    showUnscramble: true,
                    index: options.situation,
                    dateText: dateText,
                    postAdd: false
                });
                this.postAnalysisFetch();
            } else {
                let date = tools.createDateAndTime(new Date());
                let dateText = `${date.date}\n${date.time}`;
                this.setData({
                    dateText: dateText,
                    list: list,
                    showUnscramble: false,
                    postAdd: true
                })
            }
        });
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
        this.setData({
            mainColor: mainColor,
            score: score
        });
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: mainColor
        });
    },

    clickChoose: function (e) {
        let that = this;
        if (e.currentTarget.dataset.index) {
            let index = e.currentTarget.dataset.index;
            let list = this.data.list;
            list.map(function (value) {
                value.isChose = index == value.key;
                if (value.isChose) {
                    that.data.cardTitle = tools.deleteLineBreak(value.text_zh);
                }
            });
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
        this.postAnalysisFetch();
    },

    postAnalysisFetch() {
        toast.showLoading();
        Protocol.getAnalysisFetch({
            dataValue: this.data.score,
            situation: parseInt(this.data.index)
        }).then(data => {
            let description = data.result.description;
            this.setData({
                description: description,
                showUnscramble: true,
                cardTitle: this.data.cardTitle
            });
            toast.hiddenLoading();
            if (this.data.postAdd) {
                Protocol.getBreathDataAdd(
                    {dataValue: this.data.score, situation: parseInt(this.data.index)}
                ).then(data => {
                    console.log('增加成功~');
                })
            }
        });
    }
})