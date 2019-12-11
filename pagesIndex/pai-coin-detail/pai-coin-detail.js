import Protocol from "../../modules/network/protocol";
import {Toast} from "heheda-common-view";

Page({


    data: {
        titles: [
            {title: '获取', selected: true, type: 0},
            {title: '消耗', selected: false, type: 1},
        ],
        details: [{}]
    },
    async switchTypeEvent({currentTarget: {dataset: {type}}}) {
        const {titles} = this.data,
            selectType = parseInt(type);
        try {
            Toast.showLoading();
            const {result: {list}} = await Protocol.postIntegralDetail({type: selectType}),
                sign = selectType === 0 ? '+' : '-';
            this.setData({
                titles: titles.map(item => {
                    return {...item, selected: item.type === selectType}
                }),
                details: list.map(item => {
                    return {...item, sign, time: this.getTime(item.createdTimestamp)};
                })
            });
        } catch (e) {
            console.error(e);
        } finally {
            Toast.hiddenLoading();
        }

    },

    getTime(timestamp) {
        // 12/04 11:17
        const date = new Date(timestamp);
        return [date.getMonth() + 1, date.getDate()].map(item => item.toString().padStart(2, '0')).join('/') + ' '
            + [date.getHours(), date.getMinutes()].map(item => item.toString().padStart(2, '0')).join(':');
    },

    onLoad(options) {
        this.switchTypeEvent({currentTarget: {dataset: {type: 0}}});
    },


});
