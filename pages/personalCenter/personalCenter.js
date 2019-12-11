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
  onPersonalCenter:function(e){
    if (this.data.isLogin) {
    console.log("个人中心")
    } else {
      console.log('e onPersonalCenter', e);
      const { detail: { userInfo, encryptedData, iv } } = e;
      this.onGetUserInfoEvent(e)
    }
  },
  onTargetWeight:function(e){
    if (this.data.isLogin) {

    } else {
      console.log('e onPersonalCenter', e);
      const { detail: { userInfo, encryptedData, iv } } = e;
      this.onGetUserInfoEvent(e)
    }
  },
  onDeviceManagement:function(e){
    if (this.data.isLogin) {
        HiNavigator.navigateToDeviceUnbind()
    } else {
      console.log('e onPersonalCenter', e);
      const { detail: { userInfo, encryptedData, iv } } = e;
      this.onGetUserInfoEvent(e)
    }
  },
  toCommonProblem:function(){
    HiNavigator.navigateToCommonProblem();
  },
  toNoticeList:function(){
    HiNavigator.navigateToMyNoticeList();
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
      console.log("有userInfo")
    } else {
      console.log("没有userInfo")
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
        }
    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('11', getApp().globalData.isLogin);
    wx.getSetting({
      success: (res) => {
        console.log('圈子打印是否授权', res.authSetting['scope.userInfo']);
        //console.log(!res.authSetting['scope.userInfo'] )
        console.log(getApp().globalData.isLogin);
        if (!getApp().globalData.isLogin) {
          this.setData({
            isLogin: false,
          })
          console.log('isLogin: false',)
        }else{
         this.getUserInfo();
          console.log('isLogin: true')
          // console.log(this.data.isLogin)
          // console.log(111,this.data.nickname, this.data.headUrl)
        }
        console.log(this.data.isLogin)
      }
    });
    console.log(getApp().globalData.isLogin)
  },
  async getUserInfo(){
    const { result } = await Protocol.postMemberInfo();
    console.log(result);
    this.setData({
      isLogin: true,
      nickname: result.nickname,
      headUrl: result.headUrl,
      weightGoal:result.weightGoal,
      amount:result.amount
    })
    console.log(this.data.nickname, this.data.headUrl)
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
