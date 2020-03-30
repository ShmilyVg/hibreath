// pagesIndex/takeOutSelect/takeOutSelect.js
import Protocol from "../../modules/network/protocol";

Page({
  data: {
    selectList:[
      { title: '减油', Desc: '减少油炸食品、备注少放油、用清水洗刷外食油脂', imgPath:'../images/icon/reduce.png'},
      { title: '加油', Desc: '自备橄榄油、茶油、芝士片、干酪碎、动物脂肪、坚果', imgPath: '../images/icon/add.png' },
      { title: '代替主食', Desc: '不吃主食、或用蔬菜代替：如生菜叶、苦菊', imgPath: '../images/icon/replace.png' },
      { title: '避免糖', Desc: '主动避免沙拉和蘸酱，饮料和甜点都别点了哦', imgPath: '../images/icon/avoid.png' },
      { title: '养成备注好习惯', Desc: '可选择备注类似：“不要放糖、不要勾芡”等', imgPath: '../images/icon/edit.png' },
    ],
    foodList:[
      { title: '轻食沙拉', Desc: '建议黑椒汁、油醋汁等，不要沙拉酱', imgPath:'https://img.hipee.cn/hibreath/icon/LosefatReport/sl.png'},
      { title: '石锅拌饭', Desc: '减少2/3的米饭量', imgPath: 'https://img.hipee.cn/hibreath/icon/LosefatReport/bf.png' },
      { title: '清汤麻辣烫/冒菜', Desc: '避免粉丝类、各种鱼丸等加工食物，可\n选莲藕、土豆、魔芋丝等代替', imgPath: 'https://img.hipee.cn/hibreath/icon/LosefatReport/mc.png' },
      { title: '清炒、清蒸、凉拌等做法的菜品', Desc: '蘑菇炒肉、番茄龙利鱼、西红柿炒蛋、\n小葱拌豆腐、青椒土豆片等', imgPath: 'https://img.hipee.cn/hibreath/icon/LosefatReport/lb.png' },
      { title: '主食菜品', Desc: '土豆、莲藕、魔芋、红薯、杂粮粥等', imgPath: 'https://img.hipee.cn/hibreath/icon/LosefatReport/zs.png' },
      { title: '火锅', Desc: '不沾麻酱，用酱油、醋、小米辣等调料\n调配', imgPath: 'https://img.hipee.cn/hibreath/icon/LosefatReport/hg.png' },
    ],
    currenttab:'0'
  },
  //切换标签页
  async selectTab(e) {
    console.log('ee',e)
    let newtab = e.currentTarget.dataset.tabid;
    console.log(newtab)
    if (this.data.currenttab !== newtab) {
      this.setData({
        currenttab: newtab
      });
    }

  },
})