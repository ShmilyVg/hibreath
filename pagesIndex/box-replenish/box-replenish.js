// pagesIndex/box-replenish/box-replenish.js
import { getLatestOneWeekTimestamp } from "../../utils/time";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:{}
  },

  onLoad(options) {
    this.getAdditionalMeal();
  },
  async getAdditionalMeal(){
    let { result} = await Protocol.getAdditionalMeal()
    this.setData({
      result
    })
  },
  onShow: function () {
 
  },

})