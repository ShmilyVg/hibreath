// pages/history/history.js
import Protocol from "../../modules/network/protocol";
import * as tools from "../../utils/tools";
import HiNavigator from "../../navigator/hi-navigator";

Page({

    data: {
        allList: [],
        page: 1
    },

    onLoad: function (options) {
        this.getBreathDataList(1, true);
    },

    toResult(e) {
        let index = e.currentTarget.dataset.index;
        let list = this.data.list;
        HiNavigator.navigateToResult({
            score: list[index]['dataValue'],
            situation: list[index]['situation'],
            showUnscramble: true,
            timestamp: list[index]['createdTimestamp']
        });
    },

    getBreathDataList(page, isPullDownRefresh) {
        Protocol.getBreathDataList({page: page}).then(data => {
            let list = this.handleList(data.result.list);
            if (list.length) {
                if (isPullDownRefresh) {
                    this.setData({
                        page: 1,
                        allList: list
                    });
                    wx.stopPullDownRefresh();
                } else {
                    this.setData({
                        allList: this.data.allList.concat(list),
                        page: ++this.data.page
                    })
                }
            }
        })
    },

    handleList(list) {
        for (let i in list) {
            list[i]['date'] = tools.createDateAndTime(list[i]['createdTimestamp']);
            let listShow = {a: ['燃脂不佳', '燃脂一般', '燃脂最佳', '强度过大'], b: ['555555', 'ff7c00', 'ff5e00', 'e64d3d']};
            list[i]['hintText'] = listShow.a[list[i]['level'] - 1];
            list[i]['hintBg'] = listShow.b[list[i]['level'] - 1];
        }
        return list;
    },

    onPullDownRefresh() {
        this.getBreathDataList(1, true);
    },

    onReachBottom() {
        this.getBreathDataList(this.data.page, false);
    }
})