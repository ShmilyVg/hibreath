// pages/goVerification/goVerification.js
import {Toast} from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
import { judgeGroupEmpty, whenDismissGroup } from "../community/social-manager";
import HiNavigator from "../../navigator/hi-navigator";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btntext:'获取验证码',
    disabledBtn:true,
    showMytoast:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * @desc 输入验证码
   */
  bindInputCode(e){
    this.setData({
      code:e.detail.value
    })
    this.disBtn()
  },
  /**
   * @desc 输入手机号
   */
  bindInputPhone(e){
    this.setData({
      phoneNumbers:e.detail.value
    })
    this.disBtn()
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
   * @desc 手机号聚焦
   */
  phoneNumbersFocus(){
    this.setData({
      phoneNumbersFocus:true
    })
  },
  /**
   * @desc 手机号失焦
   */
  phoneNumbersBlur(){
    this.setData({
      phoneNumbersFocus:false
    })
  },
  /**
   * @desc 验证码聚焦
   */
  codeFocus(){
    this.setData({
      codeFocus:true
    })
  },
  /**
   * @desc 验证码去焦
   */
  codeBlur(){
    this.setData({
      codeFocus:false
    })
  },
  /**
   * @desc 非空校验
   */
  disBtn(){
    if(this.data.phoneNumbers&&this.data.code){
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
   * @desc 获取手机验证码
   */
  async getCode(){
    if(!this.data.phoneNumbers || !/^1\d{10}$/.test(this.data.phoneNumbers)){
      wx.showToast({
        title: '请输入正确的手机号',
        duration: 1000,
        image: '../../images/loading_fail.png'
      })
      return
    }
    Toast.showLoading();
    await whenDismissGroup(Protocol.getSmsCode({phoneNumbers:this.data.phoneNumbers}))
    Toast.hiddenLoading()
    wx.showToast({
      title: '已发送,请查收',
      icon: 'success',
      duration: 2000,
    })
    Toast.hiddenLoading()
    var _this = this
      var coden = 60
      _this.setData({
        captchaDisabled:true
      })
      var codeV = setInterval(function () {
        _this.setData({
          btntext: (--coden) + 's'
        })
        if (coden == -1) {
          clearInterval(codeV)
          _this.setData({
            btntext: '获取验证码',
            captchaDisabled:false
          })
        }
      }, 1000)
  },
  /**
   * @desc 提交信息
   */
  async submitMsg(){
    Toast.showLoading('登录中')
    const {result} = await whenDismissGroup(Protocol.postPhone({phoneNumbers:this.data.phoneNumbers,code:this.data.code}))
    Toast.hiddenLoading()
    if(result.inTaskProgress){
      this.setData({
        showMytoast:true,
        ...result
      })
      setTimeout(()=>{
        this.setData({
          showMytoast:false,
        })
        Toast.hiddenLoading()
        // HiNavigator.reLaunchToGroupNumber()
        HiNavigator.navigateToGuidance({reset:2})
      },2000)
    }else{
      // HiNavigator.reLaunchToGroupNumber()
      HiNavigator.navigateToGuidance({ reset: false })
    }

   /* wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 2000,
    })*/

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
