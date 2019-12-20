// pagesIndex/planfinish/planfinish.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import * as Trend from "../../view/trend";
import * as Circular from "../../pages/result/view/circular";
import * as tools from "../../utils/tools";
import {getTimeString} from "../../utils/time";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      trendDate: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
        console.log('options',options.planId)
      if(options.sharedId){
        const {result} = await Protocol.postPlanFinish({sharedId:options.sharedId});
          this.setData({
              ...result,
              result:result,
              weightDif:Math.abs(result.weightDif),
              isShared:false
          })
      }else{
          const {result} = await Protocol.postPlanFinish({planId:options.planId});
          this.setData({
              ...result,
              result:result,
              weightDif:Math.abs(result.weightDif),
              isShared:true
          })
      }
      this.init();
      console.log('1',this.data)
      this.handleTrend(this.data.weightList)
  },
    init() {
        Trend.init(this);
        Trend.initTouchHandler();
    },
    async handleTrend(data) {
      console.log('list1',data)
        if (data && data.length) {
            let dataListX = [], dataListY = [];
            data.sort(function (item1, item2) {
                return item1.time*1000 - item2.time*1000;
            }).forEach((value) => {
                const {month, day} = tools.createDateAndTime(value.time*1000);
                dataListX.push(month + '月' + day + '日');
                dataListY.push(value.dataValue);
            });
            let dataTrend = {
                dataListX, dataListY, dataListY1Name: 'kg', yAxisSplit: 5,showLegend:false
            };
            Trend.setData(dataTrend,650);
        }
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      Trend.init(this);
      Trend.initTouchHandler();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
    handlerGobackClick(){
        HiNavigator.switchToSetInfo()
    },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {
          title: '我已完成'+this.data.title+'，快来围观!',
          path: '/pagesIndex/planfinish/planfinish?sharedId=' + this.data.sharedId
      }

  }
})
