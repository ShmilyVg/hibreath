// pages/result/result.js
/**
 * @Date: 2019-09-23 14:30:30
 * @LastEditors: 张浩玉
 */
import * as tools from "../../utils/tools";
import Protocol from "../../modules/network/protocol";
import toast from "../../view/toast";
import HiNavigator from "../../navigator/hi-navigator";
var ctx = wx.createCanvasContext("dashboard"); //创建一个全局的canvas绘图上下文
var bg = wx.createCanvasContext("bg");
var w = "";
var h = "";
Page({
    data: {
        score: 6.5, //传入的进度， 0~100，绘制到此参数处停止。
        currenttab:'0'
    },
    selectTab:function(e){
        //切换标签页
        console.log(e.currentTarget.dataset.tabid)
        var newtab=e.currentTarget.dataset.tabid;
        if(this.data.currenttab===newtab){
            return
        }else{
            this.setData({
                currenttab:newtab
            })
        }
    },
    run(e) {
        let that = this;
        const circleScore = that.data.score*10
        var gradient = ctx.createLinearGradient(0, 0, 125, 0);
        console.log('2', 20 < circleScore <= 40)
        if (circleScore <= 20) {
            gradient.addColorStop("0", "#542EE3");
            gradient.addColorStop("0.2", "#250099");
        } else if (20 < circleScore && circleScore<= 40) {
            gradient.addColorStop("0", "#0026FE");
            gradient.addColorStop("0.4", "#00CFFF");
        } else if (40 < circleScore && circleScore<= 60) {
            gradient.addColorStop("0", "#20D9D1");
            gradient.addColorStop("0.6", "#00B96C");
        } else if (60 < circleScore && circleScore <= 80) {
            gradient.addColorStop("0", "#FFE300");
            gradient.addColorStop("0.8", "#FF9F00");
        } else {
            gradient.addColorStop("0", "#FF8F00");
            gradient.addColorStop("1", "#EF2511");
        }

        const drawCircle = (target, start, end, color) => {
            //arc 圆心的X坐标  Y坐标  半径  起始弧度  终止弧度 是否逆时针
            target.arc(100, 100, 95, start * Math.PI / 180, end * Math.PI / 180);
            target.setStrokeStyle(color);
            target.setLineWidth("5");
            //计算公式 （2ΠR*3/4-40）/5
            target.setLineDash([81.535, 10], 0);
            target.setLineCap("round");
            target.stroke();
            // target.draw();
        }

        var parts = [
            {
                r: [0, 100],
                s: -225,
                e: 45
            }
        ];

        var fillGrid = (target, grid, color, val) => {
            for (let i in grid) {
                let p = grid[i];
                if (val >= p.r[0]) {
                    drawCircle(target, p.s, p.e, color);
                }
            }
        }

        var deal = val => {
            var result = [];
            result.push(
                {
                    r: [0, val],
                    s: -225,
                    e: val * 54 / 20 - 225
                }
            )
            return result;
        }

        var setPercent2 = val => {
            ctx.clearRect(0, 0, 250, 250);
            var pt = deal(val);

            fillGrid(ctx, pt, gradient, val);
            ctx.setFontSize(23);
            ctx.setFillStyle("#292930");
            var offset = 150;
            ctx.fillText(val/10, offset, 85);
            ctx.setFontSize(17);
          /*  if (circleScore <= 20) {
                ctx.fillText("继续努力", 70, 165);
            } else if (20 < circleScore && circleScore <= 40) {
                ctx.fillText("缓慢燃脂", 70, 165);
            } else if (40 < circleScore && circleScore <= 60) {
                ctx.fillText("状态极佳", 70, 165);
            } else if (60 < circleScore && circleScore <= 80) {
                ctx.fillText("快速燃脂", 70, 165);
            } else {
                ctx.fillText("过度燃脂", 70, 165);
            }
            ctx.setFontSize(12);
            ctx.setFillStyle("#969696");
            if (circleScore <= 20) {
                ctx.fillText("KEEP ON", 70, 185);
            } else if (20 < circleScore && circleScore <= 40) {
                ctx.fillText("SLOW", 70, 185);
            } else if (40 < circleScore && circleScore <= 60) {
                ctx.fillText("PROPER", 70, 185);
            } else if (60 < circleScore && circleScore <= 80) {
                ctx.fillText("FAST", 70, 185);
            } else {
                ctx.fillText("UNDUE", 70, 185);
            }*/
            ctx.draw();
        }

        fillGrid(bg, parts, '#DCDCDC', 100);
        bg.draw();

        var percent = 0;
        var lastFrameTime = 0;
        // 模拟 requestAnimationFrame
        var doAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastFrameTime));
            var id = setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            lastFrameTime = currTime + timeToCall;
            return id;
        };
        // 模拟 cancelAnimationFrame
        var abortAnimationFrame = function (id) {
            clearTimeout(id)
        }
        var animation = v => {
            var transform = val => {
                percent += percent > v ? -1 : 1;
                let ani = doAnimationFrame(() => {
                    transform(v);
                })
                setPercent2(percent);
                if (percent === v) {
                    abortAnimationFrame(ani);
                    return;
                }
            }
            transform(v)
        }
        animation(this.data.score*10);
        /* setInterval(() => {
           //var round = Math.round(100 * Math.random());
            var round =60;
           animation(round);
         }, 2500);*/
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        this.run()
        this.showType()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.createSelectorQuery().select('#canvas-one').boundingClientRect(function (rect) {//监听canvas的宽高
            console.log(rect);
            w = parseInt(rect.width / 2);
            // 获取canvas宽的的一半
            h = parseInt(rect.height / 2);
            //获取canvas高的一半，
            //获取宽高的一半是为了便于找到中心点
            console.log(w, "w")
            console.log(h, "h")
            //arc 圆心的X坐标  Y坐标  半径  起始弧度  终止弧度 是否逆时针
        }).exec()
    },
    toBind(){
        HiNavigator.navigateToDeviceBind();
    },
    toIndex(){
        HiNavigator.navigateIndex();
    },
    showType(){
        if(this.data.score<=2){
            this.setData({
                fatType:"../../images/result/type1.png",
                fatText:"继续努力",
                fatTextEn:"KEEP ON"
            })
        }else if(this.data.score<=4 &&this.data.score>2){
            this.setData({
                fatType:"../../images/result/type2.png",
                fatText:"缓慢燃脂",
                fatTextEn:"SLOW"
            })
        }else if(this.data.score<=6 &&this.data.score>4){
            this.setData({
                fatType:"../../images/result/type3.png",
                fatText:"状态极佳",
                fatTextEn:"PROPER"
            })
        }else if(this.data.score<=8 &&this.data.score>6){
            this.setData({
                fatType:"../../images/result/type4.png",
                fatText:"快速燃脂",
                fatTextEn:"FAST"
            })
        }else if(this.data.score<=10 &&this.data.score>8){
            this.setData({
                fatType:"../../images/result/type5.png",
                fatText:"过度燃脂",
                fatTextEn:"UNDUE"
            })
        }
    }
})

