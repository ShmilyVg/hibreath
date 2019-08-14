// pages/result/result.js
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import toast from "../../view/toast";
import HiNavigator from "../../navigator/hi-navigator";

Page({
    data: {
        dateText: {},
        mainColor: '',
        isChose: false,
        score: "",
        LVcolor:["#0088B8","#00B898","#10A000","#F8A000","#E87001","#F83801"],
        tintColor: 'color:#00a48f',
        noAddPlan:true,//未加入减脂方案
        halfMonth:false,//是否超过半个月
        isHave:false,//是否生成过身体评估报告
        // 0 第一次使用 1 比上次大但没超过当前区间  2 比上次大并且超过当前区间  3 本次检测结果小于等于上次检测结果
        beyondLastTime:{
            type:0,
            title:"真棒！！",
            content:"与上次检测相比，燃脂效果并未提升，坚持减脂方案才会有收获"
        }
    },

    onLoad: function (options) {

    },

    onShow: function (options) {
        Protocol.postSetGradeInfo({id:"333"}).then(data=>{
            let _data = data.result;
            this.setData({
                list: _data.list,
                score:_data.score,
                Percentage:_data.Percentage,
                beyondLastTime:_data.beyondLastTime,
                halfMonth:_data.halfMonth,
              /*  noAddPlan:_data.noAddPlan,*/
                noAddPlan:true,
                isHave:_data.isHave,
                shareId:_data.shareId
            })
        });
    },

    /*clickChoose: function (e) {
        let that = this;
        if (e.currentTarget.dataset.index) {
            let index = e.currentTarget.dataset.index;
            let list = this.data.list;
            list.map(function (value) {
                value.isChose = index == value.key;
                if (value.isChose) {
                }
            });
            this.setData({
                list: list,
                isChose: true,
                index: index
            })
        }
    },

    clickBtn: function () {
        if (this.data.index) {
            this.postAnalysisFetch();
        }
    },
    //发送数据给服务器
    postAnalysisFetch() {
        toast.showLoading();
        Protocol.getAnalysisFetch({
            dataValue: this.data.score,
            situation: parseInt(this.data.index)
        }).then(data => {
            let description = data.result.description;
            this.setData({
                description: description,
            });
            toast.hiddenLoading();
            if (this.data.postAdd) {
                Protocol.getBreathDataAdd({
                    dataValue: this.data.score,
                    situation: parseInt(this.data.index)
                }).then(data => {})
            }
        });
    },*/
    //检测是否生成过身体评估报告 是的话显示弹窗 没有直接进入评估
    toSetInfo() {
        wx.showModal({
            title: '小贴士',
            content: '检测到您已生成过身体评估报告，是否要更新身体数据？',
            cancelText:'不需要',
            confirmText:'需要更新',
            success (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    HiNavigator.navigateToSetInfo();
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    cancel: function () {

    },
    confirm: function () {
        this.setData({
            "beyondLastTime.type": 0
        })
    },
    onShareAppMessage() {
        return {title: '测试分享', imageUrl: '', path: '/pages/result/result?shareId=' + this.data.shareId};
    },
})
