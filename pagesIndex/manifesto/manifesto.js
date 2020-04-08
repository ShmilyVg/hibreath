// pagesIndex/manifesto/manifesto.js
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
const ImageSource = require('../../utils/ImageSource.js');
const ImageLoader = require('../../utils/ImageLoader.js')
Page({

  data: {
    manifesto: '',
    textList: ['穿上好看的\n小裙子',
      '不让别人\n叫我胖妞',
      '变瘦变漂亮',
      '成为可以和\n我家蒸煮\n比肩的女人!',
      '不瘦下来\n怎么找男朋友!',
      '拥有更\n健康的状态'],
    sharedId:'',
    disabled:true,
    curText:'',
    needImgList: ['/icon/qipao.png']
  },
  onLoad: function (options) {
    var loader = new ImageLoader({
      base: ImageSource.BASE,
      source: this.data.needImgList,
      loaded: res => {}
    });
    this.setData({
      sharedId: options.sharedId
    })
  },

  onShow: function () {
    wx.setStorageSync('flag', true)
  },
  setManifesto(e) {
    let item = e.currentTarget.dataset['item']
    let str = item.replace(/\n/img, '');
    this.setData({
      curText:item,
      disabled:false,
      manifesto: str
    })
  },
  changeValue(e){
    let manifesto = e.detail.value;
    
    let disabled = true;
    if (manifesto.trim()){
      disabled = false;
    }
    this.setData({
      disabled,
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