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
Page({
  data: {
    isfatBurn: false, //燃脂卡片
    isbodyIndex: false, //记录身体指标卡片
    showNewInfo: false, //未授权或者未注册 状态都在此标志位下进行
    showGuide: false, //未授权显示引导页
    showGoclockin:false, //开启打卡状态
    noMeasure: false, //没有准确测过体脂率
    sexBox: [
      { image: "man", text: "男士", isChose: false, value: 1 },
      { image: "woman", text: "女士", isChose: true, value: 0 }
    ],
    currentDate: "2018-12-19",
    page: 1,
    title: [
      "减脂目标",
      "性别",
      "出生日期",
      "身高体重",
      "体脂率",
      "是否有条件自己做饭",
      "推荐目标体重",
      "选择一套方案"
    ],
    page4MenItem: ["4", "7", "10", "15", "20", "25", "30", "35", "40"],
    page4WomenItem: ["10", "15", "20", "25", "30", "35", "40", "45", "50"],
    birth: ["1980", "1", "1"],
    meals: [],
    secArray: [],
    bgColorSetInfoPage: "#ffffff",
    score: 0,
    showBigTip: false,
    schemaId: 0,
    scrollLeft: 490,
    timer: "",
    _timeoutIndex: "",
    bigTipNum: 0,
    bigTipCountNum: 20,
    sync: {
      num: 0,
      countNum: 0, //需要同步的总数
      timer: ""
    },
    phValue: "写下你的减脂目标",
    bloodLow: "",
    heart: "",
    bloodHeight: "",
    weight: "",
    taskId: "",
    showModalStatus: false,
    animationData: "",
    isfinishedGuide: false, //是否选择了方案
    hiddenImg: false, //隐藏左右箭头
    grayLeft: true, //灰色箭头左
    grayRight: false, //灰色箭头右
    currentSwiper: 0,
    isFood: false,
    fatText: "",
    fatTextEn: "",
    fatType: "",
    fatDes: "",

    shareDown: "../../images/set-info/shareDown.png",
    shareUp: "../../images/set-info/shareUp.png",
    shareTotalDif: "",
    shareFat: "",
    shareFatBurnDesc: "",
    shareTaskList: "",
    shareTaskListImg: [],
    shareImg: "",
    bgImg: "../../images/set-info/shareBg.png", //分享背景
    textBg: "../../images/set-info/textBg.png",
    //shareTextList:['分享给好友或群'],
    date: "2019-12-04",
    startTime: "",
    loanTime:'',//定时器
    isNophone:false
  },
  onFocus: function(e) {
    this.setData({
      isFocus: true,
      phValue: "写下你的减脂目标"
    });
  },
  onBlur: function(e) {
    this.setData({
      isFocus: false,
      phValue: "写下你的减脂目标"
    });
  },

  /**
   * @desc 是否显示开屏页
   */
  getIsshowGuide(){
    if(!wx.getStorageSync('showGuide')){
      this.setData({
        showNewInfo:true,
        showGuide:true
      })
      wx.hideTabBar({
        fail: function () {
          setTimeout(function () {
            wx.hideTabBar()
          }, 200)
        }
      });
      return
    }
  },

  /**
   * @desc 未登录状态处理
   */
  getRegister(){
    var that =this;
    //如果未注册
    if (!getApp().globalData.isLogin){
      that.setData({
        showNewInfo: true,
        showGoclockin: true //暂未开启打开状态显示(此时为未注册或者未填写资料状态)
      });
      setTimeout(() => {
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#F55E6B"
        });
      });
      return
    }else{
      that.setData({
        showNewInfo: false,
        showGoclockin: false,
        showGuide:false
      });
    }
  },
  /**
   * @desc 立即体验按钮
   */
  toSetInfo(){
    wx.showTabBar({
        fail: function() {
            setTimeout(function() {
                wx.showTabBar();
            }, 200);
        }
    });
    setTimeout(() => {
      wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "#F55E6B"
      });
    });
    this.setData({
        showGuide:false,
        showGoclockin:true
    })
    wx.setStorageSync('showGuide', 'hiddenGuide');
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
  /**
   * @desc  保存体重信息
   */
  async saveWeight(){
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
    const {result:bodyIndexResult} = await Protocol.setBodyIndex({weight:this.data.weight,taskId:this.data.taskId});
    this.handleTasks();
    this.setData({
      showModalStatus: false
    });
    const { result: incentiveList} = await Protocol.postIncentive();
    console.log('incentiveList',incentiveList)
    console.log('bodyIndexResult',bodyIndexResult)
    if (incentiveList.taskInfo.bodyIndex.todayFirst) {
      this.setData({
        showExcitation: true,
        toastType: "weight",
        toastResult: incentiveList
      });
    }
    this.setData({
      ...bodyIndexResult,
      showMytoast:true,
      toastType: "weight"
    })
    setTimeout(()=>{
      this.setData({
        showMytoast:false,
      })
    },2000)
  },
  getShowExcitation(e) {
    this.setData({
      showExcitation: e.detail.showExcitation
    });
  },
  //同步离线数据
  async onLoad(e) {
    wx.hideShareMenu();
    this.connectionPage = new ConnectionManager(this);
    setTimeout(()=>{
      this.getIsshowGuide();//是否显示开屏页
      if(wx.getStorageSync('showGuide') !==''){
        this.getRegister();//获取是否注册
      }
      this.getPresonMsg();//获取是否完成手机号验证、新手引导是否完成
      console.log('app.globalData.isLogin',app.globalData.isLogin)
      console.log('app.globalData.dayFirstLoginObj.inTaskProgress',app.globalData.dayFirstLoginObj.inTaskProgress)
      //每天第一次登录积分奖励
      if(app.globalData.isLogin && app.globalData.dayFirstLoginObj.inTaskProgress){
        this.setData({
          showMytoast:true,
          ...app.globalData.dayFirstLoginObj
        })
        setTimeout(()=>{
          this.setData({
            showMytoast:false,
          })
        },4000)
      }
    },200)
  },
  /**
   * @desc 根据用户状态进行跳转 立即注册或填写资料
   */
  goRegister(){
    if(!app.globalData.isLogin || this.data.isNophone){
      HiNavigator.navigateToGoRegister()
    }else{
      console.log('22')
      HiNavigator.navigateToGuidance({reset:false})
    }
  },
  /**
   * @desc 获取个人资料
   */
  async getPresonMsg(){
    const {result} = await Protocol.getAccountInfo()
    if(!result.finishedPhone){
        this.setData({
          isNophone:true
        })
    }
    if(result.finishedGuide && result.finishedPhone){
      this.setData({
        showNewInfo: false,
        showGoclockin: false,
        showGuide:false
      })
      this.handleTasks()
    }else{
      console.log('2444')
      this.setData({
        showNewInfo: true,
        showGoclockin: true //暂未开启打开状态显示(此时为未注册或者未填写资料状态)
      });
      setTimeout(() => {
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#F55E6B"
        });
      });
    }
  },
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
  async onCommunitySettingClickEvent() {
    try {
      const { tapIndex } = await showActionSheet({
        itemList: ["查看方案介绍", "退出当前方案"],
        itemColor: "#ED6F69"
      });
      switch (tapIndex) {
        case 0:
          console.log(this.data.planId);
          HiNavigator.navigateToCaseDetailsInformation({
            planId: this.data.planId
          });
          break;
        case 1:
          WXDialog.showDialog({
            content: "确定要退出该方案吗",
            showCancel: true,
            confirmText: "确定",
            cancelText: "取消",
            confirmEvent: () => {
              Protocol.postMembersExit({ planId: this.data.planId }).then(() =>{
                  setTimeout(() => {
                      wx.setNavigationBarColor({
                          frontColor: "#171717",
                          backgroundColor: "#ffffff"
                      });
                  });
              });
            },
            cancelEvent: () => {}
          });

          break;
      }
    } catch (e) {
      console.warn(e);
    }
  },
  /**
   * @desc 跳转今日总结报告
   */
  goLowFatReport(){
    if(this.data.indexfinishNum === this.data.indextaskNum){
      HiNavigator.navigateToLowFatReport();
      return
    }
    WXDialog.showDialog({
      title: '', content: '你还未完成今日所有任务哦', confirmText: '我知道了', confirmEvent: () => {
      }
    });
  },
  /**
   * @desc 自由饮食原则
   */
  toRuler(){
    HiNavigator.navigateToHowEat();
  },
  /**
   * @desc  获取任务列表
   */
  async handleTasks() {
    console.log("getCurrentPages()", getCurrentPages());
    //Toast.showLoading();
    const { result } = await Protocol.postMembersTasks();
    this.setData({
      planId: result.planId,
      planInfo:result.planInfo,
      sharedId: result.sharedId,
      isGroup:result.isGroup,
      caseOnReady: result.onReady,
      caseonFinished: result.onFinished,
      indexfinishNum: result.finishNum,
      indextaskNum: result.taskNum,
      taskListAll: result.taskList,
      bgColorSetInfoPage: "#f2f2f2",
      days:result.days,
      inTaskProgress:result.inTaskProgress
    });
    //每天任务完成 积分奖励
    if(result.inTaskProgress && wx.getStorageSync('today') !== new Date().getDay()){
      this.setData({
        integral:result.integral,
        integralTaskTitle:result.inTaskProgress,
        showMytoast:true,
      })
      setTimeout(()=>{
        this.setData({
          showMytoast:false,
        })
      },2000)
      wx.setStorageSync('today',new Date().getDay())
    }
    if(this.data.indexfinishNum === this.data.indextaskNum){
       this.setData({
         taskToptext:'报告已解锁·点击查看',
         taskTopimg:'../../images/set-info/open.png'
       })
    }else{
      this.setData({
        taskToptext:'今日报告总结',
        taskTopimg:'../../images/set-info/close.png'
      })
    }
    const typesArr = result.taskList.map(d => d.type);
    for (var i = 0; i < typesArr.length; i++) {
      if (typesArr[i] === "fatBurn") {
        const fatBurnExt = result.taskList[i].ext;
        if (result.taskList[i].finished) {
          this.setData({
            isfatBurn: true,
            fatBurnFin: true, //完成标志位
            fatBurnTask: result.taskList[i],
            fatText: fatBurnExt.des.zhCh,
            fatTextEn: fatBurnExt.des.en,
            score: fatBurnExt.thisValue,
            fatType: fatBurnExt.iconUrl,
            fatDes: fatBurnExt.visDes
          });
        } else {
          this.setData({
            isfatBurn: true,
            fatBurnTask: result.taskList[i]
          });
        }
      }
      if (typesArr[i] === "bodyIndex") {
        const bodyIndexExt = result.taskList[i].ext;

        if (result.taskList[i].finished) {
          this.setData({
            isbodyIndex: true,
            bodyIndexFin: true,
            bodyIndexTask: result.taskList[i],
            bodyIndexExt: bodyIndexExt,
            taskId: result.taskList[i].id
          });
          console.log(bodyIndexExt);
        } else {
          this.setData({
            isbodyIndex: true,
            taskId: result.taskList[i].id,
            bodyIndexTask: result.taskList[i]
          });
        }
      }
      if (typesArr[i] === "sport") {
        const sportExt = result.taskList[i].ext;
        if (result.taskList[i].finished) {
          this.setData({
            sportFin: true
          });
        }
        if (sportExt.recommendList[0].list.length == 1) {
          this.setData({
            aheight: 230
          });
        } else {
          this.setData({
            aheight: sportExt.recommendList[0].list.length * 110 + 205
          });
        }
        this.setData({
          currentSwiper: 0,
          sportTask: result.taskList[i],
          sportExt: sportExt
        });
        if (sportExt.recommendList.length < 2) {
          this.setData({
            hiddenImg: true
          });
        } else {
          this.setData({
            hiddenImg: false
          });
        }
      }
      if (typesArr[i] === "food") {
        this.component = this.selectComponent(".countdown");
        this.setData({
          component: this.component
        });
        const foodExt = result.taskList[i].ext;
        if (result.taskList[i].finished) {
          this.setData({
            foodFin: true
          });
        }
        if (foodExt.isMeal) {
          if(foodExt.mealList !==[]){
              if(foodExt.mealList[foodExt.mealIndex].list.length == 1) {
                  this.setData({
                      foodAheight: 230
                  });
              } else {
                  this.setData({
                      foodAheight: foodExt.mealList[foodExt.mealIndex].list.length * 110 + 235
                  });
              }
          }
          this.setData({
            foodcurrentSwiper: foodExt.mealIndex,
          });
        }
        this.setData({
          foodExt: foodExt,
          foodTask: result.taskList[i]
        });
        if (foodExt.mealList.length < 2) {
          this.setData({
            foodHiddenImg: true
          });
        } else {
          this.setData({
            foodHiddenImg: false
          });
        }
      }
    }
    if(this.data.caseOnReady){
      setTimeout(() => {
        wx.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#F2F2F2"
        });
      });
    }else{
      setTimeout(() => {
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#F55E6B"
        });
      });
    }
  },

  async continue() {
    const info = this.data.info;
    console.log(info.goalDesc.length, "info.goalDesc");
    switch (this.data.page) {
      case 1:
        if (this.objIsEmpty(info.goalDesc)) {
          toast.warn("请填写目标");
          return;
        }
        break;
      case 2:
        if (this.objIsEmpty(info.sex)) {
          toast.warn("请选择性别");
          return;
        }
        break;
      case 3:
        break;
      case 4:
        if (this.objIsEmpty(info.height)) {
          toast.warn("请填写身高");
          return;
        } else if (this.objIsEmpty(info.weight)) {
          toast.warn("请填写体重");
          return;
        }
        break;
      case 5:
        if (this.data.noMeasure) {
          if (this.objIsEmpty(this.data.choseIndex)) {
            toast.warn("请选择图片");
            return;
          } else {
            let list = this.data.page4MenItem;
            if (this.data.info.sex === 0) {
              list = this.data.page4WomenItem;
            }
            this.setData({
              "info.bodyFatRate": list[this.data.choseIndex]
            });
          }
        } else {
          if (this.objIsEmpty(info.bodyFatRate)) {
            toast.warn("请填写体脂率");
            return;
          } else if (parseInt(this.data.info.bodyFatRate) >= 100) {
            this.showDialog("请输入正确的体脂率，体脂率范围1%-100%");
            return;
          } else {
            const num = this.data.info.bodyFatRate.toString().split(".");
            if (num.length > 1 && num[1] >= 10) {
              this.showDialog("至多输入1位小数及两位整数");
              return;
            }
          }
        }
        break;
      case 6:
        console.log("page6", this.data.meals);
        let isChoseMeals = false;
        this.data.meals.forEach(value => {
          if (value.isChose) {
            isChoseMeals = true;
          }
        });
        if (!isChoseMeals) {
          toast.warn("请选择三餐");
          return;
        }
        break;
      case 7:
        if (this.objIsEmpty(info.weightGoal)) {
          toast.warn("请填写目标体重");
          return;
        }
        await Protocol.postMembersPut(this.data.info);
        const {
          result: { list: project }
        } = await Protocol.postSettingsLosefatSchema();
        this.setData({
          project: project,
          schemaId: project[0].id
        });
        break;
      case 8:
        await Protocol.postMembersJoinSchema({
          schemaId: this.data.schemaId,
          startTime: this.data.startTime
        });
        this.handleTasks();
        this.setData({
          showNewInfo: false,
          page: 1
        });
        wx.removeStorageSync('breath_user_info_input');
        return;
    }
    if (this.data.page < 8) {
      this.setData({
        page: ++this.data.page
      });
    }
  },

  objIsEmpty(obj) {
    return typeof obj === "undefined" || obj === "" || obj === null;
  },

  showDialog(content) {
    WXDialog.showDialog({ title: "小贴士", content, confirmText: "我知道了" });
  },
  /*新手引导返回上一步*/
  back() {
    this.setData({
      page: --this.data.page
    });
  },

  //减脂目标
  bindInputGoal(e) {
    console.log("e.detail.value", e.detail.value);
    this.setData({
      "info.goalDesc": tools.filterEmoji(e.detail.value).trim()
    });
  },

  bindTapSex(e) {
    let choseIndex = e.currentTarget.dataset.index,
      postSex = 0,
      sexStr = "";
    this.data.sexBox.map((value, index) => {
      value.isChose = choseIndex == index;
      if (value.isChose) {
        postSex = value.value;
        sexStr = value.image;
      }
    });
    this.setData({
      sexBox: this.data.sexBox,
      "info.sex": postSex,
      "info.sexStr": sexStr
    });
  },

  bindChangeBirth(e) {
    const value = e.detail.value;
    const birthArr = value.split("-");
    this.setData({
      "info.birthday": value,
      birth: birthArr
    });
  },
  showBirth(e) {
    console.log("dddddd", e.detail);
    this.setData({
      "info.birthday": e.detail
    });
  },
  //开始时间
  showBirthStart() {},
  bindInputHeight(e) {
    const height = e.detail.value;
    let weightGoal = (height / 100) * (height / 100) * 21;
    weightGoal = weightGoal.toFixed(1);
    this.setData({
      "info.height": height,
      "info.weightGoal": weightGoal
    });
  },

  bindInputWeight(e) {
    this.setData({ "info.weight": e.detail.value });
    return oneDigit(e);
  },

  bindInputWeightGoal(e) {
    console.log("231", e.detail.value);
    this.setData({ "info.weightGoal": e.detail.value });
    return oneDigit(e);
  },

  bindInputExact(e) {
    this.setData({ "info.bodyFatRate": e.detail.value });
    return oneDigit(e);
  },
  //三餐选择
  bindTapMealsSecNone(e) {
    let choseIndex = e.currentTarget.dataset.index;
    var item = this.data.meals[choseIndex];
    console.log("meals", this.data.meals);
    item.isChose = !item.isChose;
    for (var i = 0; i < this.data.meals.length; i++) {
      if (this.data.meals[i].en !== "none") {
        this.data.meals[i].isChose = false;
      }
    }
    this.setData({
      meals: this.data.meals,
      secArray: []
    });
    this.data.secArray.push("none");
    this.setData({
      "info.mealType": this.data.secArray
    });
    console.log("最终结果1", this.data.secArray);
  },
  //数组去重
  unique(arr) {
    return Array.from(new Set(arr));
  },
  //三餐选择
  bindTapMeals(e) {
    for (var i = 0; i < this.data.meals.length; i++) {
      if (
        this.data.meals[i].en == "none" &&
        this.data.meals[i].isChose == true
      ) {
        this.data.meals[i].isChose = false;
        this.setData({
          secArray: []
        });
      }
    }
    let choseIndex = e.currentTarget.dataset.index;
    var item = this.data.meals[choseIndex];
    console.log("item.isChose == true", item.isChose == true);
    if (item.isChose == true) {
      this.data.secArray = this.data.secArray.filter(function(items) {
        return items != item.en;
      });
    } else {
      this.data.secArray.push(item.en);
    }

    console.log("choseIndex", item);
    item.isChose = !item.isChose;
    this.setData({
      meals: this.data.meals,
      "info.mealType": this.data.secArray
    });
    console.log("最终结果2", this.unique(this.data.secArray));
  },

  bindTapExactClick(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      choseIndex: index
    });
  },

  bindTapSwitchExact() {
    this.setData({ noMeasure: !this.data.noMeasure });
  },

/*
  async onGetUserInfoEvent(e) {
    console.log("eee", e);
    const {
      detail: { userInfo, encryptedData, iv }
    } = e;
    if (!!userInfo) {
      if (this.data.isfinishedGuide) {
        this.setData({
          showNewInfo: false,
          showGuide: false,
          page:1
        });
        return;
      }
      try {
        Toast.showLoading();
        await Login.doRegister({ userInfo, encryptedData, iv });
        const userInfo = await UserInfo.get();
        console.log("userInfo", userInfo);
        this.setData({ userInfo, showGuide: false });
        Toast.hiddenLoading();
      } catch (e) {
        Toast.warn("获取信息失败");
      }
      return;
    }
  },
*/

  onReady() {},

  bindScrollView(e) {
    console.log(e.detail.scrollLeft);
    clearTimeout(this.data.timer);
    this.data.timer = "";
    const scrollLeft = e.detail.scrollLeft;
    let that = this;
    let project = this.data.project;
    if (scrollLeft < 130) {
      this.data.timer = setTimeout(function() {
        that.setData({
          scrollLeft: 0,
          schemaId: project[0].id
        });
      }, 300);
    } else if (scrollLeft >= 130 && scrollLeft < 340) {
      this.data.timer = setTimeout(function() {
        that.setData({
          scrollLeft: 490,
          schemaId: project[1].id
        });
      }, 300);
    } else {
      this.data.timer = setTimeout(function() {
        that.setData({
          scrollLeft: 1400,
          schemaId: project[2].id
        });
      }, 300);
    }
  },
  //视频打卡
  toVideoClock(e) {
    console.log("toVideoClock", e.currentTarget);
    if (e.currentTarget.dataset.finid) {
      HiNavigator.navigateToFinishCheck({
        dataId: e.currentTarget.dataset.finid,
        clockWay: "video"
      });
      return;
    }
    HiNavigator.navigateToVideoClock({ id: e.currentTarget.dataset.id });
  },
  //去完成按钮
  bindTapToFinish(e) {
    const {
      currentTarget: {
        dataset: { type }
      }
    } = e;
    console.log(e);
    switch (type) {
      case "fatBurn":
          wx.getSystemInfo({
              success (res) {
                  console.log('locationEnabled',res.locationEnabled,res.bluetoothEnabled)
                  if(res.locationEnabled && res.bluetoothEnabled){
                      HiNavigator.navigateIndex();
                      return
                  }else if(!res.bluetoothEnabled){
                      setTimeout(() => {
                          WXDialog.showDialog({title: '小贴士', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
                      },200);
                      return
                  }else if(!res.locationEnabled){
                      setTimeout(() => {
                          WXDialog.showDialog({title: '小贴士', content: '请开启手机GPS/位置', confirmText: '我知道了'});
                      },200);
                      return
                  }else{
                      setTimeout(() => {
                          WXDialog.showDialog({title: '小贴士', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
                      },200);
                      return
                  }
              }
          })
        break;
      case "bodyIndex":
        this.showModal();
        /* HiNavigator.navigateToDeviceUnbind();*/
        break;
      case "videoFood":
        HiNavigator.navigateTofoodVideoclock({
          id: e.currentTarget.dataset.dataid,
          videoUrl: e.currentTarget.dataset.videourl
        });
        break;
      case "videoLosefat":
        HiNavigator.navigateTofoodVideoclock({
          id: e.currentTarget.dataset.dataid,
          videoUrl: e.currentTarget.dataset.videourl
        });
        break;
        case 'sport':
            HiNavigator.navigateToFreeClock();
            break
    }
  },
  //新手任务跳转
  bindTapToTask(e){
    const {currentTarget: {dataset: { type,taskid,isfinished}}} = e;
    console.log('type',type,taskid)
    switch (type) {
      case "howBreath":
        HiNavigator.navigateToSpirits({taskId:taskid,isfinished:isfinished})
      break;
      case "whatNoteworthy":
        HiNavigator.navigateToAttention({taskId:taskid,isfinished:isfinished})
      break;
      case "howClockIn":
        HiNavigator.navigateToHowRegister({taskId:taskid,isfinished:isfinished})
      break;
    }
  },
  //准备日 视频打卡完成后
  bindTapToVideo(e) {
    HiNavigator.navigateTofoodVideoclock({
      id: e.currentTarget.dataset.dataid,
      videoUrl: e.currentTarget.dataset.videourl
    });
  },
    //方案完成跳转荣誉报告
   bindTapToPlanFinish(){
       HiNavigator.navigateToPlanfinish({ planId: this.data.planId});
   },
  async bindTapProject() {
    HiNavigator.navigateToCaseDetails({ schemaId: this.data.schemaId });
  },

  onShow() {
    this.handleBle();
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
          that.data.sync.timer = setTimeout(function() {
            that.handleTasks();
            that.setData({
              showBigTip: false
            });
            console.log(
              "今日燃脂任务是否完成标志位",
              that.data.fatBurnTask,
              that.data.fatBurnTask.finished
            );
            if (that.data.showBigTip == false) {
              WXDialog.showDialog({
                content: "上传成功，本次共上传" + that.data.sync.num + "条结果",
                showCancel: true,
                confirmText: "查看记录",
                cancelText: "暂不查看",
                confirmEvent: () => {
                  HiNavigator.navigateToResultNOnum();
                },
                cancelEvent: () => {}
              });
              /*    if(that.data.fatBurnTask.finished){
                                WXDialog.showDialog({
                                    content: '上传成功，本次共上传'+that.data.sync.num+'条结果',
                                    showCancel: true,
                                    confirmText: "查看记录",
                                    cancelText: "暂不查看",
                                    confirmEvent: () => {
                                        HiNavigator.navigateToResultNOnum();
                                    },
                                    cancelEvent: () => {

                                    }
                                });
                            }else{
                                WXDialog.showDialog({
                                    content: '上传成功，本次共上传'+that.data.sync.num+'条结果，上传的结果暂无今日检测结果，燃脂打卡任务有待完成哦~',
                                    showCancel: true,
                                    confirmText: "查看记录",
                                    cancelText: "暂不查看",
                                    confirmEvent: () => {
                                        HiNavigator.navigateToResultNOnum();
                                    },
                                    cancelEvent: () => {

                                    }
                                });
                            }*/
            }
          }, 2000);
        }
      } else {
        that.setData({
          showBigTip: false
        });
      }
    };

    if (this.data.isfinishedGuide || this.data.isFood || getApp().globalData.issueRefresh) {
      getApp().globalData.issueRefresh = false;
      that.handleTasks();
    }
    console.log(
      "打卡页面更新了",
      getApp().globalData.issueRefresh,
      this.data.isfinishedGuide,
      this.data.isFood
    );
  },

  async bindTapToResultPage() {
    if (this.data.fatBurnFin) {
      const { fatText, fatTextEn, fatDes, score } = this.data;
      console.log(fatText, fatTextEn, fatDes, score);
      HiNavigator.navigateToResult({ fatText, fatTextEn, fatDes, score });
      /*HiNavigator.navigateToResultNOnum();*/
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
      success (res) {
        console.log('locationEnabled',res.locationEnabled,res.bluetoothEnabled)
        if(res.locationEnabled && res.bluetoothEnabled){
          HiNavigator.navigateIndex();
          return
        }else if(!res.bluetoothEnabled){
          setTimeout(() => {
            WXDialog.showDialog({title: '小贴士', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
          },200);
          return
        }else if(!res.locationEnabled){
          setTimeout(() => {
            WXDialog.showDialog({title: '小贴士', content: '请开启手机GPS/位置', confirmText: '我知道了'});
          },200);
          return
        }else{
          setTimeout(() => {
            WXDialog.showDialog({title: '小贴士', content: '您的手机蓝牙未开启\n请开启后重试', confirmText: '我知道了'});
          },200);
          return
        }
      }
    })
  },
  async bindTapToFood() {
    if (this.data.bodyIndexFin) {
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
  bindWeightInput(e) {
    const weightNumber = e.detail.value.split(".");
    if (weightNumber[1] > 9 || weightNumber[1] === "0") {
      this.setData({
        weight:tools.subStringNum(e.detail.value)
      })
    }
    if (weightNumber.length > 2) {
      this.setData({
        weight:parseInt(e.detail.value)
      })
    }
    this.setData({
      weight:e.detail.value
    })
  },
  //选择方案轮播图
  swiperChangeCase(e) {
    this.setData({
      schemaId: this.data.project[e.detail.current].id
    });
  },
  //运动打卡--轮播图当前
  swiperChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    });
    if (this.data.sportExt.recommendList[e.detail.current].list.length == 1) {
      this.setData({
        aheight: 230
      });
    } else {
      this.setData({
        aheight:
          this.data.sportExt.recommendList[e.detail.current].list.length * 110 +
          205
      });
    }

    if (e.detail.current === 0) {
      this.setData({
        grayLeft: true,
        grayRight: false
      });
      return;
    }
    if (e.detail.current === this.data.sportExt.recommendList.length - 1) {
      this.setData({
        grayLeft: false,
        grayRight: true
      });
      return;
    }
    this.setData({
      grayLeft: false,
      grayRight: false
    });
  },
  //运动打卡--左按钮
  imgToPre() {
    this.setData({
      currentSwiper: this.data.currentSwiper - 1
    });
  },
  //运动打卡--右按钮
  imgToNext() {
    this.setData({
      currentSwiper: this.data.currentSwiper + 1
    });
  },
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(500).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    });
    setTimeout(
      function() {
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export()
        });
      }.bind(this),
      200
    );
    wx.hideTabBar({
      fail: function () {
        setTimeout(function () {
          wx.hideTabBar()
        }, 200)
      }
    });
  },
  hideModal: function() {
    this.setData({
      showModalStatus: false
    });
    wx.showTabBar({
      fail: function() {
        setTimeout(function() {
          wx.showTabBar();
        }, 200);
      }
    });
    this.handleTasks();
  },
    //选择方案开始日期确定按钮
  hideModalConfirm() {
      Toast.showLoading();
      setTimeout(() => {
            const startTime = this.selectComponent("#pickerDateStart").getDateStart();
            //滚动完成
            const canSub = this.selectComponent("#pickerDateStart").bindpickend();
            //数据渲染完成
            const canSuC = this.selectComponent("#pickerDateStart").getCanSub();
            console.log('startTime',startTime)
            console.log('canSub',canSub)
            if(canSub){
                this.setData({
                    startTime,
                    showModalStatus: false
                });
              wx.showTabBar({
                fail: function() {
                  setTimeout(function() {
                    wx.showTabBar();
                  }, 200);
                }
              });
                this.showBirthStart();
                this.continue();
            }
          Toast.hiddenLoading();
    },1200)
  },
  hideModalCancel() {
    this.setData({
      showModalStatus: false
    });
    wx.showTabBar({
      fail: function() {
        setTimeout(function() {
          wx.showTabBar();
        }, 200);
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    console.log("sharedId", this.data.shareImg);
    this.setData({
      isOpened: false
    });
    wx.showTabBar({
      fail: function() {
        setTimeout(function() {
          wx.showTabBar();
        }, 500);
      }
    });
    return {
      title: '1',
      path: "/pages/taskShareInfo/taskShareInfo?sharedId=" + this.data.sharedId,
      imageUrl: this.data.shareImg
    };
  },
  async listenerButton() {
    Toast.showLoading();
    const {result} = await Protocol.postPosters()
    this.setData({
          shareImg:result.url+'?random='+Date.now(),
    })
      wx.hideTabBar({
          fail: function () {
              setTimeout(function () {
                  wx.hideTabBar()
              }, 500)
          }

      });
      this.setData({
          isOpened:true,
          actionSheetHidden: !this.data.actionSheetHidden
      })
    Toast.hiddenLoading()
  },
  listenerActionSheet: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  cancel() {
    this.setData({
      isOpened: false
    });
    wx.showTabBar({
      fail: function() {
        setTimeout(function() {
          wx.showTabBar();
        }, 500);
      }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    if (!this.data.showNewInfo && !this.data.showGuide && !this.data.showGoclockin) {
      Toast.showLoading();
      await this.handleTasks();
      Toast.hiddenLoading();
    }

    wx.stopPullDownRefresh();

  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    });
  },
  async bindTimeChange() {
    await Protocol.postMembersJoinSchema({ schemaId: this.data.schemaId });
    this.handleTasks();
    this.setData({
      showNewInfo: false
    });
  }
});
