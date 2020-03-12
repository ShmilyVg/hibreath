// pagesIndex/burnDay/burnDay.js
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
Page({
  data: {
    trendData:[],
    activeDay:[],
    animation:{},
    status: {
      '即将燃脂': ['#D0E5CC', '#D0E5CC', '#5D6AED'],
      '低速燃脂': ['#D0E5CC', '#009DFF', '#009DFF'],
      '状态极佳': ['#0AC1A1', '#0AC1A1', '#0AC1A1'],
      '过度燃脂': ['#FF6100', '#FF6100', '#FF6100'],
      '快速燃脂': ['#FFAD00', '#FFAD00', '#FFAD00'],
    },
  },
  onLoad: function (options) {
    this.getBreathData();
  },
  onShow: function () {

  },
  onHide: function () {

  },
  async onPullDownRefresh() {
    try{
      await this.getBreathData();
    }catch(error){}
    wx.stopPullDownRefresh();
  },
  showDayData(e){
    let item = e.currentTarget.dataset.item;
    let height = item.length * 160
    var dayItem = item[0].day;
    let activeDay = this.data.activeDay;
    let animation = item[0].animationName
    let index = activeDay.indexOf(dayItem)
    if (index > -1){
      activeDay.splice(index,1)
      this.topFadeIn(animation)
    }else{
      activeDay.push(dayItem)
      this.topFadeDown(animation, height)
      
    }
    this.setData({
      activeDay: activeDay
    })
  },
  async getBreathData() {
    let { result: { list } } = await Protocol.postBreathDatalistAll();
    let trendData = [], dates = [];
    for(let item of list){

      let image = '../../images/result/cell';
      const dValue = item.dataValue;
      if (dValue >= 0 && dValue <= 2) {
        image = image + '1.png';
      } else if (dValue >= 3 && dValue <= 9) {
        image = image + '2.png';
      } else if (dValue >= 10 && dValue <= 19) {
        image = image + '3.png';
      } else if (dValue >= 20 && dValue <= 39) {
        image = image + '4.png';
      } else if (dValue >= 40) {
        image = image + '5.png';
      }
      item.image = image;
      let day = tools.dateFormat(item.createdTimestamp);
      item.day = day;
      item.tip = tools.dateFormat(item.createdTimestamp, 'YYYYMMDD');
      item.animationName = 'animation.'+tools.dateFormat(item.createdTimestamp, 'YYYYMMDD');
      item.date = tools.dateFormat(item.createdTimestamp,'YYYY/MM/DD HH:mm');
      let index = dates.indexOf(day)
      if (index >-1){
        trendData[index].push(item)
      }else{
        dates.push(day);
        trendData.push([item])
      }
    }
    this.setData({
      trendData: trendData
    })
    return true;
  },
  topFadeIn(animationName) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.animation.height(0).step()
    that.setData({
      [animationName]: that.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
    console.log(this.data[animationName])
  },
  topFadeDown(animationName,height) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation

    that.animation.height(height+'rpx').step()
    that.setData({
      [animationName]: that.animation.export(),
    })
  }
})