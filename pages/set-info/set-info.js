// pages/set-info/set-info.js
/**
 * @Date: 2019-10-09 11:00:00
 * @LastEditors: 张浩玉
 */
import { Toast as toast, Toast, WXDialog } from "heheda-common-view";
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import IndexCommonManager from "./view/indexCommon";
import HiNavigator from "../../navigator/hi-navigator";
import Login from "../../modules/network/login";
import UserInfo from "../../modules/network/userInfo";

import ConnectionManager from "./view/connection-manager";
import { oneDigit } from "../food/manager";
import { ConnectState } from "../../modules/bluetooth/bluetooth-state";
import { showActionSheet } from "../../view/view";
import { judgeGroupEmpty, whenDismissGroup } from "../community/social-manager";
import * as Shared from "./view/shared.js";
import { UploadUrl } from "../../utils/config";
const app = getApp();
var mta = require('../../utils//mta_analysis.js')
Page({
  data: {
    finishedGuide: false,//新手引导是否完成编制
    deny:false,
    showMytoast: false, //非首次打卡toast弹窗
    showExcitation: false,//首次打卡激励弹窗
    animationData: '',
    animationTop: '',
    breathSign: {},//签到数据
    sync:{
      num: 0,
      countNum: 0, //需要同步的总数
      timer: ""
    },
    burnReadyLeft: 130,
    hideModal: true,
    topTaskTip: false,//头部显隐标志
    showBigTip:false,//离线上传数据弹框
    weight: '',
    answerBtns: [
      { text: 'Yes', imgSrc: '../../images/set-info/yes.png' },
      { text: 'No', imgSrc: '../../images/set-info/no.png' }
    ],
    answer: true,
    answerData: {},
    answerBtnReady: false
  },



  onHide() {
    //离开时 告知蓝牙标志位 0x3D   0X02
    if (app.getLatestBLEState().connectState === "connected") {
      var pages = getCurrentPages(); //获取加载的页面
      var currentPage = pages[pages.length - 1]; //获取当前页面的对象
      if (currentPage.route === "pages/set-info/set-info") {
        app.bLEManager.sendISpage({ isSuccess: false });
        console.log("小程序告知设备 此时未在打卡页面  不可以上传离线数据");
      }
    }
    this.setData({
      showExcitation: false,
    });
  },

  async onLoad(options) {
    let sharedId =  wx.getStorageSync('sharedId')
    this.setData({
      sharedId
    })
    wx.removeStorage('sharedId')
    wx.hideShareMenu();
    this.connectionPage = new ConnectionManager(this);
    this.getFinishedGuide()
    this.getPresonMsg();
    setTimeout(() => {
      //每天第一次登录积分奖励
      if (app.globalData.isLogin && app.globalData.dayFirstLoginObj.inTaskProgress) {
        this.setData({
          showMytoast: true,
          ...app.globalData.dayFirstLoginObj
        })
        getApp().globalData.dayFirstLoginObj.inTaskProgress = false;
        setTimeout(() => {
          this.setData({
            showMytoast: false,
          })
        }, 3000)
      }
    }, 1200)
  },
  onShow() {
    this.getFinishedGuide()
    this.handleBle();
    this.getAnswer();
    this.getBreathSignInInfo();
    let that = this;
    //进入页面 告知蓝牙标志位 0x3D   0X01 可以同步离线数据
    app.onDataSyncListener = ({ num, countNum }) => {
      console.log("同步离线数据：", num, countNum);
      if (num > 0 && countNum > 0) {
        that.data.sync.num = num;
        that.data.sync.countNum = countNum;
        if (that.data.sync.countNum >= that.data.sync.num) {
          that.setData({
            sync: that.data.sync,
            showBigTip: true
          });
          clearTimeout(that.data.sync.timer);
          that.data.sync.timer = "";
          that.data.sync.timer = setTimeout(function () {
            that.getTaskInfo();
            that.setData({
              showBigTip: false
            });
            if (that.data.showBigTip == false) {
              WXDialog.showDialog({
                content: "上传成功，本次共上传" + that.data.sync.num + "条结果",
                showCancel: true,
                confirmText: "查看记录",
                cancelText: "暂不查看",
                confirmEvent: () => {
                  HiNavigator.navigateToResultNOnum();
                },
                cancelEvent: () => { }
              });
            }
          }, 2000);
        }
      } else {
        that.setData({
          showBigTip: false
        });
      }
    };
    //首页更新需要 上个页面 onUnload getApp().globalData.issueRefresh = true
    if (this.data.isfinishedGuide || this.data.isFood || getApp().globalData.issueRefresh) {
      getApp().globalData.issueRefresh = false;
      that.getTaskInfo();
    }
    if (wx.getStorageSync('showWeight')) {
      this.showModal();
      wx.setStorageSync('showWeight', false)
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    console.log(this.data.showNewInfo, this.data.showGuide, this.data.showGoclockin, '======')
    if (!this.data.showNewInfo && !this.data.showGuide && !this.data.showGoclockin) {
      Toast.showLoading();
      await this.getTaskInfo();
      Toast.hiddenLoading();
    }
    wx.stopPullDownRefresh();
  },
  onShareAppMessage() {
    this.setData({
      isOpened: false
    });
    wx.showTabBar({
      fail: function () {
        setTimeout(function () {
          wx.showTabBar();
        }, 500);
      }
    });
    return {
      title: '我正在低碳燃脂，快来一起加入！',
      path: `/pages/sharedGuidance/sharedGuidance?sharedId=${this.data.taskInfo.sharedId}`,
      imageUrl: this.data.shareImg
    };
  },
  //是否完成新手引导
  getFinishedGuide(){
    if (!wx.getStorageSync('finishedGuide')) {
      //获取是否完成手机号验证、新手引导是否完成
      if (this.data.deny) {
        return;
      }
      wx.hideTabBar({
        fail: function () {
          setTimeout(function () {
            wx.hideTabBar()
          }, 200)
        }
      });

    } else {
      this.setData({
        finishedGuide: true
      })
      wx.showTabBar({
        fail: function () {
          setTimeout(function () {
            wx.showTabBar();
          }, 200);
        }
      });
      //判断是否是从补签页面导入
      if (!!this.data.sharedId) {
        this.putBreathSign();
      }
    }
  },
  //补签请求接口
  async putBreathSign(){
    let sharedId = this.data.sharedId;
    let postData = {
      "sharedId": sharedId //分享用户编号
    }
    console.log('postData', postData)
    let { result } = await Protocol.putBreathSign(postData);
    if (result.code == 1){
      wx.showToast({
        title: '补签成功',
        icon: none,
        duration: 3000
      });
    }
    
  },
  //获取个人信息
  async getPresonMsg() {
    const { result } = await Protocol.getAccountInfo();
    if (result.finishedGuide) {
      this.setData({
        finishedGuide: true
      })
      wx.showTabBar({
        fail: function () {
          setTimeout(function () {
            wx.showTabBar();
          }, 200);
        }
      });
      wx.setStorageSync('finishedGuide', true);
      this.getTaskInfo()
      //判断是否是从补签页面导入
      if (!!this.data.sharedId) {
        this.putBreathSign();
      }
    } else {
      if (this.data.deny){
        return;
      }
      wx.hideTabBar({
        fail: function () {
          setTimeout(function () {
            wx.hideTabBar()
          }, 200)
        }
      });
      this.setData({
        finishedGuide: false
      })
    }
  },
  //获取打卡信息
  async getBreathSignInInfo() {
    const { result } = await Protocol.getBreathSignInInfo();
    if (result.isFinished){
      let data = result.data;
      for (let item of data) {
        if (item.executeOrder < result.days && !item.isFinished){
          result.replenish = true;
        }
      }
    }
    this.setData({
      breathSign: result
    })
  },
  //获取任务信息
  async getTaskInfo() {
    const { result } = await Protocol.getTaskInfo();
    this.setData({
      taskInfo: result
    })
    let imgUrlsLength = result.otherUsers.imgUrls.length;
    let burnReadyLeft = (imgUrlsLength == 0) ? '0' : (imgUrlsLength == 1) ? '63' : (imgUrlsLength == 2) ? '97' : '130';
    this.setData({
      burnReadyLeft
    })

  },
  //燃脂
  async fatTaskToFinish() {
    wx.getSystemInfo({
      success(res) {
        if (res.locationEnabled && res.bluetoothEnabled && res.locationAuthorized) {
          HiNavigator.navigateIndex();
          return
        } else if (!res.bluetoothEnabled) {
          setTimeout(() => {
            WXDialog.showDialog({ title: '小贴士', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了' });
          }, 200);
          return
        } else if (!res.locationEnabled) {
          setTimeout(() => {
            WXDialog.showDialog({ title: '小贴士', content: '请开启手机GPS/位置', confirmText: '我知道了' });
          }, 200);
          return
        } else if (!res.locationAuthorized) {
          setTimeout(() => {
            wx.showModal({
              title: '小贴士',
              content: '前往手机【设置】->找到【微信】应用\n' +
                '\n' +
                '打开【微信定位/位置权限】',
              showCancel: false,
              confirmText: '我知道了',
            })
          }, 200);
          return
        }
        HiNavigator.navigateToResultNOnum();
      }
    })


    mta.Event.stat('zhulujing', { 'clickfatburningtest': 'true' })
    mta.Event.stat('ranzhijiance', { 'clickfatburningtest': 'true' })
  },
  //修改体重
  weightGoalChange(e) {
    let weight = e.detail.value;

    let str = (weight + '').split('.')[1];

    if (str && str.length > 1) {
      toast.warn('只能一位小数')
      weight = Number(weight).toFixed(1);
    }
    this.setData({
      weight: weight
    })
  },
  objIsEmpty(obj) {
    return typeof obj === "undefined" || obj === "" || obj === null;
  },
  showDialog(content) {
    WXDialog.showDialog({ title: "小贴士", content, confirmText: "我知道了" });
  },
  //保存体重
  async saveWeight() {
    if (this.objIsEmpty(this.data.weight)) {
      toast.warn("请填写体重");
      return;
    }
    const weightnum = this.data.weight.split(".");
    if (weightnum.length > 1 && weightnum[1] >= 10) {
      this.showDialog("体重至多支持3位整数+1位小数");
      return;
    }
    if (weightnum[0] >= 1000) {
      this.showDialog("体重至多支持3位整数+1位小数");
      return;
    }
    const { result: bodyIndexResult } = await Protocol.setBodyIndex({ weight: this.data.weight });
    this.getTaskInfo();
    this.hideModal();
    const { result: incentiveList } = await Protocol.postIncentive();
    if (incentiveList.taskInfo.bodyIndex && incentiveList.taskInfo.bodyIndex.todayFirst) {
      this.setData({
        showExcitation: true,
        toastType: "weight",
        toastResult: incentiveList
      });
    }
    this.setData({
      ...bodyIndexResult,
      showMytoast: true,
      toastType: "weight"
    })
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
    setTimeout(() => {
      this.setData({
        showMytoast: false,
      })
    }, 3000)
  },
  //体重弹框
  getShowExcitation(e) {
    this.setData({
      showExcitation: e.detail.showExcitation
    });
  },
  //引导页授权
  async onGetUserInfoEvent(e) {
    const { detail: { userInfo, encryptedData, iv } } = e;
    console.log(userInfo)
    if (!!userInfo) {
      await Login.doRegister({ userInfo, encryptedData, iv });
      let sharedId = this.data.sharedId
      //此处需要处理不授权的情况
      this.setData({
        deny: false
      })
      if (sharedId){
        let postData = {
          "sharedId": sharedId //分享用户编号
        }
        await Protocol.putBreathSign(postData);
        wx.showToast({
          title: '帮好友补签成功',
          duration: 500
        });
        setTimeout(() => {
          HiNavigator.navigateToGuidance({sharedId})
        }, 500);
      }else{
        wx.showToast({
          title: '授权成功',
          duration: 500
        });
        setTimeout(() => {
          HiNavigator.navigateToGuidance({})
        }, 500);
      }
      

    }else{
      this.setData({
        deny:true
      })
      wx.showTabBar({
        fail: function () {
          setTimeout(function () {
            wx.showTabBar();
          }, 200);
        }
      });
    }
  },
  //去燃脂列表页
  async goToFatResultPage(){
    if (this.data.taskInfo.fatTask.finished) {
      HiNavigator.navigateToResultNOnum();
      mta.Event.stat('zhulujing', { 'clicktodaysummaryreport': 'true' })
      return;
    }
    let {
      result: { list: breathList }
    } = await Protocol.postBreathDatalistAll({
      timeBegin: 1510468206000,
      timeEnd: Date.now()
    });
    if (breathList.length > 0) {
      HiNavigator.navigateToResultNOnum();
      return;
    }
    wx.getSystemInfo({
      success(res) {
        if (res.locationEnabled && res.bluetoothEnabled && res.locationAuthorized) {
          HiNavigator.navigateIndex();
          return
        } else if (!res.bluetoothEnabled) {
          setTimeout(() => {
            WXDialog.showDialog({ title: '小贴士', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了' });
          }, 200);
          return
        } else if (!res.locationEnabled) {
          setTimeout(() => {
            WXDialog.showDialog({ title: '小贴士', content: '请开启手机GPS/位置', confirmText: '我知道了' });
          }, 200);
          return
        } else if (!res.locationAuthorized) {
          setTimeout(() => {
            wx.showModal({
              title: '小贴士',
              content: '前往手机【设置】->找到【微信】应用\n' +
                '\n' +
                '打开【微信定位/位置权限】',
              showCancel: false,
              confirmText: '我知道了',
            })
          }, 200);
          return
        }
      }
    })


    mta.Event.stat('zhulujing', { 'clickfatburningtest': 'true' })
    mta.Event.stat('ranzhijiance', { 'clickfatburningtest': 'true' })
  },
  //加群页
  goToAddLowfat() {
    HiNavigator.navigateToAddLowfatGroup();
  },
  //减脂效果页
  goToLowFatReport() {
    let taskInfo = this.data.taskInfo;
    if (taskInfo.fatTask.finished && taskInfo.weightTask.finished) {
      HiNavigator.navigateToLowFatReport();
      return;
    }
    WXDialog.showDialog({
      title: '', content: '你还未完成今日所有任务哦', confirmText: '我知道了', confirmEvent: () => {
      }
    });

  },
  goToGetGift(){
    HiNavigator.navigateToGetGift()
  },
  //体重列表
  async bindTapToFood(){
    if (this.data.taskInfo.weightTask.finished){
      HiNavigator.navigateTofood();
      return;
    }
    let {
      result: { list: weightList }
    } = await Protocol.postWeightDataListAll({
      timeBegin: 1510468206000,
      timeEnd: Date.now()
    });
    if (weightList.length > 0) {
      HiNavigator.navigateTofood();
      return;
    }
    this.showModal();
    
  },
  //蓝牙
  handleBle() {
    this.indexCommonManager = new IndexCommonManager(this);
    app.setBLEListener({
      bleStateListener: () => {
        console.log("setPage-bleStateListener", app.getLatestBLEState());
        if (app.getLatestBLEState().connectState === "connected") {
          var pages = getCurrentPages(); //获取加载的页面
          var currentPage = pages[pages.length - 1]; //获取当前页面的对象
          if (currentPage.route === "pages/set-info/set-info") {
            app.bLEManager.sendISpage({ isSuccess: true });
            console.log("小程序告知设备 此时在打卡页面 可以上传离线数据");
          }
        }
      },
      receiveDataListener: ({ finalResult, state }) => {
        console.log("setPage-receiveDataListener", finalResult, state);
      }
    });

    Protocol.getDeviceBindInfo().then(data => {
      let deviceInfo = data.result;
      console.log("获取到的设备", data);
      if (!deviceInfo) {
        app.getBLEManager().clearConnectedBLE();
        this.connectionPage.unbind();
      } else {
        app.getBLEManager().setBindMarkStorage();
        console.log(
          "app.getLatestBLEState().connectState",
          app.getLatestBLEState().connectState
        );
        if (app.getLatestBLEState().connectState !== "connected") {
          app.getBLEManager().connect({ macId: deviceInfo.mac });
        }
      }
    });
  },
  //展示页面头部
  showTopTask() {
    let topTaskTip = this.data.topTaskTip;
    this.setData({
      topTaskTip: !topTaskTip
    })
    if (topTaskTip) {
      this.topFadeIn()
    } else {
      this.topFadeDown()
    }
  },
  cancel() {
    this.setData({
      isOpened: false
    });
    wx.showTabBar({
      fail: function () {
        setTimeout(function () {
          wx.showTabBar();
        }, 500);
      }
    });
  },
  //减脂大实话
  async getAnswer(txt) {
    let data = await Protocol.getAnswer();
    this.setData({
      answerBtnReady: false,
      answerData: data.result
    })
  },
  //减脂大实话提交
  async answerFinish(e) {
    if (this.data.answerBtnReady) {
      return;
    }
    let index = e.currentTarget.dataset['index'];
    let chooseAnswer = index > 0 ? 0 : 1;
    let answerId = this.data.answerData.answerDatabaseBean.id;
    let data = {
      answerId: answerId,
      chooseAnswer: chooseAnswer
    }
    this.setData({
      answerBtnReady: true
    })
    const { result: bodyIndexResult } = await Protocol.answerFinish(data);
    if (bodyIndexResult.isCorrect == 1) {
      this.setData({
        ...bodyIndexResult,
        showMytoast: true,
      })
      setTimeout(() => {
        this.setData({
          showMytoast: false,
        })
      }, 3000)
    }
    this.getAnswer()
  },

  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      weight: '',
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 720)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  topFadeIn() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.animation.height(0).step()
    that.setData({
      animationTop: that.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  topFadeDown() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    let height = '310rpx'
    if (this.data.breathSign.days == 1 && !this.data.breathSign.isFinished){
      height = '240rpx'
    }
    that.animation.height(height).step()
    that.setData({
      animationTop: that.animation.export(),
    })
  }

});
