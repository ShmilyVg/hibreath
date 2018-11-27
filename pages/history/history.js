// pages/history/history.js
import Protocol from "../../modules/network/protocol";
import * as tools from "../../utils/tools";
import HiNavigator from "../../navigator/hi-navigator";

Page({

    data: {},

    onLoad: function (options) {
        Protocol.getBreathDataList({}).then(data => {
            console.log(data);
            let list = data.result.list;
            for (let i in list) {
                list[i]['date'] = tools.createDateAndTime(list[i]['createdTimestamp']);
                let listShow = {a: ['燃脂不佳', '燃脂一般', '燃脂最佳', '强度过大'], b: ['3e3e3e', 'ff7c00', 'ff5e00', 'e64d3d']};
                list[i]['hintText'] = listShow.a[list[i]['level'] - 1];
                list[i]['hintBg'] = listShow.b[list[i]['level'] - 1];
            }
            this.setData({
                list: list
            })
        });
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
    }
})