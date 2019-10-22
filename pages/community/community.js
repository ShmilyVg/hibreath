// pages/community/Community.js
import {showActionSheet} from "../../view/view";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        dynamicList: [
            {
                "imgUrls": ["http://tmp/wx3092c4629e38d21e.o6zAJs-ZTh1KE_1mWKYSo5jiADbc.qNpkLcR0ytCF8a0984514410a7da5719368bb39d1a24.png", "http://tmp/wx3092c4629e38d21e.o6zAJs-ZTh1KE_1mWKYSo5jiADbc.xF0JVgK6QAdK9c45a6b96cb01d63e8e3a743821b4107.png"],
                "headUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKcfufWYfm64jCLxMoh21yta3dlGRCd8MPvrP7PLeJiaj0Gkh3AvwJFqg65oX2nnQuCUktFIuvzQ1g/132",
                "nickname": "呵呵哒",
                "taskId": "14852",
                "createTimestamp": 1571646527466,
                "desc": "2"
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    async onCommunitySettingClickEvent() {
        try {
            switch (await showActionSheet({itemList: ['更多圈子', '删除该圈子']})) {
                case 0:
                    break;
                case 1:
                    break;
            }
        } catch (e) {
            console.warn(e);
        }

    },
    onDynamicItemDeleteEvent({detail}) {
        console.log(detail);
        const {taskId} = detail, {dynamicList} = this.data;
        const index = dynamicList.findIndex(item => item.taskId === taskId);
        if (index !== -1) {
            dynamicList.splice(index, 1);
            this.setData({dynamicList});
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

});
