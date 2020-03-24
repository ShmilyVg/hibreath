// pagesIndex/burnDay/burnDay.js
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
Page({
  data: {
    trendData:[],
    activeDay:[],
    animation:{},
    status: {
      '即将燃脂': ['#D0E5CC', '#D0E5CC', '#D0E5CC', '#D0E5CC', '#5D6AED'],
      '低速燃脂': ['#D0E5CC', '#D0E5CC', '#D0E5CC', '#009DFF', '#009DFF'],
      '状态极佳': ['#D0E5CC', '#D0E5CC', '#0AC1A1', '#0AC1A1', '#0AC1A1'],
      '快速燃脂': ['#D0E5CC', '#FFAD00', '#FFAD00', '#FFAD00', '#FFAD00'],
      '过度燃脂': ['#FF6100', '#FF6100', '#FF6100', '#FF6100', '#FF6100'],
    },
    listObj:{}
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
  async showDayData(e){
    let day = e.currentTarget.dataset.item;
    let item = await this.getDayData(day);
    let listObj = this.data.listObj;
    listObj[day] = item
    this.setData({
      listObj
    })
    let height = item.length * 180
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
    let { result: { dateTime } } = await Protocol.postBreathDatalist();
    this.setData({
      trendData: dateTime
    })
    return true;
  },
  async getDayData(day){
    let postData = {
      dateTime:day
    }
    let { result: { dataList } } = await Protocol.postBreathDateTimeItem(postData);
    let newDataList =[];
    for (let item of dataList) {
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
      let day = tools.dateFormat(item.time*1000,'YYYY-MM-DD');
      item.day = day;
      item.tip = tools.dateFormat(item.time * 1000, 'YYYYMMDD');
      item.animationName = 'animation.' + tools.dateFormat(item.time * 1000, 'YYYY-MM-DD');
      item.date = tools.dateFormat(item.time * 1000, 'YYYY/MM/DD HH:mm');
      newDataList.push(item);
    }
    return newDataList
  },
  topFadeIn(animationName) {
    console.log('topFadeIn:'+animationName)
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
  },
  topFadeDown(animationName,height) {
    console.log('topFadeDown:' + animationName)
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