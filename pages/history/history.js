// pages/history/history.js
import Protocol from "../../modules/network/protocol";
import * as tools from "../../utils/tools";
import HiNavigator from "../../navigator/hi-navigator";

Page({

    data: {
        allList: [],
        page: 1
    },

    onLoad() {
        this.getBreathDataList({});
    },

    toResult(e) {
        let index = e.currentTarget.dataset.index;
        let list = this.data.allList;
        HiNavigator.navigateToResult({
            score: list[index]['dataValue'],
            situation: list[index]['situation'],
            showUnscramble: true,
            timestamp: list[index]['createdTimestamp']
        });
    },

    getBreathDataList({page = 1}) {
        Protocol.getBreathDataList({page: page}).then(data => {
            let list = this.handleList(data.result.list);
            if (list.length) {
                if (page === 1) {
                    this.data.page = 1;
                    this.setData({
                        allList: list
                    });
                    setTimeout(function () {
                        wx.stopPullDownRefresh();
                    }, 666);
                } else {
                    this.setData({
                        allList: this.data.allList.concat(list),
                    })
                }
            }
        })
    },

    handleList(list) {
        for (let i in list) {
            let showText = ['', '燃脂不佳', '燃脂一般', '燃脂最佳', '强度过大'];
            let showColor = ['', '555555', 'ff7c00', 'ff5e00', 'e64d3d'];
            let level = list[i]['level'];
            list[i]['hintText'] = showText[level];
            list[i]['hintBg'] = showColor[level];
            list[i]['date'] = tools.createDateAndTime(list[i]['createdTimestamp']);
        }
        return list;
    },

    onPullDownRefresh() {
        this.getBreathDataList({});
    },

    onReachBottom() {
        this.getBreathDataList({page: ++this.data.page});
    }
})