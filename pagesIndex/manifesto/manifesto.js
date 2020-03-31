// pagesIndex/manifesto/manifesto.js
import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";
Page({

  data: {
    manifesto: '',
    textList: ['穿上好看的\n小裙子',
      '不让别人\n叫我胖妞',
      '变瘦变漂亮',
      '成为可以和\n我家蒸煮\n比肩的女人!',
      '不瘦下来\n怎么找男朋友!',
      '拥有更\n健康的状态'],
    manifesto:'',
    sharedId:'',
    disabled:true
  },
  onLoad: function (options) {
    this.setData({
      sharedId: options.sharedId
    })
  },

  onShow: function () {

  },
  setManifesto(e) {
    let item = e.currentTarget.dataset['item']
    let str = item.replace(/\n/img, '');
    this.setData({
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
    wx.setStorageSync('finishedGuide', true);
    HiNavigator.switchToSetInfo();
  },
  async onShareAppMessage() {
    // await
    let goalDesc = this.data.manifesto;
    let data = {
      goalDesc
    }
    await Protocol.putGoalDesc(data);
    return {
      title: '我正在低碳燃脂，快来一起加入！',
      path: `/pages/sharedGuidance/sharedGuidance?sharedId=${this.data.sharedId}`,
      imageUrl: this.data.shareImg
    };
  },

})