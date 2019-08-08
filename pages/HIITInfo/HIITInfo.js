import HiNavigator from "../../navigator/hi-navigator";
import toast from "../../view/toast";
import Protocol from "../../modules/network/protocol";

Page({

    data: {
        videoUrl:"",
        confirmText: '好哒',
        cancelText: '取消',
        tintColor: 'color:#00a48f',
        title:"真棒！",
        content:"恭喜完成本次运动",
        hidden:true,
        itemNumber:2,
        isAutoplay:true,
        isLive:0,//正在播放的视频下标
        sliderValue: 0, //控制进度条slider的值，
        updateState: false, //防止视频播放过程中导致的拖拽失效
        progressM:"",
        videoLast:false
    },
    onReady: function (res) {
        this.videoContext = wx.createVideoContext('videoplayer');
        this.setData({
            updateState: true
        })
    },

    onLoad: function () {
        let list=[{
            "videoUrl": "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
            "title": "第一个",
            "des": "第一个描述",
            "pic": "../../images/hiit1.png"
        }, {
            "videoUrl": "https://apd-0c583ae3dc3943d674add80d35f80a63.v.smtcdns.com/vhot2.qqvideo.tc.qq.com/A3JNIJlawJ1S21j7a35VF_jiYLJG-VaEgaoXeM3bobAs/uwMROfz2r5zIIaQXGdGnC2dfDmb_xYKxrIGz_bGUg2Lja6ru/m0910jndeqr.mp4?sdtfrom=v1104&guid=0ba6e86bbdb1436dc6a42f69deeb19ea&vkey=DCFFE47C563EDBE85595BB2286CCB69741EF9144A2EE3430D0E0C1448C8EC01DF64E1B81982498E7738CD59D11E79171738A9B7DB40E85DE5A58AEFA7E89E5E055FDA0002AB30E949321E0B08306C201FF0560394062E17E069D5CD634D41D170594B0FFC1E0081830A1F4EE562A782C4A6AD5B4AE0D5FF95854CA43469BC877",
            "title": "第二个",
            "des": "第二个描述",
            "pic": "../../images/hiIi2.png"
        }, {
            "videoUrl": "../../images/video/1.全身舒展.mp4",
            "title": "第二个",
            "des": "第二个描述",
            "pic": "../../images/hiIi2.png"
        },];
        this.setData({
            list: list,
            videoUrl:list[0].videoUrl
        })
        console.log()
    },
    onShow:function () {
        Protocol.postCookInfo({deviceId: this.data.deviceId}).then(data => {

        })
    },
    //播放条时间改表触发
    videoUpdate(e) {
        if (this.data.updateState) { //判断拖拽完成后才触发更新，避免拖拽失效
            let sliderValue = e.detail.currentTime / e.detail.duration * 100;

            this.setData({
                sliderValue: sliderValue,
                progressM: sliderValue,
                duration: e.detail.duration
            })
        }
    },
    sliderChanging(e) {
        this.setData({
            updateState: false //拖拽过程中，不允许更新进度条
        })
    },
    //拖动进度条触发事件
    sliderChange(e) {

        if (this.data.duration) {
            this.videoContext.seek(e.detail.value / 100 * this.data.duration); //完成拖动后，计算对应时间并跳转到指定位置
            this.setData({
                sliderValue: e.detail.value,
                updateState: true //完成拖动后允许更新滚动条
            })
        }
    },

    //视频播放完成后处理   视频自动连续播放&&ALL后弹窗 显示运动完成弹窗
    bindended(){
       this.nextVideo()
    },

    cancel: function () {

    },

    confirm: function () {
        this.setData({
            hidden: true
        })
    },

    lastVideo(){
        for(var i=0;i<this.data.list.length;i++){
            if(this.data.videoUrl == this.data.list[i].videoUrl){
                let Ving= i-1;
                console.log(Ving,'Ving')
                if(Ving<0){
                    this.setData({
                        videoLast: false
                    })
                }else if(Ving ==0){
                    this.setData({
                        videoLast: false,
                        videoUrl: this.data.list[Ving].videoUrl
                    })
                }else{
                    this.setData({
                        videoUrl: this.data.list[Ving].videoUrl
                    })
                }
                return;
            }
        }
    },
    nextVideo(){
        for(var i=0;i<this.data.list.length;i++){
            if(this.data.videoUrl == this.data.list[i].videoUrl){
                let Ving= i+1;
                if(Ving>=this.data.list.length){
                    this.setData({
                        hidden: false,
                        videoLast: true
                    })
                }else{
                    this.setData({
                        videoUrl: this.data.list[Ving].videoUrl,
                        videoLast: true
                    })
                }
                return;
            }
        }
    },
    startVideo(){
        this.videoContext.play();
    },
    stopVideo(){
        this.videoContext.pause();
    }


})
