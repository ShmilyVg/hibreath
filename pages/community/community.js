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
import {WXDialog} from "heheda-common-view";
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentSocial: {},
        socialMemberInfo: {memberCount: 0, memberImgs: [],isMajor:false,sharedId:'',name:'',memberName:''},
        dynamicList: [],
        haveGroupId:false,//有圈子
        noCommunity:false,
    },

    async toMemberManagerPage() {
        HiNavigator.navigateToMemberManagement({dataId: (await judgeGroupEmpty()).groupId});
    },
    async updata(){
        await whenDismissGroup(Protocol.postMemberGroupExit({...(await judgeGroupEmpty())}));
        this.forceUpdateAll();
    },
    async onCommunitySettingClickEvent() {
        console.log('socialMemberInfo',this.data.socialMemberInfo.isMajor)
        if(this.data.socialMemberInfo.isMajor){
            try {
              const { tapIndex } = await showActionSheet({ itemList: ['设置','更多圈子'],itemColor:"#454545"});
                switch (tapIndex) {
                    case 0:
                    HiNavigator.navigateToSetup({ socialMemberInfo: JSON.stringify(this.data.socialMemberInfo), currentSocial: JSON.stringify(this.data.currentSocial)});
                    console.log( this.data.currentSocial)
                        break;
                        //        WXDialog.showDialog({
                        //     content: '确定要删除该圈子吗\n' + '删除后记录无法找回 慎重操作',
                        //     showCancel: true,
                        //     confirmText: "确定",
                        //     cancelText: "取消",
                        //     confirmEvent: () => {
                        //         wx.clearStorageSync('currentSocialGroupId')
                        //        this.updata()
                        //     },
                        //     cancelEvent: () => {

                        //     }
                        // });
                        // break;
                    case 1:
                        HiNavigator.navigateToCommunityManagement();
                        break;

                }
            } catch (e) {
                console.warn(e);
            }
        }else{
            try {
              const { tapIndex } = await showActionSheet({ itemList: ['设置', '更多圈子'],itemColor:"#454545"});
                switch (tapIndex) {
                    case 0:
                    HiNavigator.navigateToSetup({ socialMemberInfo: JSON.stringify(this.data.socialMemberInfo), currentSocial: JSON.stringify(this.data.currentSocial) });
                    console.log(this.data.currentSocial)
                    break;

                        // WXDialog.showDialog({
                        //   content: '确定要退出该圈子吗',
                        //   showCancel: true,
                        //   confirmText: "确定",
                        //   cancelText: "取消",
                        //   confirmEvent: () => {
                        //     this.updata()
                        //   },
                        //   cancelEvent: () => {

                        //   }
                        // });
                        // break;

                        // HiNavigator.navigateToCommunityManagement();
                        // break;
                    case 1:
                        HiNavigator.navigateToCommunityManagement();
                        break;
                }
            } catch (e) {
                console.warn(e);
            }
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
    onNoupdate({detail}) {
        console.log(detail);
        this.setData({
            noUpdateAll:detail.noUpdateAll
        })
    },
    showSharedID(){
        console.log(this.data.socialMemberInfo.sharedId)
    },
    onLoad(options) {
        console.log('firstEnter',getApp().globalData.firstEnter)
        if(!getApp().globalData.firstEnter&&getApp().globalData.isShareAddcommunity){
            wx.showToast({
                title: '加入成功',
                duration: 1400,
                image: '../../images/community/nike.png'
            })
        }
    },
    async onShow() {
        // if (this.isUpdateAllWhenLoad) {
        wx.getSetting({
            success: (res) => {
                console.log('圈子打印是否授权', res.authSetting['scope.userInfo']);
                if (!res.authSetting['scope.userInfo'] &&!getApp().globalData.isLogin) {
                    wx.setNavigationBarColor({frontColor: '#000000', backgroundColor: '#ffffff'});
                    wx.setBackgroundColor({
                        backgroundColor: '#ffffff', // 窗口的背景色为白色
                    });
                    this.setData({
                        haveGroupId:false,
                        noCommunity:true
                    })
                }
            }
        });
       /* if(getApp().globalData.isNoRegister){
            console.log('isNoRegisterisNoRegister',getApp().globalData.isNoRegister)
            getApp().globalData.isNoRegister=false
            console.log('getApp().globalData.isNoRegister',getApp().globalData.isNoRegister)
            wx.setNavigationBarColor({frontColor: '#000000', backgroundColor: '#ffffff'});
            wx.setBackgroundColor({
                backgroundColor: '#ffffff', // 窗口的背景色为白色
            });
            this.setData({
                haveGroupId:false,
                noCommunity:true
            })
            return
        }*/
        this.forceUpdateAll();
       /* this.messageItem = this.selectComponent("#messageItem");
        this.data.dynamicList.map((value, index) => {
            if(value){
                this.messageItem.undateName(value.praiseInfo.list)
            }
        });*/
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
        }else{
            //HiNavigator.navigateToCreateCommunity()
        }
    },
    async toReductionList(){
        HiNavigator.navigateToReductionList({groupId:(await judgeGroupEmpty()).groupId})
    },

    async toPunchList(){
        HiNavigator.navigateToPunchList({groupId:(await judgeGroupEmpty()).groupId})
    },
     async toFatBurningList(){
       HiNavigator.navigateToFatBurningList({ groupId: (await judgeGroupEmpty()).groupId })
     },

    async forceUpdateAll() {
        if(this.data.noUpdateAll){
            this.setData({
                noUpdateAll:false,
            })
            console.log('没更新执行')
            return
        }
        console.log('更新被执行了')
        function showData({currentSocial}) {
            return new Promise(async (resolve, reject) => {
                try {
                    console.log(currentSocial,'currentSocial')
                    if (currentSocial.groupId) {
                        wx.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: '#171717'});
                        wx.setBackgroundColor({
                            backgroundColor: '#171717', // 窗口的背景色为黑色
                        });
                        this.setData({
                            haveGroupId:true,
                            noCommunity:false
                        })
                    } else {
                        wx.setNavigationBarColor({frontColor: '#000000', backgroundColor: '#ffffff'});
                        wx.setBackgroundColor({
                            backgroundColor: '#ffffff', // 窗口的背景色为白色
                        });
                        this.setData({
                            haveGroupId:false,
                            noCommunity:true
                        })
                    }
                } catch (e) {
                    console.error(e);
                }

                this.setData({currentSocial}, async () => {
                    try {
                        const dynamicList = await getGroupDynamicManager.getGroupDynamicList();
                        this.setData({
                            dynamicList,
                            canUpdate:true
                        }, resolve);
                        console.log('最新数组',this.data.dynamicList)
                    } catch (e) {
                        reject(e);
                    }
                });
                console.log('currentSocial.groupId',currentSocial.groupId)
                if(currentSocial.groupId){
                    this.setData({socialMemberInfo: (await getSocialGroupMembersViewInfo())});
                }

            })

        }

        try {
            console.log('getSocialGroupManager.currentSocialgetSocialGroupManager.currentSocial',getSocialGroupManager.currentSocial)
            await getSocialGroupManager.getSocialGroupList();
            getGroupDynamicManager.clear();
            await showData.call(this, {currentSocial: getSocialGroupManager.currentSocial});
          console.log("currentSocial", this.data.currentSocial)
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
        console.log('22')
        const list = await getGroupDynamicManager.getGroupDynamicList();
        if (list.length) {
            this.setData({dynamicList: this.data.dynamicList.concat(list)});
        }
        Toast.hiddenLoading();
    },
    onShareAppMessage: function () {
        return {
            title: this.data.socialMemberInfo.memberName+'邀请你加入['+this.data.socialMemberInfo.name+']',
            path: '/pages/shareAddcommunity/shareAddcommunity?sharedId=' + this.data.socialMemberInfo.sharedId,
            //imageUrl:'https://backend.hipee.cn/hipee-resource/images/hibreath/20191104/95748a6a66c2aa77818764b93a693ea8.o6zajs-zth1ke_1mwkyso5jiadbc.plktmxj2ockf95748a6a66c2aa77818764b93a693ea8.png'
        };
    },
    onPageScroll: function (e) {
        this.setData({
            scrollTopNum:e.scrollTop
        })
        //wx.setStorageSync('communityScrollTop', e.scrollTop);
    },



});
