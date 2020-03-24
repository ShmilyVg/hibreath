// pagesIndex/reduceFat/reduceFat.js
import Protocol from "../../modules/network/protocol";
Page({

  data: {
    result:{},
    goalt:false
  },
  onLoad: function (options) {
    this.getMyLossfatCourse();
  },

  onShow: function () {

  },
  async getMyLossfatCourse() {
    let weightGoalt = this.data.weightGoalt
    let data = weightGoalt ? { weightGoalt: Number(weightGoalt) } : {};
    let { result } = await Protocol.getMyLossfatCourse(data);
    if (result.weight <= result.weightGoalt){
      this.setData({
        goalt:true
      })
    }
    this.setData({
      result
    })
  }
})