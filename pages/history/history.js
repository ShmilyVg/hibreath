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
        Protocol.getBreathDataList({page}).then(data => {
            let list = this.handleList(data.result.list);
            if (list.length) {
                this.setData({
                    allList: this.data.allList.concat(list),
                })
            } else {
                this.data.page--;
            }
        }).finally(() => wx.stopPullDownRefresh());
    },

    handleList(list) {
        let showText = ['', '燃脂不佳', '燃脂一般', '燃脂最佳', '强度过大'];
        let showColor = ['', '555555', 'ff7c00', 'ff5e00', 'e64d3d'];
        list.map(function (value) {
            let level = value['level'];
            value['hintText'] = showText[level];
            value['hintBg'] = showColor[level];
            value['date'] = tools.createDateAndTime(value['createdTimestamp']);
        });
        return list;
    },

    onPullDownRefresh() {
        this.data.allList.splice(0, this.data.allList.length);
        this.getBreathDataList({page: this.data.page = 1});
    },

    onReachBottom() {
        this.getBreathDataList({page: ++this.data.page});
    }
})
