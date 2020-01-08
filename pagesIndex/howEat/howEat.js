// pagesIndex/howEat/howEat.js
import HiNavigator from "../../navigator/hi-navigator";
import {WXDialog} from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
var mta= require('../../utils//mta_analysis.js')
import {showActionSheet} from "../../view/view";
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {result} = await Protocol.getHowtoEat();
    this.setData({
      result:result.data
    })
  },
  /**
   * @desc 页面跳转
   */
  toNextpage(e){
    console.log('e',e.currentTarget.dataset.type)
    const  tapIndex  = e.currentTarget.dataset.type;
    const  foodId  = e.currentTarget.dataset.foodid;
    switch (tapIndex) {
      case 'threeBox':
        HiNavigator.navigateToSlimpleBox({type:tapIndex,foodId:foodId});
        break;
      case 'twoBox':
        HiNavigator.navigateToSlimpleBox({type:tapIndex,foodId:foodId});
        break;
      case 'takeOut':
        HiNavigator.navigateToTakeOut();
        break;
      case 'diy':
        HiNavigator.navigateToFoodRuler();
        break;
      case 'menu':
        HiNavigator.navigateTorecommendation();
        break;
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
 /**
 * @desc 去检测
  */
  goIndex(){
   mta.Event.stat('ranzhijiance',{'clickfatburningtest':'true'})
   wx.getSystemInfo({
     success (res) {
       if(res.locationEnabled && res.bluetoothEnabled && res.locationAuthorized){
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
       }else if(!res.locationAuthorized){
         setTimeout(() => {
           wx.showModal({
             title: '小贴士',
             content: '前往手机【设置】->找到【微信】应用\n' +
               '\n' +
               '打开【微信定位/位置权限】',
             showCancel: false,
             confirmText: '我知道了',
           })
         },200);
         return
       }
     }
   })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
