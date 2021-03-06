// pages/lowFatReport/lowFatReport.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import * as Trend from "../../view/trend";
import * as Tools from "../../utils/tools";
import { getEndZeroTimestamp, getFrontZeroTimestamp } from "../../utils/time";
import {
  Toast as toast,
  Toast,
  WXDialog
} from "heheda-common-view";
import Login from "../../modules/network/login";
var mta = require('../../utils//mta_analysis.js')
let isImg = true
Page({

  data: {
    rotate: 130,
    progress: 0,
    navBarBack:true,
    weight: {
      type: 'weight',
      maxLength: 5,
      inputType: 'digit',
      text: '体重', addText: '记体重', addProjectList: [
        {
          id: 'weight',
          title: '体重(kg)',
          placeholder: '请输入您的体重',
          type: 'weight'
        }
      ]
    },
    speed_tip: ['未燃脂  ', '稳步燃脂', '状态极佳', '快速燃脂', '过度燃脂'],
    animationData: false,
    animation_ppm:{},
    showModalStatus: false,
    shareTip: false,
    report: {},
    scrollIng:false,
    isLogin:false
  },

  onLoad: function (options) {
    console.log(options);
    let sharedId = (options.sharedId == 'undefined' || options.sharedId == 'null') ? null : options.sharedId;
    let reportId = (options.reportId == 'undefined' || options.reportId == 'null') ? null : options.reportId;
    let navBarBack = sharedId ? false:true;
    this.setData({
      sharedId,
      reportId,
      navBarBack,
    })

    Trend.init(this);

    this.getTodayLosefatReport()
    setTimeout(()=>{
      this.setData({
        isLogin:getApp().globalData.isLogin
      })
    },500)
  },
  //跳转微信加人页面
  toAdd(){
    HiNavigator.navigateToAddLowfatGroup();
  },
  getImageInfoFun(src){
    wx.getImageInfo({
      src: src,
      success: res => {},
      fail: err => {}
    })
  },
  onReady: function () {
    Trend.initTouchHandler();
  },
  async getTodayLosefatReport() {
    let data ={};
    this.data.sharedId ? data.sharedId = this.data.sharedId:'';
    this.data.reportId ? data.reportId = this.data.reportId : '';
    let { result } = await Protocol.getTodayLosefatReport(data);
    if (!result){
      wx.showToast({
        title: '报告已删除',
        icon: 'none',//
        duration: 3000
      })
      setTimeout(()=>{
        HiNavigator.switchToSetInfo()
      },3000)
      
      return;
    }
    let losefatGrams = result.breathData.losefatGrams;
    let progress = 0;
    if (losefatGrams && losefatGrams.grams && losefatGrams.predictGrams) {
      progress = (losefatGrams.grams * 450) / (Number(losefatGrams.predictGrams) + losefatGrams.grams)
    };
    console.log(losefatGrams)
    result.showTime = Tools.dateFormat(result.time,'YYYY.MM.DD HH:mm');
    let isToday = false;
    if (Tools.dateFormat(result.time) == Tools.dateFormat(new Date())){
      isToday = true;
    }
    let downAccumulateKGrams = result.weigthData.downAccumulateKGrams
    if (downAccumulateKGrams){
      result.weigthData.downAccumulateKGramsTxt = downAccumulateKGrams > 0?'增加':'减少';
      result.weigthData.downAccumulateKGrams = Math.abs(downAccumulateKGrams);
    }
    this.setData({
      request: true,
      progress,
      isToday,
      report: result
    })
    this.getlosefatspeed(result.breathData.dataValue);
    this.handleListData()
  },
  getlosefatspeed(speed) {
    let rotate = 130;
    if (speed <= 2) {
      rotate = rotate + speed * 6;
    } else if (speed <= 39 && speed >= 3) {
      rotate = 142 + (speed - 1) *7
    }else if(speed < 99 && speed >= 40) {
      rotate = 401 + (0.1 * (speed - 39))
    } else if (speed == 99){
      rotate = 415
    }
    let newrotate = Math.round(rotate);
    this.setData({
      rotate: newrotate
    })
  },
  async handleListData() {
    let list = this.data.report.weigthData.list;
    if (!list)return;
    list.forEach((value) => {
      const { time, dateX } = Tools.createDateAndTime(value.time * 1000);
      value.date = { time, date: dateX };
    });
    this.setData({ dataList: list }, () => {
      this.handleTrendData();
    });
  },
  async handleTrendData() {
    let dataListX = [], dataListY = [], dataListY2 = [], dataListY1Name = '', dataListY2Name = '';
    this.data.dataList.sort(function (item1, item2) {
      return item1.createdTimestamp - item2.createdTimestamp;
    }).forEach((value) => {
      const { month, day } = Tools.createDateAndTime(value.createdTimestamp);
      dataListX.push(month + '-' + day);
      dataListY.push(value.dataValue);
    });
    if (!dataListX.length) {
      dataListX.push(0);
      dataListY.push(0);
    }
    dataListY1Name = this.data.weight.text;
    Trend.setData({ dataListX, dataListY, dataListY1Name, dataListY2, dataListY2Name, yAxisSplit: 5, color: '#9fe79c', legend: false }, 650);
    
    var that = this;
    setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'lineCanvas',
        success: function (res) {
          console.log('lineCanvas', res);
          that.setData({
            canvasImg: res.tempFilePath
          })
        }
      })
    }, 500)
  },
  showCanvas(){
    if(this.data.scrollIng){
      this.setData({
        scrollIng:false
      })
    }
  },
  onPageScroll(e){
    var that = this;
    
    if (!this.data.canvasImg){
      wx.createSelectorQuery().select('.weight-chart').boundingClientRect(function (rect) {
        if (!rect)return;
        if (rect.top < 67) {
          that.setData({
            scrollIng: true
          })
        } else {
          that.setData({
            scrollIng: false
          })
        }
      }).exec()
      return;
    }
    if (!this.data.scrollIng){
      that.setData({
        scrollTop: e.scrollTop,
        scrollIng: true
      })
    }   
    
    /* let timer= setTimeout(()=>{
       if(that.data.scrollTop===e.scrollTop){
         that.setData({
           scrollTop:e.scrollTop,
           scrollIng:false
         })
         console.log('滚动结束')
         clearTimeout(timer)
       }
     },300)*/
  },
  onShareAppMessage(res) {
    //
    let reportId = this.data.reportId;
    let sharePoster = this.data.report.sharePoster;
    this.hideModal();
    return {
      title: sharePoster.toFriend.title || "我的减脂报告已生成，快来围观！",
      imageUrl: sharePoster.toFriend.url,
      path: `/pages/lowFatReport/lowFatReport?sharedId=${this.data.report.sharedId}&reportId=${reportId}`
    }
  },
  handlerGobackClick() {
    wx.navigateBack({
      delta: 1,
    })
  },
  //跳转文献
  goToLiterature() {
    HiNavigator.navigateToLiterature()
  },
  //跳转燃脂
  goToResult() {
    HiNavigator.navigateToResultData()
  },
  //跳转体重列表
  goToFood() {
    HiNavigator.navigateTofoodData()
  },
  //跳转新手引导页
  goToGuidance(){
    HiNavigator.navigateToGuidance({ reset:2})
  },
  goToWeightTarget(){
    //参数fromPage  为1的时候从减脂方案页进入
    let fromPage = 1
    HiNavigator.navigateToWeightTarget(fromPage)
  },
  //燃脂
  async fatTaskToFinish() {
    if (!this.data.isToday){
      wx.showToast({
        title: '昨天已经过去，今天继续燃脂',
        icon: 'none',//
        duration: 3000
      })
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
        HiNavigator.navigateToResultNOnum();
      }
    })
  },
  //分享至朋友圈
  downShareImg() {
    let that = this
    //判断用户是否授权"保存到相册"
    wx.getSetting({
      success(res) {
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {//用户允许授权，保存图片到相册
              that.savePhoto();
            },
            fail() {//用户点击拒绝授权，引导用户授权
              wx.openSetting({
                success() {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      that.savePhoto();
                    }
                  })
                }
              })
            }
          })
        } else {//用户已授权，保存到相册
          that.savePhoto()
        }
      }
    })
  },
  savePhoto() {
    let url = this.data.report.sharePoster.toGroup.url;
    let that = this;
    wx.downloadFile({
      url,
      success: function (res) {
        wx.saveImageToPhotosAlbum({　　　　　　　　　//保存到本地
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',//hideModal
              duration: 2000
            })
          }
        })
      }, fail() {
        wx.showToast({
          title: '图片保存失败，请重试！',
          icon: 'none',//
          duration: 2000
        })
      }, complete(){
        that.hideModal()
      }

    })
  },
  toSetInfo(){
    HiNavigator.switchToSetInfo()
  },
  //跳转首页
  weightFinish() {
    if (!this.data.isToday) {
      wx.showToast({
        title: '昨天已经过去，今天继续燃脂',
        icon: 'none',//
        duration: 3000
      })
      return;
    }
    HiNavigator.switchToSetInfo()
  },
  //展开分享
  showModal: function () {
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
      showModalStatus: true,
      scrollIng:true
    });
    setTimeout(
      function () {
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export()
        });
      }.bind(this),
      200
    );
  },
  hideModal: function () {
    this.setData({
      showModalStatus: false,
      scrollIng:false
    });
  },
  async toNextpage(e){
    if(getApp().globalData.isLogin){
      HiNavigator.switchToSetInfo()
    }else {
      const { detail: { userInfo, encryptedData, iv } } = e;
      console.log(userInfo)
      if (!!userInfo) {
        await Login.doRegister({ userInfo, encryptedData, iv });
        setTimeout(() => {
          HiNavigator.switchToSetInfo()
        }, 500);
      }
    }
  },
  // 显示PPM介绍
  ppmshow(){
    HiNavigator.navigateToPPM();
    return;

    
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    });
    this.animation_ppm = animation;
    animation.translateY(500).step();
    this.setData({
      animation_ppm: animation.export(),
      ppmModalStatus: true,
      scrollIng: true
    });
    setTimeout(
      function () {
        animation.translateY(0).step();
        this.setData({
          animation_ppm: animation.export()
        });
      }.bind(this),
      200
    );
  },
  ppmhide: function () {
    this.setData({
      ppmModalStatus: false,
      scrollIng: false
    });
  },
})
