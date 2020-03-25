// pagesIndex/adaptive/adaptive.js
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
Page({

  data: {
    result:{}
  },

  onLoad: function (options) {
    this.getBoxHowToEat()
  },

  onShow: function () {

  },
  goToReplenish(){
    HiNavigator.navigateToBoxReplenish();
  },
  async getBoxHowToEat(){
    let { result } = await Protocol.getBoxHowToEat();
    this.setData({
      result
    })
  }
})