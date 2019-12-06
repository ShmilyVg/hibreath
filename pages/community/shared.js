import {Toast as toast, Toast, WXDialog} from "heheda-common-view";
/**
 * @Date: 2019-12-05 15:06:27
 * @LastEditors: 张浩玉
 */
var rpx;
function screenWdith(page){
    let that = page;
    rpx = 500/414;
    that.setData({
        windowWidth: 500,
        canvasHeight:400,
    });
}
function drawFont(ctx,contentSzie,content,contentX,contentY) {
    ctx.setFontSize(contentSzie);
    ctx.setFillStyle("#000000");
    ctx.fillText(content, contentX*rpx, contentY*rpx);
}
function drawFontGray(ctx,contentSzie,content,contentX,contentY) {
    ctx.setFontSize(contentSzie);
    ctx.setFillStyle("#454545");
    ctx.fillText(content, contentX*rpx, contentY*rpx);
}
function drawFontWhite(ctx,contentSzie,content,contentX,contentY) {
    ctx.setFontSize(contentSzie);
    ctx.setFillStyle("#FFFFFF");
    ctx.fillText(content, contentX*rpx, contentY*rpx);
}
function getImageInfo(page) {
    let that = page;
    that.setData({
        shareTaskListImg:[]
    })
    wx.getImageInfo({
        src: that.data.currentSocial.imgUrl+'?x-oss-process=style/resize100circle',
        success: (res) => {
            that.setData({
                'currentSocial.imgUrl':res.path
            })

        },
        fail(res){

        }
    })
    for(let i = 0;i<that.data.socialMemberInfo.memberImgs.length;i++){
        var str = "shareTaskListImg" + i//组合出一个字符串
        wx.getImageInfo({
            src: that.data.socialMemberInfo.memberImgs[i]+'?x-oss-process=style/resize100circle',
            success: (res) => {
                console.log('str',res.path)
                that.setData({
                    [str]:res.path
                })
                that.data.shareTaskListImg.push(res.path)
                console.log('that.data.shareTaskListImg',that.data.shareTaskListImg)
                if(that.data.shareTaskListImg.length === that.data.socialMemberInfo.memberImgs.length ){
                    setTimeout(() => {
                        createNewIm(that)
                    },500)
                }
            },
            fail(res){
                console.log('头像下载失败', [str]);
                that.setData({
                    [str]:'https://img.hipee.cn/hibreath/default_avar.png'
                })
                Toast.hiddenLoading();
            }
        })

    }

}
/*判断字符串长度*/
function strlen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            len++;
        }
        else {
            len+=2;
        }
    }
    return len;
}
function createNewIm(page){
    let that = page;
    console.log('处理后的rpx',rpx)
    let ctx = wx.createCanvasContext('myCanvas');
    console.log('page.data.bgImg',page.data.bgImg)
    ctx.drawImage(page.data.bgImg, 0, 0, 500, 400);

    //ctx.setTextAlign('center')
    //drawFont(ctx, 14,"今日减重(kg)",110,17);

    //ctx.setTextAlign('left')
    //ctx.setStrokeStyle('#000000')
    if(strlen(page.data.currentSocial.name)<=9){
        drawFont(ctx, 15,page.data.currentSocial.name,80,35);
    }else if(strlen(page.data.currentSocial.name)<=18 && strlen(page.data.currentSocial.name)>9){
        drawFont(ctx, 15,page.data.currentSocial.name.substring(0,9),80,30);
        drawFont(ctx, 15,page.data.currentSocial.name.substring(9,strlen(page.data.currentSocial.name)),80,50);
    }else{
        drawFont(ctx, 15,page.data.currentSocial.name.substring(0,9),80,30);
        drawFont(ctx, 15,page.data.currentSocial.name.substring(9,18),80,50);
        drawFont(ctx, 15,page.data.currentSocial.name.substring(18,strlen(page.data.currentSocial.name)),80,70);
    }

    ctx.drawImage(that.data.currentSocial.imgUrl, 20*rpx, 12*rpx, 50*rpx, 50*rpx);

   /* ctx.beginPath()
    ctx.stroke()*/
    for(let i = 0;i<that.data.shareTaskListImg.length;i++){
        ctx.drawImage(that.data.shareTaskListImg[i], 20*rpx+25*i, 92, 26*rpx, 26*rpx);
    }
    ctx.drawImage(that.data.addImg, 20*rpx+that.data.shareTaskListImg.length*25, 92, 26*rpx, 26*rpx);
    drawFontGray(ctx, 12,page.data.socialMemberInfo.memberCount+'位成员',36*rpx+that.data.shareTaskListImg.length*25,90);
    ctx.drawImage(that.data.hbImg, 20*rpx, 138, 108*rpx,35*rpx);
    drawFontWhite(ctx, 14,'立即加入',53,135);
    console.log('成员已绘制')
    //ctx.draw();
    ctx.draw(true, () => {
        setTimeout(() => {
            savePic(that)
            console.log('我执行了')
        }, 200)

    })
}

function savePic(page) {
    let that = page;
    setTimeout(() => {

        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'myCanvas',
            success: function (res) {
                console.log('res',res.tempFilePath)
                that.setData({
                    shareImg: res.tempFilePath
                })
                Toast.hiddenLoading();
                wx.hideTabBar({
                    fail: function () {
                        setTimeout(function () {
                            wx.hideTabBar()
                        }, 500)
                    }

                });
                that.setData({
                    isSharecomponent: !that.data.isSharecomponent
                });
            }
        })
    },100)

}
module.exports = {
    createNewIm,screenWdith,getImageInfo
};
