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
          if (e.detail.current === this.data.sportExt.recommendList.length - 1) {
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
      //运动打卡--左按钮
      imgToPre() {
          this.setData({
              currentSwiper: this.data.currentSwiper - 1
          })
      },
      //运动打卡--右按钮
      imgToNext() {
          this.setData({
              currentSwiper: this.data.currentSwiper + 1
          })
      },
      //视频打卡
      toVideoClock(e) {
          console.log("toVideoClock", e.currentTarget)
          if (e.currentTarget.dataset.finid || e.currentTarget.dataset.finid == '') {
              HiNavigator.redirectToFinishCheck({dataId: e.currentTarget.dataset.finid, clockWay: 'video'});
          }
          HiNavigator.navigateToVideoClock({id: e.currentTarget.dataset.id});
      },
  }
})
