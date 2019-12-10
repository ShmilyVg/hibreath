// components/my-toast/my-toast.js
import Protocol from "../../modules/network/protocol";
/**
 * @Date: 2019-12-03 17:12:33
 * @LastEditors: 张浩玉
 */

/**
 * toastType
 * giveLike：点赞  fatBurn：燃脂检测完成   comment：评论完成 reComment:回复完成
 * imgClock：动态发表成功  share：分享成功  weight：体重信息更新  blood：血压更新  heart：心率  paiMoney 派币
 */


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    toastType:{
        type:String,
        value:''
    },
      toastText:{
          type: String,
          value: ''
      },
  },
    lifetimes: {
         created() {

        },
        attached() {
            if(this.data.toastType =='giveLike'){
                this.setData({
                    toastImg:'../../images/toast/giveLike.png',
                    toastText:'你的赞太棒了哦！'
                })
            }
            if(this.data.toastType =='fatBurn'){
                this.setData({
                    toastImg:'../../images/toast/fatBurn.png',
                    toastText:'燃脂检测完成啦！'
                })
            }
            if(this.data.toastType =='comment'){
                this.setData({
                    toastImg:'../../images/toast/comment.png',
                    toastText:'你的评论TA能看到啦！'
                })
            }
            if(this.data.toastType =='reComment'){
                this.setData({
                    toastImg:'../../images/toast/comment.png',
                    toastText:'你的回复TA能看到啦！'
                })
            }
            if(this.data.toastType =='imgClock'){
                this.setData({
                    toastImg:'../../images/toast/imgClock.png',
                    toastText:'发布成功，太棒啦！'
                })
            }
            if(this.data.toastType =='share'){
                this.setData({
                    toastImg:'../../images/toast/share.png',
                    toastText:'分享成功，太棒啦！'
                })
            }
            if(this.data.toastType =='weight'){
                this.setData({
                    toastImg:'../../images/toast/weight.png',
                    toastText:'体重信息已记录啦！'
                })
            }
            if(this.data.toastType =='blood'){
                this.setData({
                    toastImg:'../../images/toast/blood.png',
                    toastText:'血压信息已记录啦！'
                })
            }
            if(this.data.toastType =='heart'){
                this.setData({
                    toastImg:'../../images/toast/heart.png',
                    toastText:'心率信息已记录啦！'
                })
            }
            if(this.data.toastType =='paiMoney'){
                this.setData({
                    toastImg:'../../images/toast/pai.png',
                })
            }
        },
        detached() {

        },
    },
  /**
   * 组件的初始数据
   */
  data: {
      toastImg:'',
      toastText:''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
