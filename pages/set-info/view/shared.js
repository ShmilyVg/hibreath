import {UploadUrl} from "../../../utils/config";

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
        console.log('iiiiiiiiiii',i)
        wx.getImageInfo({
            src: page.data.shareTaskList[i].imgUrl,
            complete: (res) => {
                console.log('ressss11111',res)
                var str = "shareTaskListImg[" + i + "]"//重点在这里，组合出一个字符串
                console.log('i',i)
                console.log(str,'strstrstrstrstrstrstr')
                page.setData({
                    [str]:res.path
                })
                console.log('22222',page.data.shareTaskListImg)
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
    /*  for(var i = 0;i<that.data.shareTaskList.length;i++){
         console.log('00',that.data.shareTaskList[i].imgUrl)
        ctx.drawImage(that.data.fatImg, 10, 130, 44, 46.5);
         ctx.drawImage(that.data.weightImg, 65,130, 44, 46.5);
         ctx.drawImage(that.data.foodImg, 120,130, 44, 46.5);
         ctx.drawImage(that.data.sportImg, 175,130, 44, 46.5);
        ctx.drawImage(that.data.shareTaskList[i].imgUrl, 10+55*[i], 130, 44, 46.5);
    }*/
    console.log('shareTaskList111',that.data.shareTaskListImg)
    ctx.drawImage(that.data.shareTaskListImg[0], 10, 130, 44, 46.5);
    ctx.drawImage(that.data.shareTaskListImg[1], 65,130, 44, 46.5);
    ctx.drawImage(that.data.shareTaskListImg[2], 120,130, 44, 46.5);
    ctx.drawImage(that.data.shareTaskListImg[3], 175,130, 44, 46.5);
    ctx.draw();
}

function savePic(page) {
    let that = page;
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
            /*util.savePicToAlbum(res.tempFilePath)*/
           /* wx.uploadFile({
                url: UploadUrl,
                filePath: res.tempFilePath,
                name: res.tempFilePath,
                success(res) {
                    console.log('ressssss',that)
                    var obj = JSON.parse(res.data)
                    that.setData({
                        shareImg: obj.result.img_url
                    })
                    console.log('tempFilePath',that.data.shareImg)
                }
            })*/
        }
    })
}
module.exports = {
    createNewIm,screenWdith,savePic,getImageInfo
};
