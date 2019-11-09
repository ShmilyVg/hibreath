import {UploadUrl} from "../../../utils/config";
import {Toast as toast, Toast, WXDialog} from "heheda-common-view";

/**
 * @Date: 2019-11-08 16:05:43
 * @LastEditors: 张浩玉
 */
var rpx;
function screenWdith(page){
    let that = page;
    wx.getSystemInfo({
        success: function (res) {
            console.log('ressssssssssssssssssssssssss',res)
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
    });
}
function drawFont(ctx,contentSzie,content,contentX,contentY) {
    ctx.setFontSize(contentSzie);
    ctx.setFillStyle("#000000");
    ctx.fillText(content, contentX*rpx, contentY*rpx);
}

function getImageInfo(page) {
    let that = page;
    for(let i = 0;i<that.data.shareTaskList.length;i++){
        wx.getImageInfo({
            src: that.data.shareTaskList[i].imgUrl,
            success: (res) => {
                var str = "shareTaskListImg" + i//重点在这里，组合出一个字符串
                console.log('str',res.path)
                that.setData({
                    [str]:res.path
                })
            }
        })
    }

}

function createNewIm(page){
    let that = page;
    let ctx = wx.createCanvasContext('myCanvas');
    console.log('page.data.bgImg',page.data.bgImg)
    ctx.drawImage(page.data.bgImg, 0, 0, 463*rpx, 370*rpx);
    drawFont(ctx, 13.6,"今日减重(kg)",25,17);
    drawFont(ctx, 13.6,"累计减重(kg)",127,17);
    if(that.data.shareTodayDif){
        ctx.drawImage(that.data.shareTodayDifImg, 26, 30, 12.5*rpx, 18*rpx);
        drawFont(ctx, 45,that.data.shareTodayDif,40,65);
    }else{
        drawFont(ctx, 45,"0",40,65);
    }
    if(that.data.shareTotalDif){
        ctx.drawImage(that.data.shareTotalDifImg, 126, 30, 12.5*rpx, 18*rpx);
        drawFont(ctx, 45,that.data.shareTotalDif,140,65);
    }else{
        drawFont(ctx, 45,'0',140,65);
    }
    if(that.data.shareFat){
        drawFont(ctx, 12,"燃脂情况：",30,100);
        drawFont(ctx, 17,"3.5",90,100);
        ctx.drawImage(that.data.textBg, 120, 85, 74*rpx, 21.5*rpx);
        drawFont(ctx, 12,"状态极佳",140,100);
    }else{
        drawFont(ctx, 12,"燃脂情况：",50,100);
        drawFont(ctx, 17,"未打卡",110,100);
    }
    console.log('that.data.shareTaskListImg2222222',that.data.shareTaskListImg1)
    if(that.data.shareTaskListImg3){
        ctx.drawImage(that.data.shareTaskListImg0, 10, 130, 44*rpx, 46.5*rpx);
        ctx.drawImage(that.data.shareTaskListImg1, 65,130, 44*rpx, 46.5*rpx);
        ctx.drawImage(that.data.shareTaskListImg2, 120,130, 44*rpx, 46.5*rpx);
        ctx.drawImage(that.data.shareTaskListImg3, 175,130, 44*rpx, 46.5*rpx);
    }

    //ctx.draw();
    ctx.draw(true, () => {
        setTimeout(() => {
            savePic(that)
        }, 1000)

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
                /*util.savePicToAlbum(res.tempFilePath)*/
            }
        })
    },100)

}
module.exports = {
    createNewIm,screenWdith,getImageInfo
};
