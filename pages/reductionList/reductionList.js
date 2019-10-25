Page({

    data: {
        currenttab: '0',
    },
    //切换标签页
    selectTab(e) {
        let newtab = e.currentTarget.dataset.tabid;
        if (this.data.currenttab !== newtab) {
            this.setData({
                currenttab: newtab
            });
            if (newtab == 1) {

            }
        }
    },
    onLoad(options) {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})
