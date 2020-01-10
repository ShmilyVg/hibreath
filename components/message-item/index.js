import { Toast as toast, WXDialog } from "heheda-common-view";
import Protocol from "../../modules/network/protocol";
import { previewImage, showActionSheet } from "../../view/view";
import HiNavigator from "../../navigator/hi-navigator";
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    message: {
      type: Object,
      value: { taskId: "", imgUrls: ['', '', '',], desc: '', messageCreateTime: '', headUrl: '', nickname: '' },
      observer(newVal, oldVal) {
        this.initUndateName(newVal.praiseInfo.list)
      }
    },
    scrollTopNum: {
      type: Number,
      value: 0
    },
  },

  data: {
    isgiveHeart: false,
    giveHeartNum: 0,
    clickComment: false,
    commentViewNum: 0,
    listArray: [],
    commentContent: "",
    commentList: [],
    placeholderText: '评论',
    isReply: false,//回复标志位 区别评论
    commentId: '',//评论Id
    textareaHeight: 0,
  },
  lifetimes: {
    created() {

    },
    attached() {
      setTimeout(() => {
        this.data.listArray = []
        this.initUndateName(this.data.message.praiseInfo.list)
      }, 100)
    },
  },
  pageLifetimes: {
    show() {
      setTimeout(() => {
        this.data.listArray = []
        this.initUndateName(this.data.message.praiseInfo.list)
      }, 1000)
    },
    hide() {

    }
  },
  methods: {
    onMessageClickEvent() {
      HiNavigator.navigateToMessageDetail({ messageId: this.data.message.id });
    },
    onMessageSettingEvent() {
      WXDialog.showDialog({
        content: '确定要删除此条动态吗？', showCancel: true, confirmEvent: async () => {
          //await Protocol.postDynamicDelete({id: this.data.message.id});
          this.triggerEvent('onMessageDeleteEvent', { taskId: this.data.message.id });
        }
      });
    },
    initUndateName() {
      if (arr.length > 0) {
        arr.map((value, index) => {
          if (value) {
            this.setData({
              nickNameList: this.data.listArray.join(',')
            })
          }
        });

      } else {
        this.setData({
          nickNameList: []
        })
      }
    },
    //更新点赞 昵称
    undateName(arr) {
      if (arr.length > 0) {
        arr.map((value, index) => {
          if (value) {
            this.data.listArray.push(value.nickname)
            this.setData({
              nickNameList: this.data.listArray.join(',')
            })
          }
        });

      } else {
        this.setData({
          nickNameList: []
        })
      }
    },
    //更新评论列表
    async undateComment() {
      const { result } = await this.whenDismissGroup(Protocol.postCommentList({ dynamicId: this.data.message.id, pageSize: 50000 }));
      this.setData({
        'message.commentInfo.list': result.list,
        'message.commentInfo.totalCount': result.list.length
      })
    },
    async onImagePreview(e) {
      this.triggerEvent('onNoupdate', { noUpdateAll: true });
      const { currentTarget: { dataset: { url: current } } } = e;
      await previewImage({ current, urls: this.data.message.imgUrls });
    },
    //点赞
    async giveHeart() {
      if (this.data.message.action.liked) {
        await this.whenDismissGroup(Protocol.postNoHeart({ dynamicId: this.data.message.id }));
      } else {
        const { result } = await this.whenDismissGroup(Protocol.postGiveHeart({ dynamicId: this.data.message.id }));
        this.setData({
          ...result  //是否完成了任务
        })
      }
      const { result } = await this.whenDismissGroup(Protocol.postDynamicInfo({ id: this.data.message.id }));
      this.setData({
        'message.praiseInfo.totalCount': result.praiseInfo.totalCount,
        'message.praiseInfo.list.': result.praiseInfo.list,
        'message.action.liked': !this.data.message.action.liked,
      })
      wx.vibrateShort()
      if (result.action.liked) {
        this.setData({
          showMytoast: true,
          toastType: 'giveLike'
        })
        setTimeout(() => {
          this.setData({
            showMytoast: false,
          })
        }, 3000)
      }
      this.data.listArray = []
      this.undateName(result.praiseInfo.list)
    },
    /*  async giveHeart(){
          if(this.data.message.action.liked){
              await whenDismissGroup(Protocol.postNoHeart({dynamicId:this.data.message.id}));
              this.setData({
                  'message.praiseInfo.totalCount':Number(this.data.message.praiseInfo.totalCount)-1,
                  'message.praiseInfo.list':this.data.message.praiseInfo.list.splice(0,1),
                  nickNameList:this.data.message.praiseInfo.list.join(',')
              })
              console.log('nickNameListnickNameList',this.data.message.praiseInfo.list)
          }else{
              await whenDismissGroup(Protocol.postGiveHeart({dynamicId:this.data.message.id}));
              console.log('this.data.message.userInfo.nickname',this.data.message.praiseInfo.list.push(this.data.message.userInfo.nickname))
              this.setData({
                  'message.praiseInfo.totalCount':Number(this.data.message.praiseInfo.totalCount)+1,
                  'message.praiseInfo.list':this.data.message.praiseInfo.list.concat(this.data.message.userInfo.nickname),
                  nickNameList:this.data.message.praiseInfo.list.join(',')
              })
              console.log('nickNameListnickNameList',this.data.message.praiseInfo.list)
          }
          this.setData({
              'message.action.liked':!this.data.message.action.liked
          })

      },*/
    //点击评论
    goCommunity() {
      this.setData({
        placeholderText: "评论",
        clickComment: !this.data.clickComment,
        isReply: false
      })
    },
    finClick() {
      if (!this.data.commentContent || this.data.commentContent == "") {
        toast.warn('请输入评论', 1000)
        this.setData({
          clickComment: true,
        })
        return
      }
      if (this.data.isReply) {
        this.finCReply()
      } else {
        this.finComment()
      }
      console.log('this.data.scrollTopNum', this.data.scrollTopNum)
      this.setData({
        placeholderText: "评论",
        commentContent: "",
        textareaValue: null,
        isReply: false
      })
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: this.data.scrollTopNum,
          duration: 100,
        })
      }, 10)
    },
    //完成评论
    async finComment() {
      const { result } = await this.whenDismissGroup(Protocol.postAddComment({ dynamicId: this.data.message.id, content: this.data.commentContent }));
      this.undateComment()
      //toast.success('评论成功',800);
      this.setData({
        showMytoast: true,
        toastType: 'comment',
        ...result
      })
      setTimeout(() => {
        this.setData({
          showMytoast: false,
        })
      }, 3000)
    },
    //完成回复
    async finCReply() {
      const { result } = await this.whenDismissGroup(Protocol.postAddComment({ dynamicId: this.data.message.id, content: this.data.commentContent, commentId: this.data.commentId }));
      this.undateComment()
      this.setData({
        showMytoast: true,
        toastType: 'reComment',
        ...result
      })
      setTimeout(() => {
        this.setData({
          showMytoast: false,
        })
      }, 3000)
    },
    //多行输入
    textBindinput(e) {
      console.log('e', e.detail.value)
      this.setData({
        commentContent: e.detail.value,
        textareaValue: e.detail.value
      })
      console.log('commentContent', this.data.commentContent)
    },
    //输入框聚焦事件
    textBindfocus(e) {
      this.setData({
        textareaHeight: e.detail.height
      })
      console.log('e', this.data.textareaHeight)
    },
    //输入框失去聚焦事件
    textBindblur() {
      this.setData({
        clickComment: false
      })
    },
    //点击评论进行回复或者删除
    async clickAction(e) {
      console.log(e, 'eeee')
      let action = e.currentTarget.dataset.action;
      let dataid = e.currentTarget.dataset.dataid;
      let fromName = e.currentTarget.dataset.nickname;
      let itemList = [];
      if (action.comment) {
        itemList.push("回复")
      }
      if (action.delete) {
        itemList.push("删除")
      }
      //回复 删除顺序不一定 在case中二次区分
      try {
        const { tapIndex } = await showActionSheet({ itemList: itemList, itemColor: "#EE6F69" });
        console.log('res', tapIndex)
        switch (tapIndex) {
          case 0:
            if (itemList[0] == '回复') {
              this.setData({
                placeholderText: "回复" + fromName,
                clickComment: !this.data.clickComment,
                isReply: true,
                commentId: dataid
              })
              break;
            } else {
              WXDialog.showDialog({
                content: '确定要删除该评论吗\n' + '删除后评论无法找回 慎重操作',
                showCancel: true,
                confirmText: "确定",
                cancelText: "取消",
                confirmEvent: async () => {
                  try {
                    await this.whenDismissGroup(Protocol.postDeletecomment({ commentId: dataid }));
                    this.undateComment()
                    toast.success('删除成功', 800);
                  } catch (e) {

                  }

                },
                cancelEvent: () => {

                }
              });
              break;
            }

          case 1:
            if (itemList[1] == '回复') {
              this.setData({
                placeholderText: "回复" + fromName,
                clickComment: !this.data.clickComment,
                isReply: true,
                commentId: dataid
              })
              break;
            } else {
              WXDialog.showDialog({
                content: '确定要删除该评论吗\n' + '删除后评论无法找回 慎重操作',
                showCancel: true,
                confirmText: "确定",
                cancelText: "取消",
                confirmEvent: async () => {
                  try {
                    await this.whenDismissGroup(Protocol.postDeletecomment({ commentId: dataid }));
                    this.undateComment()
                    toast.success('删除成功', 800);
                  } catch (e) {

                  }

                },
                cancelEvent: () => {

                }
              });
              break;
            }
        }
      } catch (e) {
        console.warn(e);
      }

    },
    async  whenDismissGroup(protocol) {
      try {
        return await protocol;
      } catch (e) {
        console.error(e);
        const { code } = e.data;
        if (code === 40011) {
          WXDialog.showDialog({
            title: '', content: '抱歉\n您已被移除该圈子', confirmText: '我知道了', confirmEvent: () => {
              wx.removeStorageSync('currentSocialGroupId')
              wx.switchTab({
                url: '../community/community',
                success: function (e) {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onShow();
                }
              })
              HiNavigator.switchToCommunity();
              //getSocialGroupManager.getSocialGroupList()
            }
          });
        } else if (code === 40012) {
          WXDialog.showDialog({
            title: '', content: '抱歉\n该圈子已解散', confirmText: '我知道了', confirmEvent: () => {
              wx.removeStorageSync('currentSocialGroupId')
              wx.switchTab({
                url: '../community/community',
                success: function (e) {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onShow();
                }
              })
            }
          });
        } else if (code === 40013) {
          setTimeout(() => {
            wx.hideLoading();
          }, 500)
          WXDialog.showDialog({
            title: '', content: '您上传的图片包含违规违法内容，\n请修改后重新上传', confirmText: '我知道了', confirmEvent: () => {

            }
          });
        } else if (code === 40014) {
          setTimeout(() => {
            wx.hideLoading();
          }, 500)
          WXDialog.showDialog({
            title: '', content: '您上传的文字包含违规违法内容，\n请修改后重新上传', confirmText: '我知道了', confirmEvent: () => {

            }
          });
        }
        return Promise.reject(e);
      }
    },
  }
});
