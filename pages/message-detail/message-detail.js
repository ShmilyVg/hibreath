// pages/message-detail/message-detail.js
import {previewImage, showActionSheet} from "../../view/view";
import {Toast as toast, WXDialog} from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
import HiNavigator from "../../navigator/hi-navigator";
import {getDayStr, getDynamicCreateTime, getHourStr, getMinuteStr} from "../../utils/time";
import {getSocialGroupManager, whenDismissGroup} from "../community/social-manager";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: ['', '', '', '', '', '', '', '', '',],
        desc: '',
        messageCreateTime: '',
        listArray:[],//头像数组
        commentContent:"",
        commentList:[],
        placeholderText:'评论',
        isReply:false,//回复标志位 区别评论
        commentId:'',//评论Id
        isFocus:false
    },

    async onLoad(options) {
        console.log(options)
        this.dataId = options.messageId
        wx.setNavigationBarTitle({title: '动态详情'});
        const {result} = await Protocol.postDynamicInfo({id: this.dataId});
        console.log("nickname",result)
        if(result.desc){
            this.setData({
                desc:result.desc,
            })
        }else{
            this.setData({
                desc:'',
            })
        }
        this.setData({
            result:result,
            canDelete:result.action.delete,
            imgUrls:result.imgUrls,
            messageCreateTime: getDynamicCreateTime(result.createTimestamp),
            headUrl:result.userInfo.headUrl,
            nickname:result.userInfo.nickname
        });
        this.data.listArray = []
        this.undateName(result.praiseInfo.list)
        this.undateComment()
        if(options.taskId){
            const {result} = await Protocol.postIncentive();
            if(result.taskInfo.food.todayFirst){
                this.setData({
                    showExcitation: true,
                    toastType:'food',
                    toastResult:result,
                })
            }else{
                this.setData({
                    showMytoast: true,
                    toastType:'imgClock',
                })
                setTimeout(()=>{
                    this.setData({
                        showMytoast:false,
                    })
                },2000)
            }
        }
    },
    async onShow(){
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    onHide() {
        this.setData({
            showExcitation: false,
        });
    },
    onUnload(){
        //控制首页打卡情况更新
        getApp().globalData.issueRefresh = true
    },
    //更新评论列表
    async undateComment(){
        const {result} = await whenDismissGroup(Protocol.postCommentList({dynamicId:this.dataId,pageSize:50000}));
        this.setData({
            commentInfoList:result.list,
            commentInfoTime: getDynamicCreateTime(result.createTimestamp),
            'message.commentInfo.totalCount':result.list.length
        })
    },
    getShowExcitation(e){
        this.setData({
            showExcitation:e.detail.showExcitation,
        })
    },
     onPullDownRefresh() {
        this.undateComment();
        wx.stopPullDownRefresh();
    },
    //更新点赞 头像数组
    undateName(arr){
        console.log('我被执')
        if(arr.length>0){
            arr.map((value, index) => {
                console.log('value.nickname',value.headUrl)
                if(value.nickname){
                    //this.data.listArray = []
                    this.data.listArray.push(value.headUrl)
                    this.setData({
                        headUrlList:this.data.listArray
                    })
                }
            });

            console.log('headUrlList',this.data.headUrlList)
        }else{
            this.setData({
                headUrlList:[]
            })
        }
    },
    //点赞
    async giveHeart(){
        if(this.data.result.action.liked){
            await whenDismissGroup(Protocol.postNoHeart({dynamicId:this.dataId}));
        }else{
            await whenDismissGroup(Protocol.postGiveHeart({dynamicId:this.dataId}));
          this.setData({
            ...result  //是否完成了任务
          })
        }
        const {result} = await whenDismissGroup(Protocol.postDynamicInfo({id: this.dataId}));
        this.setData({
            result:result,
        })
        if(result.action.liked){
            this.setData({
                showMytoast:true,
                toastType:'giveLike'
            })
            setTimeout(()=>{
                this.setData({
                    showMytoast:false,
                })
            },2000)
        }
        this.data.listArray = []
        this.undateName(result.praiseInfo.list)
    },
    onMessageSettingEvent() {
        WXDialog.showDialog({
            content: '确定要删除此条动态吗？', showCancel: true, confirmEvent: async () => {
                await Protocol.postDynamicDelete({id: this.dataId});
                HiNavigator.navigateBack({delta: 1});
                toast.success('删除成功',800);
            }
        });
    },
    async onImagePreview(e) {
        const {currentTarget: {dataset: {url: current}}} = e;
        await previewImage({current, urls: this.data.imgUrls});
    },

    onPageScroll: function (e) {

    },
    finClick(){
        if(!this.data.commentContent || this.data.commentContent ==""){
            toast.warn('请输入评论',800)
            return
        }


        if(this.data.isReply){
            this.finCReply()
        }else{
            this.finComment()
        }
        this.setData({
            placeholderText:"评论",
            commentContent:"",
            textareaValue:null,
            isReply:false
        })
        setTimeout(()=>{
            wx.pageScrollTo({
                scrollTop: 18000,
                duration: 100,
            })
        },10)
    },
    //完成评论
    async finComment(){
        await whenDismissGroup(Protocol.postAddComment({dynamicId:this.dataId,content:this.data.commentContent}));
        this.undateComment()
        this.setData({
            showMytoast:true,
            toastType:'comment'
        })
        setTimeout(()=>{
            this.setData({
                showMytoast:false,
            })
        },2000)
    },
    //完成回复
    async finCReply(){
        await whenDismissGroup(Protocol.postAddComment({dynamicId:this.dataId,content:this.data.commentContent,commentId:this.data.commentId}));
        this.undateComment()
        this.setData({
            showMytoast:true,
            toastType:'reComment'
        })
        setTimeout(()=>{
            this.setData({
                showMytoast:false,
            })
        },2000)
    },
    //多行输入
    textBindinput(e){
        console.log('e',e.detail.value)
        this.setData({
            commentContent:e.detail.value,
            textareaValue:e.detail.value
        })
        console.log('commentContent',this.data.commentContent)
    },
    //输入框聚焦事件
    textBindfocus(e){
      /*  console.log('eeeee',e)
        this.setData({
            textareaHeight:0
        })
        console.log('e',this.data.textareaHeight)*/
    },
    //输入框失去聚焦事件
    textBindblur(){

    },

    //点击评论进行回复或者删除
    async clickAction(e){
        console.log(e,'eeee')
        let action =e.currentTarget.dataset.action;
        let dataid =e.currentTarget.dataset.dataid;
        let fromName =e.currentTarget.dataset.nickname;
        let itemList=[];
        if(action.comment){
            itemList.push("回复")
        }
        if(action.delete){
            itemList.push("删除")
        }
        //回复 删除顺序不一定 在case中二次区分
        try {
            const {tapIndex} = await showActionSheet({itemList: itemList,itemColor:"#EE6F69"});
            console.log('res',tapIndex)
            switch (tapIndex) {
                case 0:
                    if(itemList[0] == '回复'){
                        this.setData({
                            placeholderText:"回复"+fromName,
                            isReply:true,
                            commentId:dataid
                        })
                        break;
                    }else{
                        WXDialog.showDialog({
                            content: '确定要删除该评论吗\n' + '删除后评论无法找回 慎重操作',
                            showCancel: true,
                            confirmText: "确定",
                            cancelText: "取消",
                            confirmEvent: async () => {
                                try{
                                    await whenDismissGroup(Protocol.postDeletecomment({commentId:dataid}));
                                    this.undateComment()
                                    toast.success('删除成功',800);
                                }catch (e) {

                                }

                            },
                            cancelEvent: () => {

                            }
                        });
                        break;
                    }

                case 1:
                    if(itemList[1] == '回复'){
                        this.setData({
                            placeholderText:"回复"+fromName,
                            isReply:true,
                            commentId:dataid
                        })
                        this.textBindfocus()
                        break;
                    }else{
                        WXDialog.showDialog({
                            content: '确定要删除该评论吗\n' + '删除后评论无法找回 慎重操作',
                            showCancel: true,
                            confirmText: "确定",
                            cancelText: "取消",
                            confirmEvent: async () => {
                                try{
                                    await whenDismissGroup(Protocol.postDeletecomment({commentId:dataid}));
                                    this.undateComment()
                                    toast.success('删除成功',800);
                                }catch (e) {

                                }

                            },
                            cancelEvent: () => {

                            }
                        });
                        break;
                    }
            }
        }catch (e) {
            console.warn(e);
        }
    },
});
