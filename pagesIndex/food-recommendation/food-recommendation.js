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
    foodColor: 'green',
    activeMater: '',
    ingredientType: [{
      img: 'red',
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
      title: '绿灯',
    }, {
      type: 'yellow',
      title: '黄灯'
    }, {
      type: 'red',
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
  onLoad(options) {
    this.getMenuRecommend();
    this.getFoodMaterialsList()
  },
  onShow: function() {

  },
  async getMenuRecommend() {
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
  toDetails(e) {
    console.log(e.currentTarget.dataset.foodid)
    if (e.currentTarget.dataset.foodid) {
      HiNavigator.navigateToFooddetails({
        foodId: e.currentTarget.dataset.foodid
      })
    }
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
    let id= e.currentTarget.dataset.id;
    let data ={
      tags: [id]
    }
    console.log(data)
    const {
      result
    } = await Protocol.postFoodChange(data);
    this.setData({
      [`contentResult[${index}].foodList`]: result.foodList,
      [`contentResult[${index}].totalCalorie`]: result.totalCalorie,
    })
  },
  //减脂食材清单列表（种类）
  async getFoodMaterialsList() {
    const {
      result
    } = await Protocol.getFoodMaterialsList();
    let foodType = result.foodType[0].k;
    let foodColor = result.foodType[0].k;
    this.setData({
      foodType,
      foodColor:'green',
      materialsList: result
    })
    this.searchFood();
  },
  getFoodType(e){
    let foodType = e.currentTarget.dataset.item;
    this.setData({
      foodType
    })
    this.searchFood();
  },
  getFoodColor(e) {
    let foodColor = e.currentTarget.dataset.item;
    this.setData({
      foodColor
    })
    this.searchFood();
  },
  //减脂食材清单（详情）
  async searchFood() {
    let foodType = this.data.foodType;
    let foodColor = this.data.foodColor;
    let data = {
      tags: [foodType, foodColor]
    }
    const {
      result
    } = await Protocol.searchFood(data)
    this.setData({
      foodList: result
    })
  }

})