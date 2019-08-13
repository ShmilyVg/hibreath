Page({
    data: {
        timearr:[],
    },
    onShow: function () {
        this.dadtaTap()
    },
    // 时间处理
    timehandTap: function (symbol, n) {
        symbol = symbol || '.';
        let date = new Date();
        date = date.setDate(date.getDate() + n);
        date = new Date(date)
        let year = date.getFullYear();
        let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return year + symbol + month + symbol + day;
    },
    // 数据处理
    dadtaTap: function () {
        let that = this;
        for (let i = 0; i < 5; i++) {
            console.log(-(i + 1))
            let times = this.timehandTap(".", -(i + 1));
            // console.log(times)
            let time = "timearr[" + i + "].time"; //此处的数组的属性可当做是新添加的键
            // console.log(time)
            that.setData({
                [time]: times
            })
        }
    },
})
