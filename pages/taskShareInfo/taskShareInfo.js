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
     },
     onLoad(options){
         console.log(options)
        this._fetchData(options.sharedId)
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
                if(this.data.taskList[i].type == "bodyIndex"){
                    if(this.data.taskList[i].ext.weight.todayDif){
                        this.setData({
                            todayDif:Math.abs(this.data.taskList[i].ext.weight.todayDif),
                        })
                    }else{
                        this.setData({
                            todayDif:0,
                        })
                    }
                    if(this.data.taskList[i].ext.weight.totalDif){
                        this.setData({
                            totalDif:Math.abs(this.data.taskList[i].ext.weight.totalDif),
                        })
                    }else{
                        this.setData({
                            totalDif:0,
                        })
                    }
                }
            }
        }).finally(()=>{
            Toast.hiddenLoading();
        });
     }
 })
