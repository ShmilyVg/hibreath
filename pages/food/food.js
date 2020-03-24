// pages/food/food.js
import * as Trend from "../../view/trend";
import Protocol from "../../modules/network/protocol";
import * as Tools from "../../utils/tools";
import { getEndZeroTimestamp, getFrontZeroTimestamp, getLatestOneWeekTimestamp, getTimeString } from "../../utils/time";
import HiNavigator from "../../navigator/hi-navigator";
import {Toast as toast, Toast, WXDialog} from "heheda-common-view";
import { dealInputEvent } from "./manager";
import { previewImage, showActionSheet } from "../../view/view";
const ImageSource = require('../../utils/ImageSource.js');
const ImageLoader = require('../../utils/ImageLoader.js')
const timeObj = {
  _frontTimestamp: 0,
  _endTimestamp: 0,
  set frontTimestamp(timestamp) {
    this._frontTimestamp = getFrontZeroTimestamp({ timestamp });
  },
  get frontTimestamp() {
    return this._frontTimestamp;
  },
  set endTimestamp(timestamp) {
    this._endTimestamp = getEndZeroTimestamp({ timestamp });
  },
  get endTimestamp() {
    return this._endTimestamp;
  }
};
Page({

  data: {
    topChose: [
      {
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
      {
        type: 'bloodPressure',
        maxLength: 3,
        inputType: 'number',
        text: '血压', addText: '记血压', addProjectList: [
          {
            id: 'high',
            title: '高压(mmHg)',
            placeholder: '请输入您的高压',
            type: 'high'
          },
          {
            id: 'low',
            title: '低压(mmHg)',
            placeholder: '请输入您的低压',
            type: 'low'
          }]
      },
      {
        type: 'heart',
        maxLength: 3,
        inputType: 'number',
        text: '心率', addText: '记心率', addProjectList: [
          {
            id: 'heart',
            title: '心率(BPM)',
            placeholder: '请输入您的心率',
            type: 'heart'
          }
        ]
      }
    ],
    currentIndex: 0,
    dataList: [],
    dataTrend: [],
    canvasShow: true,
    dataTrendTime: '',
    showTaskFinish:true,
    needImgList:['fatWindows/flash1.png','fatWindows/flash2.png'],
    weightFinish:false,
    fatFinish:false,
    showCanvas:"block",
    hideModal: true,
  },

  onLoad(e) {
    Trend.init(this);
    this.setData({
      weightFinish:JSON.parse(e.weightFinish),
      fatFinish:JSON.parse(e.fatFinish)
    })

  },
  async onReady() {
    Trend.initTouchHandler();
    let {result} = await Protocol.postWeightDataListAll();
    console.log('result',result)
    this.updateTrendTime({ frontTimestamp: result.startTime*1000, endTimestamp: result.endTime*1000 });
  },

  onShow() {
    const { trendTime } = getApp().globalData;
    if (trendTime) {
      const { startTimeValue: frontTimestamp, endTimeValue: endTimestamp } = trendTime;
      this.updateTrendTime({ frontTimestamp, endTimestamp });
    }
    this.getTaskInfo()
  },
  toCalendarPage() {
    HiNavigator.navigateToCalendar({ type: this.data.topChose[this.data.currentIndex].type });
  },
  //完善分析报告弹窗
  toIndex(){
    wx.showModal({
      title: '完善分析报告',
      content: '需要您使用燃脂精灵\n' +
        '了解当前具体的燃脂情况',
      confirmText:'前往',
      confirmColor:'#4FBB49',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          HiNavigator.navigateIndex();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //查看分析报告
  toReport(){

  },
  updateTrendTime({ frontTimestamp, endTimestamp }) {
    // const {timeObj} = this.data;
      console.log('frontTimestamp',frontTimestamp,endTimestamp)
    timeObj.frontTimestamp = frontTimestamp;
    timeObj.endTimestamp = endTimestamp;
    this.setData({
      dataTrendTime: getTimeString({
        frontTimestamp: timeObj.frontTimestamp,
        endTimestamp: timeObj.endTimestamp
      })
    }, async () => {
      await this.handleListData({ isRefresh: true });
    });
     /* timeObj.frontTimestamp = 0;
      timeObj.endTimestamp = Date.now();*/
  },
  //关闭弹窗
  closeWindow(e){
    console.log('rrrr',e)
    this.setData({
      showWindows:e.detail.showWindows,
      showCanvas:"block"
    })
  },
  //获取任务信息
  async getTaskInfo() {
    const { result } = await Protocol.getTaskInfo();
    this.setData({
      taskInfo: result
    })
    var that = this;
    if(that.data.taskInfo.modalList.length>0){
      this.setData({
        showCanvas:"none"
      })
      for(var i=0;i<that.data.taskInfo.modalList.length;i++){
        if(that.data.taskInfo.modalList[i].modalType == 'goalFinish'){
          let Num = Number(that.data.taskInfo.modalList[i].ext.fatLevel)+1
          let imageListfinUrl = "fatWindows/fin-type"+Num+'.png'
          that.data.needImgList.push(imageListfinUrl)
        }
      }
      that.data.needImgList =[...new Set([... that.data.needImgList])]
      console.log('needImgList',that.data.needImgList)
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
    }else{
      this.setData({
        showMytoast:true,
        toastType:'weight',
        showCanvas:"block"
      })
      setTimeout(()=>{
        this.setData({
          showMytoast:false,
        })
      },1000)
    }

  },
  async handleListData({ isRefresh = false } = {}) {
    const { currentIndex, topChose } = this.data,
      list = [];
    switch (currentIndex) {
      case 0: {
          if(getApp().globalData.trendTime){
              const { frontTimestamp: timeBegin, endTimestamp: timeEnd } = timeObj
              let { result: { list: bloodPressureDataList} } = await Protocol.postWeightDataListAll({
                  timeBegin,
                  timeEnd
              });
              list.push(...bloodPressureDataList);
              getApp().globalData.trendTime = null;
          }else{
              let { result: { list: bloodPressureDataList,startTime:startTime,endTime:endTime} } = await Protocol.postWeightDataListAll();
              list.push(...bloodPressureDataList);
              this.setData({
                  dataTrendTime: getTimeString({
                      frontTimestamp: startTime*1000,
                      endTimestamp: endTime*1000
                  })
              })
          }
      }
        break;
      case 1: {
          if(getApp().globalData.trendTime){
              const { frontTimestamp: timeBegin, endTimestamp: timeEnd } = timeObj
              let { result: { list: bloodPressureDataList } } = await Protocol.postBloodPressureDataListAll({
                  timeBegin,
                  timeEnd
              });
              list.push(...bloodPressureDataList);
              getApp().globalData.trendTime = null;
          }else{
              let { result: { list: bloodPressureDataList,startTime:startTime,endTime:endTime } } = await Protocol.postBloodPressureDataListAll();
              list.push(...bloodPressureDataList);
              this.setData({
                  dataTrendTime: getTimeString({
                      frontTimestamp: startTime*1000,
                      endTimestamp: endTime*1000
                  })
              })
          }
      }
        break;
      case 2: {
          if(getApp().globalData.trendTime){
              const { frontTimestamp: timeBegin, endTimestamp: timeEnd } = timeObj
              let { result: { list: bloodPressureDataList } } = await Protocol.postHeartDataListAll({
                  timeBegin,
                  timeEnd
              });
              list.push(...bloodPressureDataList);
              getApp().globalData.trendTime = null;
          }else{
              let { result: { list: bloodPressureDataList,startTime:startTime,endTime:endTime } } = await Protocol.postHeartDataListAll();
              list.push(...bloodPressureDataList);
              this.setData({
                  dataTrendTime: getTimeString({
                      frontTimestamp: startTime*1000,
                      endTimestamp: endTime*1000
                  })
              })
          }
      }
        break;
      default:
        break;
    }

    if (isRefresh) {
      this.data.dataList = [];
    }

    const isBloodPressure = topChose[currentIndex].type === 'bloodPressure';
    list.forEach((value) => {
      const { time, dateX } = Tools.createDateAndTime(value.time * 1000);
      value.date = { time, date: dateX };
      if (isBloodPressure) {
        value.isBloodPressure = true;
        value.dataValue = value.height + '/' + value.low;
      }
    });
    this.setData({ dataList: list }, () => {
      this.handleTrendData();
    });
    if (!this.data.dataList.length){
      this.setData({
        dataListTip:true
      })
    }else{
      this.setData({
        dataListTip: false
      })
    }
  },
  async handleTrendData() {
    let dataListX = [], dataListY = [], dataListY2 = [], dataListY1Name = '', dataListY2Name = '';
    this.data.dataList.sort(function (item1, item2) {
      return item1.createdTimestamp - item2.createdTimestamp;
    }).forEach((value) => {
      const { month, day } = Tools.createDateAndTime(value.createdTimestamp);
      dataListX.push(month + '月' + day + '日');
      if (value.isBloodPressure) {
        dataListY.push(value.height);
        dataListY2.push(value.low);
      } else {
        dataListY.push(value.dataValue);
      }
    });
    if (!dataListX.length) {
      dataListX.push(0);
      dataListY.push(0);
    }
    if (dataListY2.length) {
      dataListY1Name = '高压';
      dataListY2Name = '低压';
    } else {
      const { currentIndex, topChose } = this.data;
      dataListY1Name = topChose[currentIndex].text;
    }
    Trend.setData({ dataListX, dataListY, dataListY1Name, dataListY2, dataListY2Name, yAxisSplit: 5 }, 650);
  },

  bindTapTopChose(e) {
    const { currentTarget: { dataset: { index: currentIndex } } } = e;
    if (currentIndex !== this.data.currentIndex) {
      this.setData({ currentIndex }, () => {
        this.handleListData({ isRefresh: true });
      });
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
    console.log('weight',this.data.weight)
  },
  objIsEmpty(obj) {
    return typeof obj === "undefined" || obj === "" || obj === null;
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
    await Protocol.postWeightDataAdd({weight:this.data.weight});
    this.hideModal();
    await this.handleListData({ isRefresh: true });
    this.getTaskInfo()
  },

  choseItem() {
    return this.data.currentIndex;
  },
  async deleteDataValue(e) {
    try {
      const { tapIndex } = await showActionSheet({ itemList: ['删除记录'], itemColor: "#ED6F69" });
      switch (tapIndex) {
        case 0:
          WXDialog.showDialog({
            content: '确定要删除记录',
            showCancel: true,
            confirmText: "确定",
            cancelText: "取消",
            confirmEvent: () => {

              if (this.data.currentIndex == 0) {
                // console.log('体重')
                console.log(e)
                console.log(e.currentTarget.dataset.index)
                this.data.id = e.currentTarget.dataset.index;
                const { frontTimestamp: timeBegin, endTimestamp: timeEnd } = timeObj;
                Protocol.postDeleteWeightData({ id: this.data.id }).then(()=>{
                  this.handleListData({ isRefresh: true });
                })

              } else if (this.data.currentIndex == 1) {
                this.data.id = e.currentTarget.dataset.index;
                const { frontTimestamp: timeBegin, endTimestamp: timeEnd } = timeObj;
                Protocol.postDeleteBloodPressureData({ id: this.data.id }).then(() => {
                  this.handleListData({ isRefresh: true });
                })
              } else {
                this.data.id = e.currentTarget.dataset.index;
                const { frontTimestamp: timeBegin, endTimestamp: timeEnd } = timeObj;
                Protocol.postDeleteHeartData({ id: this.data.id }).then(() => {
                  this.handleListData({ isRefresh: true });
                })
              }
            },
            cancelEvent: () => {

            }
          });
          break;
      }
    } catch (e) {
      console.warn(e);
    }
  },
  onShareAppMessage: function () {
    return {
      title: '邀请你加入[',
      path: '/pages/shareAddcommunity/shareAddcommunity?sharedId=' + this.data.sharedId,
      imageUrl:'https://backend'
    };
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
      wx.showTabBar()
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
