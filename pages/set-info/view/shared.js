import {UploadUrl} from "../../../utils/config";
import {Toast as toast, Toast, WXDialog} from "heheda-common-view";

/**
 * @Date: 2019-11-08 16:05:43
 * @LastEditors: 张浩玉
 */

function screenWdith(page){
    let that = page;
    wx.getSystemInfo({
        success: function (res) {
            that.setData({
                windowWidth: res.windowWidth,
                windowHeight: res.windowHeight,
                canvasHeight:0.8*(res.windowWidth),
                _xWidth:res.windowWidth/375

            });
        }
    });
}
function drawFont(ctx,contentSzie,content,contentX,contentY) {
    ctx.setFontSize(contentSzie);
    ctx.setFillStyle("#000000");
    ctx.fillText(content, contentX, contentY);
}

function getImageInfo(page) {
    for(let i = 0;i<page.data.shareTaskList.length;i++){
        wx.getImageInfo({
            src: page.data.shareTaskList[i].imgUrl,
            complete: (res) => {
                var str = "shareTaskListImg[" + i + "]"//重点在这里，组合出一个字符串
                page.setData({
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
    ctx.drawImage(page.data.bgImg, 0, 0, 231.5, 185);
    drawFont(ctx, 13.6,"今日减重(kg)",25,17);
    drawFont(ctx, 13.6,"累计减重(kg)",127,17);
    ctx.drawImage(that.data.shareTodayDifImg, 26, 30, 12.5, 18);
    drawFont(ctx, 45,"3.5",40,65);
    ctx.drawImage(that.data.shareTotalDifImg, 126, 30, 12.5, 18);
    drawFont(ctx, 45,"6.5",140,65);
    drawFont(ctx, 12,"燃脂情况：",30,100);
    drawFont(ctx, 17,"3.5",90,100);
    ctx.drawImage(that.data.textBg, 120, 85, 74, 21.5);
    drawFont(ctx, 12,"状态极佳",140,100);
    ctx.drawImage(that.data.shareTaskListImg[0], 10, 130, 44, 46.5);
    ctx.drawImage(that.data.shareTaskListImg[1], 65,130, 44, 46.5);
    ctx.drawImage(that.data.shareTaskListImg[2], 120,130, 44, 46.5);
    ctx.drawImage(that.data.shareTaskListImg[3], 175,130, 44, 46.5);
    ctx.draw(true, () => {
        setTimeout(() => {
            savePic(that)
        }, 600)

    })
}

function savePic(page) {
    let that = page;
    console.log('kuandu',that.data.windowWidth)
    console.log('gaodu',that.data.canvasHeight)
    wx.canvasToTempFilePath({
        x: 20,
        y: 0,
        width: that.data.windowWidth,
        height: that.data.canvasHeight,

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
}
module.exports = {
    createNewIm,screenWdith,savePic,getImageInfo
};
