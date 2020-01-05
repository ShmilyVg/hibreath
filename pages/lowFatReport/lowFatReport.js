// pages/lowFatReport/lowFatReport.js
import Protocol from "../../modules/network/protocol";
import {
  Toast as toast,
  Toast,
  WXDialog
} from "heheda-common-view";
Page({

  data: {
    nickname:'',
    portraitUrl:'',
    curDate:'',
    left:46,
    report: {},
    todayPer:0,
    yesterdayPer: 0,
    foodDescription:[],
    sprotDescription:[],
    subKGrams:'',
    showShare:true
  },

  onLoad: function (options) {
    console.log('onLoad oprtions->', options)
    let now = new Date();
    this.setData({
      showShare: options.showShare,
      'curDate': now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()
    })
    this.getReport(options.sharedId);
  },

  onReady: function () {
    
  },
  setweightChange(){
    let report = this.data.report;
    let todayNum = report.weightChange.weightToday , yesterdayNum = report.weightChange.lastTimeWeight
    let todayPer, yesterdayPer;
    if (todayNum > yesterdayNum){
      todayPer = '510rpx'
      yesterdayPer = '420rpx'
    } else if (todayNum < yesterdayNum){
      yesterdayPer = '510rpx'
      todayPer = '420rpx'
    }else{
      yesterdayPer = '470rpx'
      todayPer = '470rpx'
    }
    this.setData({
      todayPer, yesterdayPer
    })
  },
  getDesArr(txt){
    let len = 3;
    let part1 = txt.slice(0,len);
    let part2 = txt.slice(len);
    return [part1, part2]
  },
  getlosefatSpeed(Speed){
    let left , pice = 100,piceR = 116;
    if (Speed <= 2){
      left = (pice * Speed/2) ;
    } else if (Speed <= 9 && Speed >= 3){
      left = (pice * (Speed - 2) / 6) + piceR;
    } else if (Speed <= 19 && Speed >= 10) {
      left = (pice * (Speed - 9) / 9) + piceR*2;
    } else if (Speed <= 39 && Speed >= 20) {
      left = (pice * (Speed - 19) / 19) + piceR * 3;
    } else if (Speed <= 99 && Speed >= 40) {
      left = (pice * (Speed - 39) / 59) + piceR * 4;
    }
    return left - 12.5;;
  },
  async getReport(sharedId){
    Toast.showLoading();
    let data = await Protocol.getTodayLosefatReport({sharedId});
    Toast.hiddenLoading();
    let left = this.getlosefatSpeed(data.result.losefatSpeed.dataValueToday) ;
    let foodDesTxt = data.result.losefatGrams.foodDescription;
    let sprotDesTxt = data.result.losefatGrams.sprotDescription;
    let that = this;
    this.setData({
      sprotDescription: that.getDesArr(sprotDesTxt),
      foodDescription: that.getDesArr(foodDesTxt),
      report: data.result,
      subKGrams: data.result.weightChange.subKGrams,
      left: left
    })
    this.setweightChange()
  },
  onShareAppMessage(res){
    console.log(res);
    return {
      title: '我的今日减脂报告已生成，快来围观！',
      path: `/pages/lowFatReport/lowFatReport?type=false&sharedId=${this.data.report.sharedId}`
    }
  },
  shareFr(){
    toast.warn("敬请期待");
    return;
  }
})