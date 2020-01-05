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
import * as Shared from "./shared.js";
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
        shareTaskListImg:[],
        shareImg:"",
        bgImg:"../../images/set-info/shareBg.png",//分享背景
        addImg:'../../images/community/addc.png',//分享加号
        hbImg:'../../images/community/hd.png',//分享背景
    },
    async toMemberManagerPage() {
        HiNavigator.navigateToMemberManagement({dataId: (await judgeGroupEmpty()).groupId});
    },
    async updata(){
        await whenDismissGroup(Protocol.postMemberGroupExit({...(await judgeGroupEmpty())}));
        this.forceUpdateAll();
        //this.NoticeList();
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

    showShared(){
        console.log('分享Id',this.data.socialMemberInfo.sharedId)
        console.log('圈子名称',this.data.currentSocial.name)
        console.log('成员数量',this.data.socialMemberInfo.memberCount)
        console.log('圈子头像',this.data.currentSocial.imgUrl)
        console.log('成员头像',this.data.socialMemberInfo.memberImgs)
        Toast.showLoading()
        Shared.getImageInfo(this)
        Shared.screenWdith(this)
    },
    cancel(){
        this.setData({
            isSharecomponent:false
        })
        wx.showTabBar({
            fail: function () {
                setTimeout(function () {
                    wx.hideTabBar()
                }, 500)
            }

        });
    },

    onLoad(options) {
        wx.hideShareMenu();
        console.log('firstEnter',getApp().globalData.firstEnter)
        if(!getApp().globalData.firstEnter&&getApp().globalData.isShareAddcommunity){
            wx.showToast({
                title: '加入成功',
                duration: 1400,
                image: '../../images/community/nike.png'
            })
        }
      //this.NoticeList();
    },
    async onShow() {
        if(app.globalData.isImgClock){
          console.log('222222222',app.globalData.publishObj)
            app.globalData.isImgClock=false
            this.setData({
                showMytoast:true,
                toastType:'imgClock',
                ...app.globalData.publishObj
            })
            setTimeout(()=>{
                this.setData({
                    showMytoast:false,
                })
            },3000)
        }
        if(app.globalData.isScrollTopNum){
            app.globalData.isScrollTopNum=false
            setTimeout(()=>{
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 100,
                })
            },10)
        }
        setTimeout(()=>{
          if (!getApp().globalData.isLogin) {
            wx.setNavigationBarColor({frontColor: '#000000', backgroundColor: '#ffffff'});
            wx.setBackgroundColor({
              backgroundColor: '#ffffff', // 窗口的背景色为白色
            });
            this.setData({
              haveGroupId:false,
              noCommunity:true
            })
          }
        },500)

        this.forceUpdateAll();
    },
    async toImgClock(){
        HiNavigator.navigateToImgClockcommunity({id:(await judgeGroupEmpty()).groupId})
    },

    onHide() {

    },
    async onGetUserInfoEvent(e) {
      const { result } = await Protocol.postMemberInfo();
      if(!getApp().globalData.isLogin || !result.finishedPhone){
        HiNavigator.navigateToGoRegister()
        return
      }
      HiNavigator.navigateToCreateCommunity()
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
                            noticeList:wx.getStorageSync('noticeList'),
                        }, resolve);
                        //wx.clearStorageSync('noticeList')
                        try {
                            wx.removeStorageSync('noticeList')
                        } catch(e) {}
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
            await getSocialGroupManager.getSocialGroupList();
            getGroupDynamicManager.clear();
            await showData.call(this, {currentSocial: getSocialGroupManager.currentSocial});
          console.log("currentSocial", this.data.currentSocial)
        } catch (e) {
            console.error('community.js updateAll error', e);
        }
    },
    //sleep函数
     sleep(ms){
        return new Promise((resolve)=>setTimeout(resolve,ms));
    },
    //下拉刷新
    async onPullDownRefresh() {
        await this.sleep(80)
        await this.forceUpdateAll()
        wx.stopPullDownRefresh();
        //this.NoticeList();
    },
    //上拉加载
    async onReachBottom() {
        Toast.showLoading();
        await this.sleep(80)
        const list = await getGroupDynamicManager.getGroupDynamicList();
        if (list.length) {
            this.setData({dynamicList: this.data.dynamicList.concat(list)});
        }

        Toast.hiddenLoading();
    },
    onShareAppMessage: function () {
        this.setData({
            isSharecomponent:false
        })
        wx.showTabBar({
            fail: function () {
                setTimeout(function () {
                    wx.showTabBar()
                }, 500)
            }

        });
        return {
            title: this.data.socialMemberInfo.memberName+'邀请你加入',
            path: '/pages/shareAddcommunity/shareAddcommunity?sharedId=' + this.data.socialMemberInfo.sharedId,
            imageUrl:this.data.shareImg
        };
    },
    onPageScroll: function (e) {
        this.setData({
            scrollTopNum:e.scrollTop
        })
        //wx.setStorageSync('communityScrollTop', e.scrollTop);
    },
/*   async NoticeList(){
     let groupId = wx.getStorageSync('currentSocialGroupId');
     console.log(groupId);
     this.data.groupId = groupId
     const { result: { notice: noticeList } } = await whenDismissGroup(Protocol.postGroupDynamicLatest({
       groupId: this.data.groupId ,
       page: 1
     }));

     this.setData({
       noticeList: noticeList
     })
     console.log("未读消息",this.data.noticeList)
   },*/
  async toNoticeList(){
    /*HiNavigator.navigateToNoticeList({groupId:wx.getStorageSync('currentSocialGroupId'),total: this.data.noticeList.total});*/
      HiNavigator.navigateToNoticeList({ groupId: (await judgeGroupEmpty()).groupId});

  }


});
