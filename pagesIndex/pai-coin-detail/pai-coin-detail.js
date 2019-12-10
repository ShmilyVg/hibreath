import Protocol from "../../modules/network/protocol";

Page({


    data: {
        titles: [
            {title: '获取', selected: true, type: 0},
            {title: '消耗', selected: false, type: 1},
        ],
        details: []
    },
    async switchTypeEvent({currentTarget: {dataset: {type}}}) {
        const {titles} = this.data,
            selectType = parseInt(type);
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
    },

    getTime(timestamp) {
        // 12/04 11:17
        const date = new Date(timestamp);
        return (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getDate().toString().padStart(2, '0') + ' '
            + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    },

    onLoad(options) {
        this.switchTypeEvent({currentTarget: {dataset: {type: 0}}});
    },


});
