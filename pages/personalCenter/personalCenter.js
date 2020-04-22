// pages/personalCenter/personalCenter.js
import { Toast } from "heheda-common-view";
import Login from "../../modules/network/login";
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
import { whenDismissGroup } from "../community/social-manager";
Page({

  /**
   * 页面的初始数据
   * 
   * .
   */
  data: {
    isShowlogin: false,
    nickname: '',
    headUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!getApp().globalData.isLogin) {
      this.setData({
        isShowlogin: false,
      })
    } else {
      this.getUserInfo();
    }
  },
  onPersonalCenter: function (e) {
    if (!getApp().globalData.isLogin || !this.data.finishedPhone) {
      HiNavigator.navigateToGuidance({});
      return;
    }
    HiNavigator.navigateToUserInfoPage()
  },
  onTargetWeight: function (e) {
    console.log('个人中心', getApp().globalData.isLogin, this.data.finishedPhone)
    if (!getApp().globalData.isLogin || !this.data.finishedPhone) {
      HiNavigator.navigateToGuidance({});
      return;
    }
    HiNavigator.navigateToRecomTar({ personalCenter: true })
  },
  onDeviceManagement() {
    if (!getApp().globalData.isLogin || !this.data.finishedPhone) {
      HiNavigator.navigateToGuidance({});
      return;
    }
    HiNavigator.navigateToDeviceUnbind()
  },
  toCommonProblem: function () {
    Toast.showLoading();
    HiNavigator.navigateToCommonProblem();
    Toast.hiddenLoading();
  },
  toNoticeList: function () {
    Toast.showLoading();
    HiNavigator.navigateToMyNoticeList();
    Toast.hiddenLoading();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //
  toDatalist(e) {
    const {
      currentTarget: {
        dataset: { type }
      }
    } = e;
    console.log(e);
    switch (type) {
      case "fatBurn":
        HiNavigator.navigateToResultNOnum();
        break;
      case "bodyIndex":
        HiNavigator.navigateTofood();
        break;
      case "paiMoney":
        if (!getApp().globalData.isLogin || !this.data.finishedPhone) {
          HiNavigator.navigateToGuidance({});
          return;
        }
        HiNavigator.navigateToPaiCoinPage();
        break;
      case "dynamic":
        HiNavigator.navigateToMyDynamicList();
        break;
      case "task":
        HiNavigator.navigateToDayReportConclude();
        break;
      case "gift":
        HiNavigator.navigateTocoupon();
        break;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo();

  },
  /**
   * @desc  是不是符合未登录或者未验证手机号
   */
  goVerify() {
    if (!getApp().globalData.isLogin || !this.data.finishedPhone) {
      HiNavigator.navigateToGuidance({});
      return;
    }
  },
  async getUserInfo() {
    const { result } = await Protocol.postMemberInfo();
    if (result.weightGoal) {
      this.setData({
        weightGoal: result.weightGoal
      })
    }
    this.setData({
      isShowlogin: true,
      nickname: result.nickname,
      headUrl: result.headUrl,
      amount: result.amount,
      isHave: result.isHave,
      finishedPhone: result.finishedPhone
    })
    // if (this.data.isHave) {
    //   wx.showTabBarRedDot({
    //     index: 3,//index是让tabbar的第几个图标闪起来(从0开始的)，我现在是让第二个图片的红点闪
    //   })
    // } else {
    //   wx.hideTabBarRedDot({
    //     index: 3,//index是让tabbar的第几个图标闪起来(从0开始的)，我现在是让第二个图片的红点闪
    //   })
    // }
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
