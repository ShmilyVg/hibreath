// pages/groupNumber/groupNumber.js
import { Toast as toast, Toast, WXDialog } from "heheda-common-view";
import {whenDismissGroup} from "../community/social-manager";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabledBtn:true,
    isShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const { result } = await Protocol.postMemberInfo();
    if(result.finishedPhone){
      this.setData({
        isShow:false
      })
    }else{
      this.setData({
        isShow:true
      })
    }
  },
  /**
   * @desc 输入群号
   */
  bindInputNumber(e){
    this.setData({
      sharedId:e.detail.value
    })
    this.disBtn()
  },

  /**
   * @desc 群号聚焦
   */
    sharedIdFocus(){
      this.setData({
        sharedIdFocus:true
      })
    },
    /**
     * @desc 群号失焦
     */
    sharedIdBlur(){
      this.setData({
        sharedIdFocus:false
      })
    },
  /**
   * @desc 非空校验
   */
  disBtn(){
    if(this.data.sharedId){
      this.setData({
        disabledBtn:false
      })
    }else{
      this.setData({
        disabledBtn:true
      })
    }
  },
  /**
   * @desc 确认群号
   */
  async submitMsg(){
    Toast.showLoading()
    const {result} = await whenDismissGroup(Protocol.postJoinGroup({groupNumber:this.data.sharedId}))
    Toast.hiddenLoading()
    if(result&&result.inTaskProgress){
      this.setData({
        showMytoast:true,
        ...result
      })
      setTimeout(()=>{
        this.setData({
          showMytoast:false,
        })
        Toast.hiddenLoading()
      },2000)
    }
    if(getApp().globalData.isGroupjoin){
      getApp().globalData.isGroupjoin =false
      HiNavigator.switchToCommunity()
    }else{
      HiNavigator.navigateToGuidance({ reset: false })
    }
  },
  goGuidance(){
    HiNavigator.navigateToGuidance({ reset: false })
  },
  showNumber(){
    setTimeout(() => {
      wx.showToast({
        title: '购买代餐即可进入减脂群哦',
        icon: 'none',
        duration: 2000
      });
    });
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if(getApp().globalData.isGroupjoin){
      getApp().globalData.isGroupjoin =false
      HiNavigator.switchToCommunity()
    }else{
      HiNavigator.switchToSetInfo()
    }
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
