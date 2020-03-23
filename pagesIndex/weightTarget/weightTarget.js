// pagesIndex/weightTarget/weightTarget.js
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideModal: true,
    animationData:'',
    weightGoalt:null
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  async startPlan(){
    let weightGoalt = this.data.weightGoalt
    let data = weightGoalt ? { weightGoalt: Number(weightGoalt) } : {};
    await Protocol.getMyLossfatCourse(data);
    HiNavigator.navigateToManifesto()
  },
  goReduceFat(){
    HiNavigator.navigateToReduceFat();
  },
  goReduceFatExp(){
    HiNavigator.navigateToReduceFatExp();
  },
  weightGoalChange(e) {
    let targetDate = this.data.targetDate
    let nowW = targetDate.weightLoss + targetDate.weightGoalt;
    let weightGoalt = e.detail.value;
    if (nowW <= weightGoalt) {
      toast.warn('目标体重过大')
    }
    let str = (weightGoalt + '').split('.')[1];

    if (str && str.length > 1) {
      toast.warn('只能一位小数')
      weightGoalt = Number(weightGoalt).toFixed(1);
    }
    this.setData({
      weightGoalt: weightGoalt
    })
  },
  saveWeight() {
    this.getMyLoss();
    this.hideModal();
  },
  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      weightGoalt: '',
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
})