// pages/food-ruler/food-ruler.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            url: 'https://backend.hipee.cn/html/hipee-hibreath/yuanze/index.html?' + Date.now()
        })
        wx.setNavigationBarTitle({title: '自由日饮食原则'});
        wx.setNavigationBarColor({frontColor:'#ffffff', backgroundColor: '#171717'});
    },


});
