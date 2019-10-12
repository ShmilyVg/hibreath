// pages/finishClock/finishClock.js
import Protocol from "../../modules/network/protocol";
import UserInfo from "../../modules/network/network/libs/userInfo";
import {getSportFinishedTime} from "../../utils/time";
import HiNavigator from "../../navigator/hi-navigator";

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
        sportLeftShowStr: ''
    },

    async onLoad(options) {
        this.dataId = options.dataId;
        const {userInfo: {headUrl: userHead}} = await UserInfo.get();
        this.setData({userHead, clockWay: 'video' || options.clockWay});
        const {
            result: {
                sportInfo, time, goalDesc, freestyleIds,
                sectionSize, duration, durationUnit, feelDesc, feelEn
            }
        }
            = await Protocol.postSportDataInfo({id: this.dataId});
        let obj = {};
        if (this.data.clockWay === "free") {
            obj = {feelDesc};
            obj['sportLeftShowStr'] = freestyleIds ? (freestyleIds.length + ' 种') : '0 种';
        } else {
            obj['sportLeftShowStr'] = sectionSize + ' 组';
        }
        wx.setNavigationBarTitle({title: sportInfo.title});
        this.setData({
            sportInfo,
            finishTime: getSportFinishedTime({timestamp: time * 1000}),
            goalDesc,
            ...obj
        });

    },
    async onFeelItemClickEvent(e) {
        const {currentTarget: {dataset: {item}}} = e;
        await Protocol.postSportDataPutFeel({...item, id: this.dataId});
        this.setData({feelEn: item.feelEn, feelObj: {feelContent: item.content, icon: item.icon}});
    },

    toClockPage(e) {
        const {currentTarget: {dataset: {way}}} = e;
        if (way === 'free') {
            HiNavigator.redirectToFreeCheck({dataId:this.dataId});
        }else if (way === 'video') {

        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

});
