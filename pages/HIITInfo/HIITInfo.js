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
            "videoUrl": "../../images/video/22.mp4",
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
        var videoLength = this.data.list.length;
        console.log("videoLength",videoLength)
        console.log("this.data.isLive",this.data.isLive)
        if(this.data.isLive<this.data.list.length-1){
            this.data.isLive++;
            this.setData({
                videoUrl:this.data.list[this.data.isLive].videoUrl
            })
        }else{
            this.setData({
                hidden: false
            })
        }

    },

    cancel: function () {

    },

    confirm: function () {
        this.setData({
            hidden: true
        })
    },

    clickSwiper(e){
        var videoUrl=e.currentTarget.dataset.pid; //点击的视频
        var isLive=e.currentTarget.dataset.number; //点击的视频所在数组的下标
        this.setData({
            videoUrl: videoUrl,
            isLive: isLive
        })
    },
    lastVideo(){
        for(var i=0;i<this.data.list.length;i++){
            if(this.data.videoUrl == this.data.list[i].videoUrl){
                let Ving= i-1;
                if(Ving<0){
                    this.setData({
                        hidden: false
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
                        hidden: false
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
    startVideo(){
        this.videoContext.play();
    },
    stopVideo(){
        this.videoContext.pause();
    }


})
