// pages/finishClock/finishClock.js
import Protocol from "../../modules/network/protocol";
import UserInfo from "../../modules/network/network/libs/userInfo";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        clockWay: '',
        feelList: [
            {feelDesc: '太难了', icon: '1', feelEn: 'hard', content: '感谢您的反馈'},
            {feelDesc: '还不错', icon: '2', feelEn: 'suit', content: '还不错哦，继续努力'},
            {feelDesc: '太简单了', icon: '3', feelEn: 'easy', content: '感谢您的反馈'},
        ],
        feelEn: '',
        feelObj: {feelContent: '', icon: ''},

    },

    async onLoad(options) {
        this.dataId = options.dataId;
        this.clockWay = options.clockWay;
        const {userInfo: {headUrl: userHead}} = await UserInfo.get();
        this.setData({userHead});
        const {result: {freestyleIds, sectionSize, duration, durationUnit, feelDesc, feelEn}} = await Protocol.postSportDataInfo({id: this.dataId});


    },
    async onFeelItemClickEvent(e) {
        const {currentTarget: {dataset: {item}}} = e;
        await Protocol.postSportDataPutFeel({...item, id: this.dataId});
        this.setData({feelEn: item.feelEn, feelObj: {feelContent: item.content, icon: item.icon}});
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

});
