// pages/personalCenter/personalCenter.js
import { Toast } from "heheda-common-view";
import Login from "../../modules/network/login";
import HiNavigator from "../../navigator/hi-navigator";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:'',
    nickname:'',
    headUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      isLogin: this.data.isLogin
    })
    console.log(this.data.isLogin)
  },
  onPersonalCenter:function(){
    if (this.data.isLogin) {

    } else {
      console.log(app)
      app.doLogin();
      console.log(888)
    }
  },
  onTargetWeight:function(){
    if (this.data.isLogin) {

    } else {
      console.log(app)
      app.doLogin();
      console.log(888)
    }
  },
  onDeviceManagement:function(){
    if (this.data.isLogin) {

    } else {
      console.log(app)
      app.doLogin();
      console.log(888)
    }
  },
  toCommonProblem:function(){
    HiNavigator.navigateToCommonProblem();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },
  async onGetUserInfoEvent(e) {
    console.log('e', e)
    const { detail: { userInfo, encryptedData, iv } } = e;
    console.log("userInfo", userInfo)
    console.log("encryptedData", encryptedData)
    console.log("iv", iv)
    console.log(!!userInfo)
    if (!!userInfo) {
      Toast.showLoading();
      try {
        await Login.doRegister({ userInfo, encryptedData, iv });
        Toast.hiddenLoading();
        this.setData({
          isLogin: true,
          nickname: userInfo.nickName,
          headUrl: userInfo.avatarUrl
        })
        console.log(this.data.nickname, this.data.headUrl)
      } catch (e) {
        Toast.warn('获取信息失败');
        console.log('获取信息失败')
      }
      console.log("有userInfo")
    } else {
      console.log("没有userInfo")
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('11', getApp().globalData.isLogin)
    wx.getSetting({
      success: (res) => {
        console.log('圈子打印是否授权', res.authSetting['scope.userInfo']);
        //console.log(!res.authSetting['scope.userInfo'] )
        console.log(getApp().globalData.isLogin)
        if (!getApp().globalData.isLogin) {
          this.setData({
            isLogin: false,
          })
          console.log('isLogin: false',)
        }else{
          const userInfo = (wx.getStorageSync('userInfo') || "");
          this.setData({
            isLogin: true,
            nickname: userInfo.nickname,
            headUrl: userInfo.headUrl
          })
          // console.log('isLogin: true') 
          // console.log(this.data.isLogin) 
          // console.log(111,this.data.nickname, this.data.headUrl)
        }
        console.log(this.data.isLogin)
      }
    });
    console.log(getApp().globalData.isLogin)
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