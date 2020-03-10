// components/fat-window/fat-window.js
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
      console.log('thisdsad2222',this.data.modalList)
      this.setData({
        firstArr:this.data.modalList[0]
      })
    }
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
    closeW(){
      var newArr = this.data.modalList.shift(); //删除并返回数组的第一个元素
      console.log('_arr',newArr)
      this.setData({
        modalList:newArr
      })
    }
  }
})
