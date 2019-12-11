/**
 * @author Jack
 */
import { Toast} from "heheda-common-view";
import Protocol from "../../modules/network/protocol";

 const app = getApp();

 Page({
     data:{
        memberName: '',
        dayNum: 0,
        taskList:[],
        iconUp: "http://img.hipee.cn/hibreath/icon/up.png",
        iconDown:"http://img.hipee.cn/hibreath/icon/down.png",
         bodayFinished:false,
         todayDifUp:false,
         totalDifUp:false
     },
     onLoad(options){
         console.log(options)
        this._fetchData(options.sharedId)
     },
     // 点击预览大图
     previewImage(e) {
         var current = this.data.foodImglist[e.target.dataset.index]
         wx.previewImage({
             current: current, // 当前显示图片的http链接
             urls: this.data.foodImglist // 需要预览的图片http链接列表
         })
     },
     _fetchData(sharedId){// 获取数据
        if(!sharedId){
            console.log("[taskShareInfo] not found sharedId");
            return;
        }

        Toast.showLoading();
        Protocol.postTaskSharedInfo({sharedId}).then(res=>{
            if(res.code != 1 || !res.result){
                return;
            }
            this.setData({
                ...res.result
            });
            console.log('weight.todayDif',this.data.taskList)
            for(var i =0;i<this.data.taskList.length;i++){
                if(this.data.taskList[i].type == "food"){
                    this.setData({
                        foodImglist:this.data.taskList[i].ext.imgUrls,
                    })
                }
                if(this.data.taskList[i].type == "bodyIndex"){
                    var todayDif = this.data.taskList[i].ext.weight.todayDif
                    var totalDif = this.data.taskList[i].ext.weight.totalDif
                    this.setData({
                        bodayFinished:this.data.taskList[i].finished,
                    })
                    console.log('todayDif',todayDif,this.data.bodayFinished)
                    if(todayDif){
                        this.setData({
                            todayDif:Math.abs(todayDif),
                            todayDifImg:this.data.taskList[i].ext.weight.todayDifImg
                        })
                    }else{
                        this.setData({
                            todayDif:0,
                            todayDifImg:"https://img.hipee.cn/hibreath/icon/down.png",
                            todayDifUp:false,
                        })
                    }
                    if(totalDif){
                        this.setData({
                            totalDif:Math.abs(totalDif),
                            totalDifImg:this.data.taskList[i].ext.weight.totalDifImg,
                        })
                    }else{
                        this.setData({
                            totalDif:0,
                            totalDifImg:"https://img.hipee.cn/hibreath/icon/down.png",
                            totalDifUp:false,
                        })
                    }
                }
            }
        }).finally(()=>{
            Toast.hiddenLoading();
        });
     }
 })
