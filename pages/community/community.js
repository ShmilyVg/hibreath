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
        addImg:'../../images/community/addc.png',//分享加号
        hbImg:'../../images/community/hd.png',//分享背景
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
      setTimeout(()=>{
        console.log('圈子登录',getApp().globalData.isLogin)
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
      },800)
      this.getBanner()
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
        HiNavigator.navigateToGuidance({})
      }else{
        getApp().globalData.isGroupjoin = true //是圈子进入 加入 燃脂页面的标志位
        HiNavigator.reLaunchToGroupNumber()
      }
      //HiNavigator.navigateToCreateCommunity()
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
    // 圈子banner
    async getBanner(){
        const { result } = await Protocol.postBanner();
        if(result.dataList){
            wx.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: '#4c4c4c'});
            this.setData({
                dataList:result.dataList
            })
        }else{
            wx.setNavigationBarColor({frontColor: '#ffffff', backgroundColor: '#7bcb77'});
        }

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
                        wx.setBackgroundColor({
                            backgroundColor: '#171717', // 窗口的背景色为黑色
                        });
                        this.setData({
                            haveGroupId:true,
                            noCommunity:false
                        })
                    } else {
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
    },

  async toNoticeList(){
      HiNavigator.navigateToNoticeList({ groupId: (await judgeGroupEmpty()).groupId});

  }


});
