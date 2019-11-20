import {UploadUrl} from "../../../utils/config";
import {Toast as toast, Toast, WXDialog} from "heheda-common-view";

/**
 * @Date: 2019-11-08 16:05:43
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
    /*wx.getSystemInfo({
       success: function (res) {
          rpx = res.windowWidth/414;
           if(rpx>=1){
               that.setData({
                   windowWidth: res.windowWidth,
                   canvasHeight:0.8*(res.windowWidth),
                   pixelRatio:res.pixelRatio
               });
           }else{
               rpx = 500/414;
               that.setData({
                   windowWidth: 500,
                   canvasHeight:400,
                   pixelRatio:res.pixelRatio
               });
           }

        }
    });*/
}
function drawFont(ctx,contentSzie,content,contentX,contentY) {
    ctx.setFontSize(contentSzie);
    ctx.setFillStyle("#000000");
    ctx.fillText(content, contentX*rpx, contentY*rpx);
}

function getImageInfo(page) {
    let that = page;
    that.setData({
        shareTaskListImg:[]
    })
    for(let i = 0;i<that.data.shareTaskList.length;i++){
        wx.getImageInfo({
            src: that.data.shareTaskList[i].imgUrl,
            success: (res) => {
                var str = "shareTaskListImg" + i//组合出一个字符串
                console.log('str',res.path)
                that.setData({
                    [str]:res.path
                })
                that.data.shareTaskListImg.push(res.path)
                console.log('that.data.shareTaskListImg',that.data.shareTaskListImg)
                if(that.data.shareTaskListImg.length === that.data.shareTaskList.length ){
                    setTimeout(() => {
                        createNewIm(that)
                    },500)
                }
            },
            fail(res){
                console.log('set-info/shared', res);
                Toast.hiddenLoading();
                Toast.showText('分享失败，请重试');
            }
        })
       /* console.log('that.data.shareTaskListImg3',that.data.shareTaskListImg3)*/
       /* if(i == that.data.shareTaskList.length-1){
            setTimeout(() => {
                createNewIm(that)
            },1000)
        }*/
    }



}

function createNewIm(page){
    let that = page;
    console.log('处理后的rpx',rpx)
    let ctx = wx.createCanvasContext('myCanvas');
    console.log('page.data.bgImg',page.data.bgImg)
    ctx.drawImage(page.data.bgImg, 0, 0, 500, 400);
    ctx.setTextAlign('center')
    drawFont(ctx, 14,"今日减重(kg)",110,17);
    //drawFont(ctx, 13.6,"累计减重(kg)",127,17);
    if(that.data.shareTodayDif){
        if(that.data.shareTodayDif>=0){
            drawFont(ctx, 45,that.data.shareTodayDif,104,60);
            const metrics = ctx.measureText(that.data.shareTodayDif).width
            if(that.data.shareTodayDif<10){
                ctx.drawImage(that.data.shareDown, (90+metrics)*rpx, 30*rpx, 12.5*rpx, 18*rpx);
            }else{
                ctx.drawImage(that.data.shareDown, (65+metrics)*rpx, 30*rpx, 12.5*rpx, 18*rpx);
            }

        }else{
            drawFont(ctx, 45,Math.abs(that.data.shareTodayDif),104,60);
            const metrics = ctx.measureText(Math.abs(that.data.shareTodayDif)).width
            if(Math.abs(that.data.shareTodayDif)<10){
                ctx.drawImage(that.data.shareUp, (90+metrics)*rpx, 30*rpx, 12.5*rpx, 18*rpx);
            }else{
                ctx.drawImage(that.data.shareUp, (65+metrics)*rpx, 30*rpx, 12.5*rpx, 18*rpx);
            }

        }

    }else{
        ctx.drawImage(that.data.shareDown, 115*rpx, 30*rpx, 12.5*rpx, 18*rpx);
        drawFont(ctx, 45,"0",104,60);
    }
  /*  if(that.data.shareTotalDif){
        if(that.data.shareTotalDif>=0){
            drawFont(ctx, 45,that.data.shareTotalDif,144,60);
        }else{
            drawFont(ctx, 45,Math.abs(that.data.shareTotalDif),144,60);
        }
    }else{
        drawFont(ctx, 45,'0',144,60);
    }*/
    ctx.setTextAlign('left')
    if(that.data.shareFat){
        drawFont(ctx, 11,"燃脂指数:",19,100);
        ctx.drawImage(that.data.textBg, 60*rpx, 88*rpx, 9*rpx, 13*rpx);
        drawFont(ctx, 18,that.data.shareFat,75,100);
        /*drawFont(ctx, 12,that.data.shareFatBurnDesc,140,100);*/
    }else{
        drawFont(ctx, 11,"燃脂指数:",19,100);
        drawFont(ctx, 15,"未打卡",60,100);
    }
    drawFont(ctx, 11,"累计减重:",115,100);
    if(that.data.shareTotalDif){
        if(that.data.shareTotalDif>=0){
            drawFont(ctx, 18,that.data.shareTotalDif,160,100);
        }else{
            drawFont(ctx, 18,Math.abs(that.data.shareTotalDif),160,100);
        }
    }else{
        drawFont(ctx, 18,'0',160,100);
    }
    ctx.setStrokeStyle('#A0A0A0')
    ctx.beginPath()
    ctx.moveTo(that.data.windowWidth/4, 110)
    ctx.lineTo(that.data.windowWidth/4, 122)
    ctx.stroke()
    for(let i = 0;i<that.data.shareTaskList.length;i++){
        console.log('that.data.shareTaskListImg+i',that.data.shareTaskListImg[0])
        ctx.drawImage(that.data.shareTaskListImg[i], 17.5+55*i, 140, 43*rpx, 43*rpx);
    }
    console.log('底部图标已绘制')
    //ctx.draw();
    ctx.draw(true, () => {
        setTimeout(() => {
            savePic(that)
        }, 200)

    })
}

function savePic(page) {
    let that = page;
    console.log('kuandu',that.data.windowWidth)
    console.log('gaodu',that.data.canvasHeight)
    setTimeout(() => {
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
          /*  destWidth: that.data.windowWidth* that.data.pixelRatio,
            destHeight: that.data.windowWidth * that.data.pixelRatio,*/
          /*  width:1000,
            height:800,
            destWidth:1000,
            destHeight:800,*/
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
                    isOpened:true
                })
                that.setData({
                    actionSheetHidden: !that.data.actionSheetHidden
                });
                /*util.savePicToAlbum(res.tempFilePath)*/
            }
        })
    },100)

}
module.exports = {
    createNewIm,screenWdith,getImageInfo
};
