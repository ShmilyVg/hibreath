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
import ConnectionManager from "./view/connection-manager";
const app = getApp();
const ImageSource = require('../../utils/ImageSource.js');
const ImageLoader = require('../../utils/ImageLoader.js')
var mta = require('../../utils//mta_analysis.js')
Page({
  data: {
    finishedPhone: false,//新手引导是否完成编制
    showPage:false,
    deny:false,
    showMytoast: false, //非首次打卡toast弹窗
    showExcitation: false,//首次打卡激励弹窗
    animationData: '',
    breathSign: {},//签到数据
    taskFinished:false,
    original_show:false,
    sync:{
      num: 0,
      countNum: 0, //需要同步的总数
      timer: ""
    },
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
    answerBtnReady: false,
    needImgList:["fatWindows/flash1.png", "fatWindows/flash2.png"],
    gitImgList: ['fatWindows/getGift_3.png'],
    isBind:false,//是否绑定设备
    showGiftwindows:false,
    showGiftwindowsTip:false
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
    console.log('hipeeScenehipeeScenehipeeScene', options)
    //device为硬件扫码标志  menu01 为代餐扫码标志 正常进入时为空（即不存在此值）
    let sharedId = app.globalData.firendSharedId;
    let hipeeScene = options.hipeeScene;
    let hisHipeeScene;
    if (hipeeScene){
      wx.setStorageSync('hipeeScene', hipeeScene)
    }else{
      hisHipeeScene = wx.getStorageSync('hipeeScene');
    }
    hipeeScene = (hipeeScene == 'undefined') ? '' : hipeeScene;
    app.globalData.hipeeScene = hipeeScene || hisHipeeScene;
    this.setData({
      hipeeScene,
      sharedId
    })
    //扫硬件二维码时清除已进入绑定页面标志
    if (hipeeScene == 'device'){
      try{
        wx.removeStorageSync('bindPage');
      }catch(error){}
      
    }
    wx.hideShareMenu();
    this.connectionPage = new ConnectionManager(this);
    this.getFinishedGuide();
    
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
    this.getShoppingJumpCodes();
  },
  onShow() {
    //判断初心遮罩是否显示
    
    if (wx.getStorageSync('original_tip') == 'first') {
      let showGiftwindowsTip = false, showGiftwindows = false;
      if (this.data.showGiftwindowsTip) {
        showGiftwindows = true;
      }
      this.setData({
        showGiftwindows,
        showGiftwindowsTip,
        original_show: true
      })
      this.hideTabBarFun();
      wx.setStorageSync('original_tip', 'ready')
    }else{
      this.setData({
        original_show: false
      })
    }
    this.getBanner();
    this.getPresonMsg();
    this.getFinishedGuide()
    this.handleBle();
    this.getAnswer();
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
            that.setData({
              showBigTip: false
            });
            that.getTaskInfo();
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
    that.getTaskInfo();
  /*  //首页更新需要 上个页面 onUnload getApp().globalData.issueRefresh = true
    if (this.data.isfinishedGuide || this.data.isFood || getApp().globalData.issueRefresh) {
      getApp().globalData.issueRefresh = false;
      that.getTaskInfo();
    }*/
    if (wx.getStorageSync('showWeight')) {
      this.showModal();
      wx.setStorageSync('showWeight', false)
    }
  },
  onUnload(){

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    Toast.showLoading();
    await this.getTaskInfo();
    Toast.hiddenLoading();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage() {
    this.setData({
      isOpened: false
    });
    this.showTabBarFun()
    return {
      title: '我正在低碳燃脂，快来一起加入！',
      path: `/pages/sharedGuidance/sharedGuidance?sharedId=${this.data.taskInfo.sharedId}`,
      imageUrl: this.data.shareImg
    };
  },
  //是否完成新手引导
  getFinishedGuide(){
    if (wx.getStorageSync('finishedGuide')) {
      //获取是否完成手机号验证、新手引导是否完成
      this.setData({
        showPage:true
      })
      this.showTabBarFun()
    }else{
      this.hideTabBarFun();
    } 
  },
  //获取个人信息
  async getPresonMsg() {
    const { result } = await Protocol.getAccountInfo();
    let hipeeScene = this.data.hipeeScene;
    let hisH = wx.getStorageSync('hipeeScene')
    let finishedInfo = false;
    let detail = result.detail;
    if (detail.birthday && detail.sex && detail.weight && detail.height){
      finishedInfo = true;
    }
    wx.setStorageSync('finishedGuide', result.finishedGuide)
    this.setData({
      finishedInfo,
      finishedPhone: result.finishedPhone,
    })
    if (!result.finishedPhone) {
      //获取是否完成手机号验证、新手引导是否完成
      this.setData({
        showPage: false
      })
      this.hideTabBarFun();

    } else if (result.finishedGuide) {
      this.setData({
        finishedPhone: result.finishedPhone,
        finishedGuide: true,
        showPage: true
      })
      
      this.showTabBarFun()
    } else if (finishedInfo){
      if (hipeeScene != 'device'){
        this.setData({
          finishedPhone: result.finishedPhone,
          showPage: true
        })
      }

    }else{
      if (wx.getStorageSync('guidance_tip') != 'ready') {
        HiNavigator.navigateToGuidance({ reset: 2 })
      }
      wx.setStorageSync('guidance_tip', '')
    }
  },
  //图片预加载列表
  imgListArr(){
    var that = this;
    for(var i=0;i<that.data.taskInfo.modalList.length;i++){
      if(that.data.taskInfo.modalList[i].modalType == 'OpenBoxGift'){
        that.data.needImgList.push('fatWindows/getGift_3.png')
      }
      if(that.data.taskInfo.modalList[i].modalType == 'goalFinish'){
        let Num = Number(that.data.taskInfo.modalList[i].ext.fatLevel)+1
        let imageListfinUrl = "fatWindows/fin-type"+Num+'.png'
        that.data.needImgList.push(imageListfinUrl)
      }
      if(that.data.taskInfo.modalList[i].modalType == 'fatForward' || that.data.taskInfo.modalList[i].modalType == 'fatBackward'){
        let Num = Number(that.data.taskInfo.modalList[i].ext.fatLevel)+1
        let imageListfinUrl = "fatWindows/fat-type"+Num+'.png'
        that.data.needImgList.push(imageListfinUrl)
      }
      if(that.data.taskInfo.modalList[i].modalType == 'fatHard'){
        that.data.needImgList.push('fatWindows/fat-type1no.png')
      }
    }
    that.data.needImgList =[...new Set([... that.data.needImgList])]
    var loader=new ImageLoader({
      base: ImageSource.BASE ,
      source: this.data.needImgList,
      loaded: res => {
        setTimeout(()=>{
          this.setData({
            showWindows:true
          })
        },300)
      }
    });
  },
  closeWindows(){
    this.setData({
      showGiftwindowsTip:false,
      showGiftwindows:false
    })
    this.showTabBarFun()
  },
  //关闭初心遮罩
  closeOriginal() {
    //初心遮罩在前  开箱礼在后
    this.setData({
      showGiftwindowsTip: this.data.showGiftwindows,
      original_show: false
    })
    if (!this.data.showGiftwindows) {
      this.showTabBarFun()
    }
  },
  showTabBarFun(){
    //如果初心遮罩或者开箱礼遮罩存在是  暂时不显示TabBar
    console.log(this.data.showGiftwindowsTip , this.data.original_show)
    if (this.data.showGiftwindowsTip || this.data.original_show) return;
    wx.showTabBar({
      fail: function () {
        setTimeout(function () {
          wx.showTabBar();
        }, 200);
      }
    });
  },
  hideTabBarFun(){
    wx.hideTabBar({
      fail: function () {
        setTimeout(function () {
          wx.hideTabBar()
        }, 200)
      }
    });
  },
  //前往 领取低碳饮食页面
  toGetLowFood(){
    let bannerId = this.data.bannerId;
    HiNavigator.navigateTogetLowCarbon(bannerId);
    this.closeWindows()
  },
  async getBanner(){
    const { result: { dataList} } = await Protocol.getBannerList();
    this.setData({
      banner: dataList,
      banner1: dataList[1],
    })
  },
  //获取任务信息
  async getTaskInfo() {
    const { result } = await Protocol.getTaskInfo();
    
    let taskFinished = false;
    if (result.fatTask && result.fatTask.finished){
      taskFinished = true;
    } else if (result.weightTask && result.weightTask.finished){
      taskFinished = true;
    }
    let that = this;
    app.globalData.isDoingPlan = result.isDoingPlan;
    if(result.modalList.length>0){
      var loader=new ImageLoader({
        base: ImageSource.BASE ,
        source: this.data.gitImgList,
        loaded: res => {
          setTimeout(()=>{
            var pages = getCurrentPages(); //获取加载的页面
            var currentPage = pages[pages.length - 1]    //获取当前页面的对象
            console.log('当前页面是', currentPage.route)
            if (currentPage.route === 'pages/set-info/set-info') {
              that.hideTabBarFun();
            }
            //初心遮罩在前  开箱礼在后
            for (let item of result.modalList){
              if (item.modalType == 'OpenBoxGift'){
                that.setData({
                  bannerId:item.bannerId,
                  showGiftwindowsTip: !this.data.original_show,
                  showGiftwindows: true
                })
                break;
              }
            }
            
          },300)
        }
      });

    }
    this.setData({
      taskFinished,
      taskInfo: result
    })
    if (!result.flag && !wx.getStorageSync('flag')) {
      if (this.data.hipeeScene =='device' && this.data.isBind){
        this.goToManifesto()
      } else if (this.data.finishedGuide){
        this.goToManifesto()
      }
      
    }
    
  },

  weightGoal(){
    this.showModal()
  },
  //燃脂
  async fatTaskToFinish() {
    if(!this.isBind){
      HiNavigator.navigateIntroduce({couponCode:this.data.couponCode});
    }else{
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
    }
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
    await Protocol.setBodyIndex({ weight: this.data.weight });
    this.hideModal();
    this.showTabBarFun()
    HiNavigator.navigateToLowFatReport();
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
    if (!!userInfo) {
      await Login.doRegister({ userInfo, encryptedData, iv });
      let sharedId = this.data.sharedId
      //此处需要处理不授权的情况
      this.setData({
        deny: false
      })
      //已经验证过手机号
      if (this.data.finishedPhone) {
        if (wx.getStorageSync('guidance_tip') != 'ready') {
          HiNavigator.navigateToGuidance({ reset: 2 })
        }
        return;
      }

      
      //没有验证过手机号
      if (this.data.hipeeScene){
        HiNavigator.navigateToGoVerification()
      }else{
        //补签
        // if (sharedId) {
        //   let postData = {
        //     "sharedId": sharedId //分享用户编号
        //   }
        //   let { result } = await Protocol.putBreathSign(postData);
        //   if (result.status) {
        //     wx.showToast({
        //       title: '帮好友补签成功',
        //       duration: 500
        //     });
        //   }
        // }
        
        await this.getShoppingJumpCodes();
        setTimeout(() => {
          let couponItem = this.shoppingJumpCodes.find(item => { return item.code == 'milkshake' })
          let couponCode = couponItem.couponCode
          HiNavigator.navigateToGetGift({ couponCode: couponCode, finishedPhone:'false'})
        }, 500);
        return;
      }
      
      

    }else{
      this.setData({
        deny:true
      })
      this.showTabBarFun()
    }
  },
  //去燃脂列表页
  async goToFatResultPage(){
    if (this.data.taskInfo.fatTask.finished) {
      HiNavigator.navigateToResultNOnum();
      return;
    }
    let { result :{ dateTime}} = await Protocol.postBreathDatalist();
    if (dateTime.length > 0) {
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
  },
  
  goToTask(e){
    // console.log(e.currentTarget.dataset.url)
    let { type, url, bannerId} = e.currentTarget.dataset.item;
    if (type == 'wechat'){
      wx.navigateTo({
        url: url + '?bannerId=' + bannerId
      })
    }
    // HiNavigator.navigateToAttendanceBonus()
  },
  goToManifesto(){
    let { sharedId, flag } = this.data.taskInfo
    HiNavigator.navigateToManifesto({ sharedId, flag})
  },
  //减脂效果页
  goToLowFatReport() {
    let taskInfo = this.data.taskInfo;
    if (taskInfo.fatTask.finished || taskInfo.weightTask.finished) {
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
    if (!this.data.showPage){
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
    }
    setTimeout(() => {
      wx.hideLoading();
    }, 1000)
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
      this.setData({
        ...data.result
      })
      console.log("获取到的设备", data);
      if (!this.data.mac) {
        this.isBind = false
        app.getBLEManager().clearConnectedBLE();
        this.connectionPage.unbind();
        //扫硬件码。没有绑定时跳转绑定接口
        
        setTimeout(()=>{
          if (this.data.hipeeScene == 'device' && this.data.finishedInfo) {
            if (wx.getStorageSync('bindPage') != 'ready'){
              HiNavigator.navigateIndex();
            }
          }else{
            wx.hideLoading();
          }
        },300)
        
      } else {
        wx.hideLoading();
        //扫硬件码。绑定时显示首页
        if (this.data.hipeeScene == 'device') {
          this.setData({
            isBind:true,
            showPage: true
          })
          this.showTabBarFun()
        }
        this.isBind = true
        app.getBLEManager().setBindMarkStorage();
        console.log(
          "app.getLatestBLEState().connectState",
          app.getLatestBLEState().connectState
        );
        if (app.getLatestBLEState().connectState !== "connected") {
          app.getBLEManager().connect({ macId: this.data.mac });
        }
      }
    });
  },
  cancel() {
    this.setData({
      isOpened: false
    });
    this.showTabBarFun()
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
    try{
      const { result: bodyIndexResult } = await Protocol.answerFinish(data);
      if (bodyIndexResult.isCorrect == 1) {
        this.setData({
          ...bodyIndexResult,
          showMytoast: false,
        })
        setTimeout(() => {
          this.setData({
            showMytoast: false,
            answerBtnReady: false
          })
        }, 3000)
      }
    }catch(err){
      setTimeout(() => {
        this.setData({
          answerBtnReady: false
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
      duration: 500,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
      that.hideTabBarFun();
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
      that.showTabBarFun()
    }, 200)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  fadeDown: function () {
    this.animation.translateY(500).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  async getShoppingJumpCodes(){
    let { result } = await Protocol.getShoppingJumpCodes();
    app.globalData.shoppingJumpCodes = result;
    this.shoppingJumpCodes = result;
    return ;
  }
});
