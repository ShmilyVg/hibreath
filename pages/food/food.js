// pages/food/food.js
import * as Trend from "../../view/trend";
import Protocol from "../../modules/network/protocol";
import * as Tools from "../../utils/tools";

Page({

    data: {
        topChose: [
            {text: '体重', addText: '记体重', isChose: true},
            {text: '血压', addText: '记血压', isChose: false},
            {text: '心率', addText: '记心率', isChose: false}
        ],
        addBtnText: '记体重',
        dataList: [],
        dataTrend: [],
        dataTrendTitle: '2018年01月11日-02月02日'
    },

    onLoad() {
        Trend.init(this);
        this.handleAllData();
    },

    async handleAllData() {
        await this.handleListData({});
        this.handleTrendData({isFirst: true});
    },

    async handleListData({page = 1}) {
        const indexChose = this.choseItem();
        switch (indexChose) {
            case 0:
                let {result: {list}} = await Protocol.postWeightDataList({page});
                list.map((value) => {
                    const {time, dateX} = Tools.createDateAndTime(value.time * 1000);
                    value.date = {time, date: dateX}
                });
                this.setData({dataList: list});
                break;
            case 1:
                break;
            case 2:
                break;
            default:
                break
        }
    },

    async handleTrendData({isFirst = false}) {
        if (isFirst) {
            let dataListX = [], dataListY = [];
            this.data.dataList.forEach((value) => {
                const {day: y} = Tools.createDateAndTime(value.createdTimestamp);
                dataListX.push(y);
                dataListY.push(value.dataValue);
            });
            Trend.setData({dataListX, dataListY, yAxisSplit: 5});
        }
    },

    bindTapTopChose(e) {
        const indexChose = e.currentTarget.dataset.index;
        let topChose = this.data.topChose;
        topChose.map((value, index) => {
            value.isChose = index == indexChose;
        });

        const addBtnText = this.data.topChose[indexChose].addText;
        this.setData({topChose, addBtnText});
    },

    choseItem() {
        let res = 99;
        this.data.topChose.map((value, index) => {
            if (value.isChose) {
                res = index;
            }
        });
        return res;
    },

    async bindTapAddData() {
        const indexChose = this.choseItem();
        switch (indexChose) {
            case 0:
                await Protocol.postWeightDataAdd({dataValue: 70});
                break;
            case 1:
                break;
            case 2:
                break;
            default:
                break
        }
    },
})