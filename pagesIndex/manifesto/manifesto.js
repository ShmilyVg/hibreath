// pagesIndex/manifesto/manifesto.js
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
const ImageSource = require('../../utils/ImageSource.js');
const ImageLoader = require('../../utils/ImageLoader.js')
Page({

  data: {
    textList: [{ text: '穿上好看的\n小裙子', value:'穿上好看的小裙子'},
      { text: '不让别人\n叫我胖妞', value: '不让别人叫我胖妞'},
      { text: '变瘦变漂亮', value: '变瘦变漂亮'},
      { text: '成为可以和\n我家蒸煮\n比肩的女人!', value: '成为可以和我家蒸煮比肩的女人!'},
      { text: '不瘦下来\n怎么找男朋友!', value: '不瘦下来怎么找男朋友!'},
      { text: '拥有更\n健康的状态', value: '拥有更健康的状态'}],
    sharedId:'',
    needImgList: ['/icon/qipao.png']
  },
  onLoad: function (options) {
    var loader = new ImageLoader({
      base: ImageSource.BASE,
      source: this.data.needImgList,
      loaded: res => {}
    });
    this.setData({
      manifesto: options.flag,
      sharedId: options.sharedId
    })
  },

  onShow: function () {
    wx.setStorageSync('flag', true);
    if (!wx.getStorageSync('original_tip')){
      wx.setStorageSync('original_tip', 'first')
    }
    
  },
  
  setManifesto(e) {
    let item = e.currentTarget.dataset['item']
    let str = item.value;
    this.setData({
      manifesto: str
    })
  },
  changeValue(e){
    let manifesto = e.detail.value;
    this.setData({
      manifesto: manifesto
    })
  },
  async reduceFun(){
    HiNavigator.switchToSetInfo();
  },
  async warnMySelf() {
    // await
    let goalDesc = this.data.manifesto;
    let data = {
      goalDesc
    }
    await Protocol.putGoalDesc(data);
    this.reduceFun()
  },
  handlerGobackClick(){
    this.reduceFun()
  }
})