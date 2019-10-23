import HiNavigator from "../../navigator/hi-navigator";
import Protocol from "../../modules/network/protocol";

Page({

    data: {
        videoUrl:"",
        cancelText: '取消',
        itemNumber:2,
        list:[],
        isAutoplay:true,
        isLive:0,//正在播放的视频下标
        listNow:1,//当前播放的视频
        listNumber:0,//总视频数
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
        this.dataId = data.id;
        Protocol.postHIIT({id:data.id}).then(data => {
            console.log(data,'data')
            const finaLiat = data.result.sectionList
            this.setData({
                list: finaLiat,
                listNumber:finaLiat.length,
                videoUrl:finaLiat[0].videoUrl,
                indexTitle:finaLiat[0].title,
                indexStepList:finaLiat[0].stepList,
            })
        })
    },
    onShow:function () {

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
    async nextVideo(){
        for(var i=0;i<this.data.list.length;i++){
            if(this.data.videoUrl == this.data.list[i].videoUrl){
                let vingNext= i+1;
                console.log("将要播放的视频",vingNext)
                if(vingNext>this.data.list.length-1){
                    await Protocol.postHIITFin({sportId:this.dataId}).then(data => {
                        this.setData({
                            finId:data.result.id
                        })
                    })
                    HiNavigator.redirectToFinishCheck({dataId: this.data.finId, clockWay: 'video'});
                }else{
                    this.setData({
                        listNow:vingNext+1,
                        videoUrl: this.data.list[vingNext].videoUrl,
                        indexStepList:this.data.list[vingNext].stepList,
                        indexTitle:this.data.list[vingNext].title
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
            isLive: isLive,
            listNow:isLive+1,
            indexStepList:this.data.list[isLive].stepList,
            indexTitle:this.data.list[isLive].title
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
