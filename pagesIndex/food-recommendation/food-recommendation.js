// pagesIndex/food-recommendation/food-recommendation.js
import Protocol from "../../modules/network/protocol";
import {
  Toast as toast
} from "heheda-common-view";
import HiNavigator from "../../navigator/hi-navigator";

Page({
  data: {
    idx: 0,
    num: [1, 1, 1, 1, 1, 1, 1, 1],
    currenttab: 'ingredient',
    typeColor: 'green',
    ingredientType: [{
      img: 'warn',
      bgColor: '#FFF4EC',
      bgColor1: '#FF9D76',
      text1: '红灯',
      text2: '不可以吃',
    }, {
      img: 'yellow',
      bgColor: '#FFFAE8',
      bgColor1: '#F5CE4B',
      text1: '黄灯',
      text2: '可适当选择',
    }, {
      img: 'green',
      bgColor: '#ECF8EB',
      bgColor1: '#93D78E',
      text1: '绿灯',
      text2: '放心吃',
    }],
    colorList: [{
      type: 'green',
      title: '绿灯'
    }, {
      type: 'yellow',
      title: '黄灯'
    }, {
      type: 'warn',
      title: '红灯'
    }],
    rotate3dA: ['rotate3dA0', 'rotate3dA1', 'rotate3dA2', 'rotate3dA3', 'rotate3dA4', 'rotate3dA5'],
    typeList: [{
      type: 'ingredient',
      title: '减脂食材清单'
    }, {
      type: 'recommend',
      title: '推荐减脂餐谱'
    }],
  },
  /*以上防止点击换一换 出现所有图片旋转的情况*/
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {
      result: contentResult
    } = await Protocol.postMenuRecommend()
    this.setData({
      contentResult: contentResult
    })
  },
  selectTab(e) {
    let newtab = e.currentTarget.dataset.tabid;
    if (this.data.currenttab !== newtab) {
      this.setData({
        currenttab: newtab
      });
    }
  },
  selectTabColor(e){
    let newtab = e.currentTarget.dataset.tabid;
    if (this.data.currenttab !== newtab) {
      this.setData({
        typeColor: newtab
      });
    }
  },
  toDetails(e) {
    if (e.currentTarget.dataset.foodid) {
      HiNavigator.navigateToFooddetails({
        foodId: e.currentTarget.dataset.foodid
      })
    }
  },
  toRule() {
    HiNavigator.navigateToFoodRuler()
  },
  async secDate(e) {
    let id = e.currentTarget.dataset.id;
    let time = e.currentTarget.dataset.time
    this.setData({
      idx: id
    })
    this.getMonth(time);
    const {
      result: contentResult
    } = await Protocol.postFoodItemInfo({
      itemId: e.currentTarget.dataset.id
    })
    this.setData({
      contentResult: contentResult
    })
  },
  getMonth(time) {
    var date = new Date(time);
    var month = date.getMonth() + 1;
    switch (month) {
      case 1:
        var str = "January · 1"
        break;
      case 2:
        var str = "February · 2"
        break;
      case 3:
        var str = "March · 3"
        break;
      case 4:
        var str = "April · 4"
        break;
      case 5:
        var str = "May · 5"
        break;
      case 6:
        var str = "June · 6"
        break;
      case 7:
        var str = "July · 7"
        break;
      case 8:
        var str = "August · 8"
        break;
      case 9:
        var str = "September · 9"
        break;
      case 10:
        var str = "October · 10"
        break;
      case 11:
        var str = "November · 11"
        break;
      case 12:
        var str = "December · 12"
        break;
    }
    this.setData({
      monthStr: str
    })
  },
  async foodChange(e) {
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    let index = e.currentTarget.dataset.index
    this.animation.rotate(360 * this.data.num[index]).step();
    this.setData({
      [`num[${index}]`]: this.data.num[index] + 1,
      [`rotate3dA[${index}]`]: this.animation.export()
    })
    const {
      result
    } = await Protocol.postFoodChange({
      id: e.currentTarget.dataset.id
    })
    this.setData({
      [`contentResult.dataList[${index}].list`]: result.data.list,
      [`contentResult.dataList[${index}].total`]: result.data.total,
      [`contentResult.dataList[${index}].id`]: result.data.id,
    })
  },

  onShow: function () {

  },

})