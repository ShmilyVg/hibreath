// pages/shareAddcommunity/shareAddcommunity.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {Toast as toast, Toast, WXDialog} from "heheda-common-view";
import {getSocialGroupManager, whenDismissGroup} from "../community/social-manager";
import Login from "../../modules/network/login";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        memberName: '',
        groupName: '',
        imgUrl: '',
        sharedId: '',
        isExistPhone:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {sharedId} = options;
        this.setData({sharedId}, async () => {
            const {result: {memberName, groupName, imgUrl,isJoined,isExistPhone}} = await whenDismissGroup(Protocol.postGroupShareInfo({sharedId}));
            this.setData({memberName, groupName, imgUrl,isJoined,isExistPhone});
        });
    },

    async addCommunityBtn(e) {
        const {sharedId,isExistPhone} = this.data;
        if (sharedId) {
            if(isExistPhone){
                const {result: {groupId}} = await whenDismissGroup(Protocol.postGroupJoin({sharedId}));
                if (groupId) {
                    getSocialGroupManager.currentSocial = {groupId};
                    if(e.currentTarget.dataset.type === 'firstEnter'){
                        getApp().globalData.firstEnter = this.data.isJoined;
                        getApp().globalData.isShareAddcommunity = true
                        HiNavigator.switchToCommunity();
                        return
                    }
                    HiNavigator.switchToCommunity();
                } else {
                    wx.showToast({
                        title: '抱歉,暂时无法加入该圈子',
                        icon: 'none',
                        duration: 3000
                    })
                }
            }else{
                HiNavigator.navigateToGetPhone({sharedId})
            }

        } else {
            wx.showToast({
                title: '未获取到圈子信息，暂时无法加入',
                icon: 'none',
                duration: 3000
            })
        }
    },
    async onGetUserInfoEvent(e) {
        console.log('e',e)
        const {detail: {userInfo, encryptedData, iv}} = e;
        if (!!userInfo) {
            Toast.showLoading();
            try {
                await Login.doRegister({userInfo, encryptedData, iv});
                Toast.hiddenLoading();
            } catch (e) {
                Toast.warn('获取信息失败');
            }
        }
   /*     const {sharedId,isExistPhone} = this.data;
        console.log(this.data,'this.data')
        if (sharedId) {
                const {result: {groupId}} = await whenDismissGroup(Protocol.postGroupJoin({sharedId}));
                if (groupId) {
                    getSocialGroupManager.currentSocial = {groupId};
                    HiNavigator.switchToCommunity();
                } else {
                    wx.showToast({
                        title: '抱歉，暂时无法加入该圈子',
                        icon: 'none',
                        duration: 3000
                    })
                }
        } else {
            wx.showToast({
                title: '未获取到圈子信息，暂时无法加入',
                icon: 'none',
                duration: 3000
            })
        }
*/
    },
});
