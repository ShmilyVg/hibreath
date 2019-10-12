import HiNavigator from "../../navigator/hi-navigator";

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

    onLoad: function (data) {
        console.log("123123",data)

    },
    onShow:function () {
        let list=[
            {"videoUrl": "http://img.hipee.cn/hibreath/video/1%E3%80%82%E6%85%A2%E8%B5%B0%20-%201%E5%88%86%E9%92%9F.mp4",
            "title": "第1个",
            "des": "第1个描述",
            "duration":"11111",
            "pic": "../../images/hiIi2.png",
            "stepList":["躺下1"]
            },
            {"videoUrl": "http://img.hipee.cn/hibreath/video/9%E3%80%81%E7%96%BE%E9%80%9F%E8%B5%B0-1%E5%88%86%E9%92%9F.mp4",
                "title": "第2个",
                "des": "第2个描述",
                "duration":"2222",
                "pic": "../../images/hiit1.png",
                "stepList":["躺下2"]
            },
            {"videoUrl": "http://img.hipee.cn/hibreath/video/1%E3%80%82%E6%85%A2%E8%B5%B0%20-%201%E5%88%86%E9%92%9F.mp4",
                "title": "第3个",
                "des": "第3个描述",
                "duration":"3333",
                "pic": "../../images/hiIi2.png",
                "stepList":["躺下3"]
            }];
        this.setData({
            list: list,
            videoUrl:list[0].videoUrl,
            indexTitle:list[0].title,
            indexStepList:list[0].stepList,
        })
        Protocol.postHIIT().then(data => {
                console.log(data,'data')
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
                let vingLaxt= i-1;
                console.log(vingLaxt,'vingLaxt')
                if(vingLaxt<0){
                    this.setData({
                        videoLast: false
                    })
                }else if(vingLaxt ==0){
                    this.setData({
                        videoLast: false,
                        videoUrl: this.data.list[vingLaxt].videoUrl
                    })
                }else{
                    this.setData({
                        videoUrl: this.data.list[vingLaxt].videoUrl
                    })
                }
                return;
            }
        }
    },
    nextVideo(){
        for(var i=0;i<this.data.list.length;i++){
            if(this.data.videoUrl == this.data.list[i].videoUrl){
                let vingNext= i+1;
                if(vingNext>=this.data.list.length){
                    this.setData({
                        hidden: false,
                        videoLast: true
                    })
                }else{
                    this.setData({
                        videoUrl: this.data.list[vingNext].videoUrl,
                        videoLast: true
                    })
                }
                return;
            }
        }
    },
    clickSwiper(e){
        console.log(e)
        var videoUrl=e.currentTarget.dataset.pid; //点击的视频
        var isLive=e.currentTarget.dataset.number; //点击的视频所在数组的下标
        this.setData({
            videoUrl: videoUrl,
            isLive: isLive
        })
    },
    startVideo(){
        this.videoContext.play();
    },
    stopVideo(){
        this.videoContext.pause();
    },

    videoList(){

    }


})
