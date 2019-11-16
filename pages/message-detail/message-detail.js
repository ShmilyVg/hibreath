// pages/message-detail/message-detail.js
import {previewImage} from "../../view/view";
import {WXDialog} from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {getDayStr, getDynamicCreateTime, getHourStr, getMinuteStr} from "../../utils/time";

Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        if(result.desc){
            this.setData({
                desc:result.desc,
            })
        }else{
            this.setData({
                desc:'',
            })
        }
        this.setData({
            canDelete:result.action.delete,
            imgUrls:result.imgUrls,
            messageCreateTime: getDynamicCreateTime(result.createTimestamp),
            headUrl:result.headUrl,
            nickname:result.nickname
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    onUnload(){
        //控制首页打卡情况更新
        getApp().globalData.issueRefresh = true
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
