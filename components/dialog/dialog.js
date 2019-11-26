import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {            
      type: String,    
      value: '标题'    
    },
    // 弹窗内容
    content: {
      type: String,
      value: '内容'
    },
    // 弹窗取消按钮文字
    btn_no: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    btn_ok: {
      type: String,
      value: '确定'
    }
  },
 

  /**
   * 组件的初始数据
   */
  data: {
    flag: true,
    isChose:false,
    idx:"",
    isShow:false

  },
  lifetimes: {
    created() {
      this.WhenDismissGroup();

    },
    attached() {
      this.WhenDismissGroup();
    },
    detached() {

    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hidePopup: function () {
      this.setData({
        flag: !this.data.flag,
        isShow:false
      })
      
    },
    //展示弹框
    showPopup() {
      this.setData({
        flag: !this.data.flag,
        isShow: true
      })
    },
   
    _error() {
      //触发取消回调
      this.triggerEvent("error")
    },
    _success(e) {
      //触发成功回调
      const {idx} = this.data;
    
      if (idx){
        this.triggerEvent("success", { groupId: idx});
        let currentSocialGroupId = (wx.getStorageSync('currentSocialGroupId') || "");
        currentSocialGroupId = this.data.idx
        wx.setStorageSync('currentSocialGroupId', currentSocialGroupId);

      }
    },
     async WhenDismissGroup() {
      const { result : {list} } = await Protocol.postMemberGroupList();
      this.setData({
        list:list
      })
    
    },
    isChose(e){
     
      let index = e.currentTarget.dataset.id;
      console.log(789,index)
      console.log(789, e)
     
      for (var i = 0; i < this.data.list.length; i++) {
        if (e.currentTarget.dataset.id == i) {
          this.data.list[index].isChose = true;

        }
        else {
          this.data.list[index].isChose = false
        }
      }
      this.setData({
        list:this.data.list
      })
      console.log(this.data.isChose)
      
    },
    selectApply: function(e){
      let id = e.currentTarget.dataset.id
        console.log("e",e)
        this.setData({
          idx:id
        })
    },
   
   

    
  }

})