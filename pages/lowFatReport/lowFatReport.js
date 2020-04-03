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
var mta = require('../../utils//mta_analysis.js')
Page({

  data: {
    rotate: 130,
    progress: 0,
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
    animationData: false,
    showModalStatus: false,
    shareTip: false,
    report: {},
  },

  onLoad: function (options) {
    Trend.init(this);
    this.handleListData();
    this.getTodayLosefatReport()

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
    let { result } = await Protocol.getTodayLosefatReport({});

    let losefatGrams = result.breathData.losefatGrams;
    let progress = 0;
    if (losefatGrams) {
      progress = (losefatGrams.grams * 450) / losefatGrams.predictGrams
    };
    this.setData({
      request: true,
      progress,
      report: result
    })
    this.getlosefatspeed(result.breathData.dataValue)
  },
  getlosefatspeed(speed) {
    let rotate = 130, piceRotate = 58;
    if (speed <= 2) {
      rotate = rotate + (58 * speed / 2)
    } else if (speed <= 9 && speed >= 3) {
      rotate = rotate + 58 + (58 * (speed - 2) / 7)
    } else if (speed <= 19 && speed >= 10) {
      rotate = rotate + 58 * 2 + (58 * (speed - 9) / 10)
    } else if (speed <= 39 && speed >= 20) {
      rotate = rotate + 58 * 3 + (58 * (speed - 19) / 20)
    } else if (speed <= 99 && speed >= 40) {
      rotate = rotate + 58 * 4 + (58 * (speed - 39) / 60)
    }
    let newrotate = Math.round(rotate);
    this.setData({
      rotate: newrotate
    })
  },
  async handleListData() {
    let timeEnd = getEndZeroTimestamp({ timestamp: new Date() });
    let timeBegin = timeEnd - 7 * 24 * 3600000;
    let { result: { list: list } } = await Protocol.postWeightDataListAll({
      timeBegin,
      timeEnd
    });

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
    Trend.setData({ dataListX, dataListY, dataListY1Name, dataListY2, dataListY2Name, yAxisSplit: 5, color: '#35C050', legend: false }, 650);
  },
  //
  onShareAppMessage(res) {
    let reportId = this.data.reportId;
    return {
      title: '我的今日减脂报告已生成，快来围观！',
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
    HiNavigator.navigateToResultNOnum()
  },
  //跳转体重列表
  goToFood() {
    HiNavigator.navigateTofood()
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
  },
  //分享至朋友圈
  downShareImg() {
    let url = '';
    wx.downloadFile({
      url,
      success() { 
        wx.saveImageToPhotosAlbum({　　　　　　　　　//保存到本地
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '图片已保存至相册，请到朋友圈选择图片发布！',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }, fail() {

      }
    })

  },
  //跳转首页
  weightFinish() {
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
      showModalStatus: true
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
      showModalStatus: false
    });
  },
})
