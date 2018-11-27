// pages/history/history.js
import Protocol from "../../modules/network/protocol";
import * as tools from "../../utils/tools";
import HiNavigator from "../../navigator/hi-navigator";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      Protocol.getBreathDataList({}).then(data=>{
          console.log(data);
          let list = data.result.list;
          for (let i in list){
            list[i]['date'] = tools.createDateAndTime(list[i]['createdTimestamp']);
            console.log(list[i]['level'])
              /*let showText = ['燃脂不佳','燃脂一般','燃脂最佳','强度过大'];
              list[i]['hintText'] = showText[list[i]['level']-1];*/
              let listShow = {a: ['燃脂不佳','燃脂一般','燃脂最佳','强度过大'], b: ['3e3e3e','ff7c00','ff5e00','e64d3d']};
              list[i]['hintText'] = listShow.a[list[i]['level']-1];
              list[i]['hintBg'] = listShow.b[list[i]['level']-1];
          }
          this.setData({
              list:list
          })

      });


  },
    toResult(e){
      let index = e.currentTarget.dataset.index;
        HiNavigator.navigateToResult({score:this.data.list[index]['dataValue'], situation:this.data.list[index]['situation'], showUnscramble:true});
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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