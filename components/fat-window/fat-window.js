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
      value: [],
    }
  },
  lifetimes: {
     created() {

    },
    attached() {
      this.setData({
        firstArr:this.data.modalList[0]
      })
      this.triangleNumF()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showWindows:false,
    firstArr:{},
    triangleNum:1,
    times:1,//执行次数
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
    toGoal(){
      this.triggerEvent("closeWindow", {showWindows:false})
      this.triggerEvent("weightGoal")
    },
    triangleNumF(){
      const that =this
      setTimeout(() => {
        if(that.data.times<499){
          that.setData({
            triangleNum:that.data.triangleNum+1
          })
          if(that.data.triangleNum == 7){
            that.setData({
              triangleNum:1
            })
          }
          that.triangleNumF()
          that.setData({
            times:this.data.times+1
          })
        }
      }, 200)
    }
  }
})
