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
        sharedId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {sharedId} = options;
        this.setData({sharedId}, async () => {
            const {result: {memberName, groupName, imgUrl,isJoined}} = await whenDismissGroup(Protocol.postGroupShareInfo({sharedId}));
            this.setData({memberName, groupName, imgUrl,isJoined});
        });
    },

    async addCommunityBtn(e) {
        console.log('e',e.currentTarget.dataset.type)
        const {sharedId} = this.data;
        if (sharedId) {
            const {result: {groupId}} = await whenDismissGroup(Protocol.postGroupJoin({sharedId}));
            if (groupId) {
                getSocialGroupManager.currentSocial = {groupId};
                if(e.currentTarget.dataset.type === 'firstEnter'){
                    getApp().globalData.firstEnter =true
                    HiNavigator.switchToCommunity({firstEnter:true});
                    return
                }
                HiNavigator.switchToCommunity();
            } else {
                Toast.showText('抱歉，暂时无法加入该圈子');
            }
        } else {
            Toast.showText('未获取到圈子信息，暂时无法加入');
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
        const {sharedId} = this.data;
        if (sharedId) {
            const {result: {groupId}} = await whenDismissGroup(Protocol.postGroupJoin({sharedId}));
            if (groupId) {
                getSocialGroupManager.currentSocial = {groupId};
                HiNavigator.switchToCommunity();
            } else {
                Toast.showText('抱歉，暂时无法加入该圈子');
            }
        } else {
            Toast.showText('未获取到圈子信息，暂时无法加入');
        }

    },
});
