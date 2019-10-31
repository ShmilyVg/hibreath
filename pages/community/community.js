// pages/community/Community.js
import {showActionSheet} from "../../view/view";
import {
    getGroupDynamicManager,
    getSocialGroupManager,
    getSocialGroupMembersViewInfo,
    judgeGroupEmpty,
    whenDismissGroup
} from "./social-manager";
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
import {Toast} from "heheda-common-view";
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentSocial: {isNotFinished: true},
        socialMemberInfo: {memberCount: 0, memberImgs: []},
        dynamicList: [],
        haveGroupId:false
    },

    // isUpdateAllWhenLoad: false,
    // async onLoad(options) {
    // await this.forceUpdateAll();
    // this.isUpdateAllWhenLoad = true;
    // },
    async toMemberManagerPage() {
        HiNavigator.navigateToMemberManagement({dataId: (await judgeGroupEmpty()).groupId});
    },
    async onCommunitySettingClickEvent() {
        try {
            const {tapIndex} = await showActionSheet({itemList: ['更多圈子', '删除该圈子']});
            switch (tapIndex) {
                case 0:
                    HiNavigator.navigateToCommunityManagement();
                    break;
                case 1:
                    await whenDismissGroup(Protocol.postMemberGroupExit({...(await judgeGroupEmpty())}));
                    this.forceUpdateAll();
                    break;
            }
        } catch (e) {
            console.warn(e);
        }

    },
     onDynamicItemDeleteEvent({detail}) {
        console.log(detail);
        const {taskId} = detail, {dynamicList} = this.data;
         console.log(dynamicList);
        const index = dynamicList.findIndex(item => item.id === taskId);
        console.log(index !== -1,'index')
        if (index !== -1) {
             Protocol.postDynamicDelete({id: taskId}).then(()=>{
                 dynamicList.splice(index, 1);
                 this.setData({dynamicList});
             })

        }
    },

    async onShow() {
        // if (this.isUpdateAllWhenLoad) {
        this.forceUpdateAll();
        // }
    },
    async toImgClock(){
        HiNavigator.navigateToImgClockcommunity({id:(await judgeGroupEmpty()).groupId})
    },

    onHide() {

    },
    async onGetUserInfoEvent(e) {
        console.log('e',e)
        const {detail: {userInfo, encryptedData, iv}} = e;
        if (!!userInfo) {
            Toast.showLoading();
            try {
                await Login.doRegister({userInfo, encryptedData, iv});
                Toast.hiddenLoading();
                HiNavigator.navigateToCreateCommunity()
            } catch (e) {
                Toast.warn('获取信息失败');
            }
        }
    },
    async toReductionList(){
        HiNavigator.navigateToReductionList({groupId:(await judgeGroupEmpty()).groupId})
    },

    async toPunchList(){
        HiNavigator.navigateToPunchList({groupId:(await judgeGroupEmpty()).groupId})
    },

    async forceUpdateAll() {
        function showData({currentSocial}) {
            return new Promise(async (resolve, reject) => {
                try {
                    if (currentSocial.groupId) {
                        wx.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: '#171717'});
                        wx.setBackgroundColor({
                            backgroundColor: '#171717', // 窗口的背景色为黑色
                        });
                        this.setData({
                            haveGroupId:true
                        })
                    } else {
                        wx.setNavigationBarColor({frontColor: '#000000', backgroundColor: '#ffffff'});
                        wx.setBackgroundColor({
                            backgroundColor: '#ffffff', // 窗口的背景色为白色
                        });
                        this.setData({
                            haveGroupId:false
                        })
                    }
                } catch (e) {
                    console.error(e);
                }

                this.setData({currentSocial}, async () => {
                    try {
                        const dynamicList = await getGroupDynamicManager.getGroupDynamicList();
                        this.setData({
                            dynamicList
                        }, resolve);
                    } catch (e) {
                        reject(e);
                    }
                });
                console.log('currentSocial.groupId')
                if(currentSocial.groupId){
                    this.setData({socialMemberInfo: (await getSocialGroupMembersViewInfo())});
                }

            })

        }

        try {
            await getSocialGroupManager.getSocialGroupList();
            getGroupDynamicManager.clear();
            await showData.call(this, {currentSocial: getSocialGroupManager.currentSocial});
        } catch (e) {
            console.error('community.js updateAll error', e);
        }
    },

    async onPullDownRefresh() {
        await this.forceUpdateAll();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        Toast.showLoading();
        const list = await getGroupDynamicManager.getGroupDynamicList();
        if (list.length) {
            this.setData({dynamicList: this.data.dynamicList.concat(list)});
        }
        Toast.hiddenLoading();
    }
});
