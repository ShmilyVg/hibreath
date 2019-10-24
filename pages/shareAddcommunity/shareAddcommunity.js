// pages/shareAddcommunity/shareAddcommunity.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {Toast} from "heheda-common-view";
import {getSocialGroupManager, whenDismissGroup} from "../community/social-manager";

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
            const {result: {memberName, groupName, imgUrl}} = await whenDismissGroup(Protocol.postGroupShareInfo({sharedId}));
            this.setData({memberName, groupName, imgUrl});
        });
    },

    async addCommunityBtn() {
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
    }
});
