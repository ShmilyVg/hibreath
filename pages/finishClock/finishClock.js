// pages/finishClock/finishClock.js
import Protocol from "../../modules/network/protocol";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        clockWay: 'free'
    },

    async onLoad(options) {
        this.dataId = options.dataId;
        this.clockWay = options.clockWay;
        const {result: {freestyleIds, sectionSize, duration, durationUnit, feelDesc, feelEn}} = await Protocol.postSportDataInfo({id: this.dataId});

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

});
