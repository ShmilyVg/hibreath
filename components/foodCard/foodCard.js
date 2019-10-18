// components/uploadImgCard/uploadImgCard.js
import HiNavigator from "../../navigator/hi-navigator";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      foodTask:{
          type:Object,
          value:{}
      },
      foodExt:{
          type:Object,
          value:{}
      },
      foodHheight:{
          type:Number,
          value:0
      },

      foodHiddenImg:{
          type:Boolean,
          value:false
      },

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      bindTapSportType(e){
          HiNavigator.navigateToImgClock({id: e.currentTarget.dataset.finid});
      },
      toRules(){

      },
      //轮播图当前
      swiperChange: function (e) {
          console.log(e.detail.current, 'eeeeee')
          this.setData({
              currentSwiper: e.detail.current
          })
          if (e.detail.current === 0) {
              this.setData({
                  grayLeft: true,
                  grayRight: false
              })
              return
          }
          if (e.detail.current === this.data.foodExt.mealList.length - 1) {
              this.setData({
                  grayLeft: false,
                  grayRight: true
              })
              return
          }
          this.setData({
              grayLeft: false,
              grayRight: false
          })
      },
      //饮食打卡--左按钮
      imgToPre() {
          this.setData({
              currentSwiper: this.data.currentSwiper - 1
          })
      },
      //饮食打卡--右按钮
      imgToNext() {
          this.setData({
              currentSwiper: this.data.currentSwiper + 1
          })
      },
      //饮食打卡详情
      toDynamicDetails(e){
          console.log('2',e)
          HiNavigator.navigateToMessageDetail({messageId: e.currentTarget.dataset.finid});
      }
  }
})
