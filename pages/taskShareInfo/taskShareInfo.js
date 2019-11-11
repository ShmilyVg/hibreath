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
        }).finally(()=>{
            Toast.hiddenLoading();
        });
     }
 })