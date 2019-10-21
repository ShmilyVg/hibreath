// pages/message-detail/message-detail.js
import {previewImage} from "../../view/view";
import {WXDialog} from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {getDayStr, getHourStr, getMinuteStr} from "../../utils/time";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        taskId: 1,
        imgUrls: ['', '', '', '', '', '', '', '', '',],
        desc: '',
        messageCreateTime: ''
    },

    async onLoad(options) {
        console.log(options)
        this.dataId = options.messageId
        wx.setNavigationBarTitle({title: '动态详情'});
        const {result} = await Protocol.postDynamicInfo({id: this.dataId});
        console.log("nickname",result)
        this.setData({
            taskId:result.taskId,
            imgUrls:result.imgUrls,
            desc:result.desc,
            messageCreateTime: this.getCreateTime(result.createTimestamp),
            headUrl:result.headUrl,
            nickname:result.nickname
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    getCreateTime(timestamp) {
        const date = new Date(timestamp);
        return `${date.getFullYear()}/${getMinuteStr(date)}/${getDayStr(date)} ${getHourStr(date)}:${getMinuteStr(date)}`;
    },
    onMessageSettingEvent() {
        WXDialog.showDialog({
            content: '确定要删除此条动态吗？', showCancel: true, confirmEvent: async () => {
                await Protocol.postDynamicDelete({id: this.dataId});
                HiNavigator.navigateBack({delta: 1});
            }
        });
    },
    async onImagePreview(e) {
        const {currentTarget: {dataset: {url: current}}} = e;
        await previewImage({current, urls: this.data.imgUrls});
    }
});
