// components/fat-window/fat-window.js
import HiNavigator from "../../navigator/hi-navigator";
const ImageSource = require('../../utils/ImageSource.js');
const ImageLoader = require('../../utils/ImageLoader.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalList: {
      type: Array,
      value: []
    }
  },
  lifetimes: {
     created() {

    },
    attached() {
      this.setData({
        firstArr:this.data.modalList[0]
      })
      var loader=new ImageLoader({
        base: ImageSource.BASE ,
        source: ImageSource.imageList,
        loading: res => {
          // 可以做进度条动画
          console.log(res);
        },
        loaded: res => {
          // 可以加载完毕动画
          console.log(res);
        }
      });
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showWindows:false,
    firstArr:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toRecomTarNew(){
      HiNavigator.navigateToRecomTarNew();
      this.triggerEvent("closeWindow", {showWindows:false})
    },
    closeW(){
      if(this.data.modalList.length>1){
        this.data.modalList = this.data.modalList.filter((d, i) => i > 0);
        this.setData({
          firstArr:this.data.modalList[0]
        })
      }else{
        this.triggerEvent("closeWindow", {showWindows:false})
        this.setData({
          firstArr:[]
        })
      }
    },
    toGift(){
      HiNavigator.navigateToGetGift();
      this.triggerEvent("closeWindow", {showWindows:false})
    },
  }
})
