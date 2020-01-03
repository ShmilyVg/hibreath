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
    weightToday:'',
  },

  onLoad: function (options) {
    let now = new Date();
    this.setData({
      'curDate': now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()
    })
    this.getReport();
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
    let len = txt.length/2-2;
    let part1 = txt.slice(0,len);
    let part2 = txt.slice(len);
    return [part1, part2]
  },
  getlosefatSpeed(Speed){
    let left , pice = 116;
    if (Speed <= 2){
      left = (pice * Speed/2) ;
    } else if (Speed <= 9 && Speed >= 3){
      left = (pice * (Speed-2) / 6) + pice;
    } else if (Speed <= 19 && Speed >= 10) {
      left = (pice * (Speed - 9) / 9) + pice*2;
    } else if (Speed <= 39 && Speed >= 20) {
      left = (pice * (Speed - 19) / 19) + pice * 3;
    } else if (Speed <= 99 && Speed >= 40) {
      left = (pice * (Speed - 39) / 59) + pice * 4;
    }
    return left - 12.5;;
  },
  async getReport(){
    Toast.showLoading();
    let data = await Protocol.getTodayLosefatReport();
    Toast.hiddenLoading();
    let left = this.getlosefatSpeed(data.result.losefatSpeed.dataValueToday) ;
    let foodDesTxt = data.result.losefatGrams.foodDescription;
    let sprotDesTxt = data.result.losefatGrams.sprotDescription;
    let that = this;
    this.setData({
      sprotDescription: that.getDesArr(sprotDesTxt),
      foodDescription: that.getDesArr(foodDesTxt),
      report: data.result,
      weightToday: data.result.weightChange.weightToday,
      left: left
    })
    this.setweightChange()
  },
  onShareAppMessage(res){
    console.log(res);
  },
  shareFr(){
    toast.warn("敬请期待");
    return;
  }
})