 /**
  * @Author: 张浩玉
  * @Date: 2019-08-20 10:57:37
  * @LastEditors: 张浩玉
  */
import Protocol from "../../modules/network/protocol";
import * as tools from "../../utils/tools";
import HiNavigator from "../../navigator/hi-navigator";
import {
  ProtocolState
} from "../../modules/bluetooth/bluetooth-state";
import Toast from "../../view/toast";

Page({

  data: {
    allList: [],//
    page: 1,
    info:{},
    isLength: true//是否有数据
  },

  onLoad() {
    /*this.getBreathDataList({});*/
  },

  onShow() {
    getApp().setBLEListener({
      bleStateListener: ({
        state
      }) => {
        if (ProtocolState.QUERY_DATA_ING === state.protocolState) {
          this.setData({
              isLength: true
          })
        } else if (ProtocolState.QUERY_DATA_FINISH === state.protocolState) {
          this.setData({
              isLength: false
          })
          Toast.success('同步完成');
        }
      },
    });
  },

  toResult(e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.allList;
  /*  HiNavigator.navigateToResult({
      score: list[index]['dataValue'],
      situation: list[index]['situation'],
      showUnscramble: true,
      timestamp: list[index]['time']
    });*/
      HiNavigator.navigateToResult({
          "id": 333,
      })
  },
    //保存修改体重体脂记录
    continue(){
        if(typeof (this.data.info.weight) == "undefined"){
            toast.warn('请填写体重');
        }else if(typeof (this.data.info.bodyFatRate) == "undefined"){
            toast.warn('请填写体脂率');
        }else{
            Protocol.postSetBMIInfo(this.data.info).then(data => {
                console.log("111111",this.data.info)
                HiNavigator.navigateToBMIhistory(); //请求成功跳转到体重体脂记录页面
            })
        }


    },

    bindWeightInput(e){
        this.setData({
            'info.weight': e.detail.value
        })
    },

    bindBMIInput(e){
        this.setData({
            'info.bodyFatRate': e.detail.value
        })
    }

/*
  getBreathDataList({
    page = 1
  }) {
    Protocol.getBreathDataList({
      page
    }).then(data => {
      let list = this.handleList(data.result.list);
      if (list.length) {
        this.setData({
          allList: this.data.allList.concat(list),
        })
      } else {
        this.data.page--;
      }
    }).finally(() => wx.stopPullDownRefresh());
  },



  onPullDownRefresh() {
    this.data.allList.splice(0, this.data.allList.length);
    this.getBreathDataList({
      page: this.data.page = 1
    });
  },

  onReachBottom() {
    this.getBreathDataList({
      page: ++this.data.page
    });
  }*/
})
