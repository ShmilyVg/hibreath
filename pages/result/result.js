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
        score: 96,
        tintColor: 'color:#00a48f',
        noAddPlan:true,//未加入减脂方案
        halfMonth:false,//是否超过半个月
        isHave:false,//是否生成过身体评估报告
        // 0 第一次使用 1 比上次大但没超过当前区间  2 比上次大并且超过当前区间  3 本次检测结果小于等于上次检测结果
        beyondLastTime:{
            type:1,
            title:"真棒！！",
            content:"与上次检测相比，燃脂效果并未提升，坚持减脂方案才会有收获"
        }
    },

    onLoad: function (options) {
        if(options.dataId){
            this.setData({
                "beyondLastTime.type": 0,
                "isShare":false,
            })
        }
        let mainColor = '#E64D3D';
        let score = options.score;
        console.log(tools.createDateAndTime(1564381889121),'8989')
        this.setData({
            mainColor: mainColor,
            score: score,
            resultDate:tools.createDateAndTime(1564381889121).date,
            resultTime:tools.createDateAndTime(1564381889121).time,
        });
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: mainColor
        });
/*        let beyondLastTime =[
            {type:0,title:"",content:""},
            {type:1,title:"",content:"与上次检测相比，燃脂效果并未提升，坚持减脂方案才会有收获"},
            {type:2,title:"不错！",content:"与上次检测相比，燃脂效果已有所提升，继续坚持！"},
            {type:3,title:"真棒！",content:"与上次检测相比，燃脂效果已大幅提升，脂肪分解的也比原先快了，继续坚持！"},
        ]*/
        //section 区间标志位备用
        let list = [
            {gradeNumber:"0-10",grade:"LV1",gradeType:"步行",section:false},
            {gradeNumber:"10-20",grade:"LV2",gradeType:"骑行",section:false},
            {gradeNumber:"20-30",grade:"LV3",gradeType:"汽车",section:false},
            {gradeNumber:"30-40",grade:"LV4",gradeType:"火车",section:false},
            {gradeNumber:"40-50",grade:"LV5",gradeType:"飞机",section:false},
            {gradeNumber:">50",grade:"LV6",gradeType:"火箭",section:true},
        ]
        this.setData({
            list: list,
        })
        Protocol.postSetGradeInfo().then(data=>{
         /*  let list = data.result.list;*/

        });
       /* Protocol.getAnalysisSituation().then(data => {
            let list = data.result.list;
            // 是否直接显示解读
            if (options.showUnscramble === 'true') {
                let date = tools.createDateAndTime(new Date(parseInt(options.timestamp)));
                let dateText = `${date.date}${date.time}`;
                this.setData({
                    list: list,
                    cardTitle: list[options.situation]['text_zh'],
                    showUnscramble: true,
                    index: options.situation,
                    dateText: dateText,
                    postAdd: false
                });
                this.postAnalysisFetch();
            } else {
                let date = tools.createDateAndTime(new Date());
                let dateText = `${date.date}\n${date.time}`;
                this.setData({
                    dateText: dateText,
                    list: list,
                    showUnscramble: false,
                    postAdd: true
                })
            }
        });*/

    },

    onShow: function (options) {

    },

    clickChoose: function (e) {
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
    },
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
        return {title: '测试一下分享', imageUrl: '', path: '/pages/result/result?dataId=' + this.shareBtn};
    },
})
