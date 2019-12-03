// components/exciting-window/exciting-window.js
import Protocol from "../../modules/network/protocol";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      setType: {
          type: String,
          value: ''
      },
  },
    lifetimes: {
        async created() {
            console.log('setType',this.data.setType)
          const {result} = await Protocol.postIncentive();

        },
        attached() {

        },
        detached() {

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

  }
})
