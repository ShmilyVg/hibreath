// pages/personalCenter/personalCenter.js
import { Toast } from "heheda-common-view";
import Login from "../../modules/network/login";
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowlogin:'',
    nickname:'',
    headUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      setTimeout(() => {
          wx.setNavigationBarColor({
              frontColor: "#171717",
              backgroundColor: "#F5F5F5"
          });
      });
      if (!getApp().globalData.isLogin) {
          this.setData({
              isShowlogin: false,
          })
          console.log('暂未登陆',)
      }else{
          this.getUserInfo();
          //getApp().globalData.isLogin=true
          console.log('已经登录')
      }
  },
  onPersonalCenter:function(e){
      Toast.showLoading();
    if (this.data.isShowlogin) {
        HiNavigator.navigateToUserInfoPage()
    } else {
      console.log('e onPersonalCenter', e);
      const { detail: { userInfo, encryptedData, iv } } = e;
      this.onGetUserInfoEvent(e)
    }
      Toast.hiddenLoading();
  },
  onTargetWeight:function(e){
      Toast.showLoading();
    if (this.data.isShowlogin) {
        HiNavigator.navigateToTargetWeight({targetWeight:this.data.weightGoal})
    } else {
      console.log('e onPersonalCenter', e);
      const { detail: { userInfo, encryptedData, iv } } = e;
      this.onGetUserInfoEvent(e)
    }
      Toast.hiddenLoading();
  },
  onDeviceManagement:function(e){
      Toast.showLoading();
    if (this.data.isShowlogin) {
        HiNavigator.navigateToDeviceUnbind()
    } else {
      console.log('e onPersonalCenter', e);
      const { detail: { userInfo, encryptedData, iv } } = e;
      this.onGetUserInfoEvent(e)
    }
      Toast.hiddenLoading();
  },
  toCommonProblem:function(){
      Toast.showLoading();
    HiNavigator.navigateToCommonProblem();
      Toast.hiddenLoading();
},
  toNoticeList:function(){
    Toast.showLoading();
    HiNavigator.navigateToMyNoticeList();
    Toast.hiddenLoading();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  async onGetUserInfoEvent(e) {
    const { detail: { userInfo, encryptedData, iv } } = e;
    if (!!userInfo) {
      Toast.showLoading();
      try {
        await Login.doRegister({ userInfo, encryptedData, iv });
        Toast.hiddenLoading();
        this.getUserInfo();
        console.log(this.data.nickname, this.data.headUrl)
      } catch (e) {
        Toast.warn('获取信息失败');
        console.log('获取信息失败')
      }
    } else {
    }
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
                HiNavigator.navigateToPaiCoinPage();
                break;
            case "dynamic":
                HiNavigator.navigateToMyDynamicList();
                break;
        }
    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.getUserInfo();

  },
  async getUserInfo(){
    const { result } = await Protocol.postMemberInfo();
    console.log(result);
    if(result.weightGoal){
        this.setData({
            weightGoal:result.weightGoal
        })
    }
    this.setData({
      isShowlogin: true,
      nickname: result.nickname,
      headUrl: result.headUrl,
      amount:result.amount,
      isHave:result.isHave,
    })
      if(this.data.isHave){
          wx.showTabBarRedDot({
              index: 2,//index是让tabbar的第几个图标闪起来(从0开始的)，我现在是让第二个图片的红点闪
          })
      }else{
          wx.hideTabBarRedDot({
              index: 2,//index是让tabbar的第几个图标闪起来(从0开始的)，我现在是让第二个图片的红点闪
          })
      }
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
