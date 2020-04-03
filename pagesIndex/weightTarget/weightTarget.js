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
    weightGoalt:null,
    result:{},
    showModalStatus:false
  },
  onLoad: function (options) {
    this.initMyLossfatCourse();
  },
  onShow: function () {

  },
  async onShareAppMessage() {
    let weightGoalt = this.data.weightGoalt;
    let data = weightGoalt ? { weightGoalt: Number(weightGoalt) } : {};
    await Protocol.postMembersJoinSchema(data)
    return {
      title: '我正在低碳燃脂，快来一起加入！',
      path: `/pagesIndex/weightTarget/weightTarget?sharedId=${this.data.sharedId}`,
      imageUrl: this.data.shareImg
    };
  },
  async initMyLossfatCourse(){
    let weightGoalt = this.data.weightGoalt
    let data = weightGoalt ? { weightGoalt: Number(weightGoalt) } : {};
    let { result } = await Protocol.initMyLossfatCourse(data);
    this.setData({
      result
    })
  },
  async startPlan(){
    let weightGoalt = this.data.weightGoalt;
    let data = weightGoalt ? { weightGoalt: Number(weightGoalt) } : {};
    let { result} = await Protocol.postMembersJoinSchema(data)
    HiNavigator.navigateToManifesto(result.sharedId)
  },
  goReduceFat(){
    HiNavigator.navigateToReduceFat();
  },
  goReduceFatExp(){
    HiNavigator.navigateToReduceFatExp();
  },
  weightGoalChange(e) {
    let targetDate = this.data.result
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
    this.initMyLossfatCourse();
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
  handlerGobackClick() {
    HiNavigator.switchToSetInfo();
  },
  //展开分享
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(500).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    });
    setTimeout(
      function () {
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export()
        });
      }.bind(this),
      200
    );
  },
  hideModal: function () {
    this.setData({
      showModalStatus: false
    });
  },
})