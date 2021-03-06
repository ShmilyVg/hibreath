let charts = require('./wxcharts');

let _page = null;
let _data = null;
let lineChart = null;
let trendData = {};


function init(page) {
    _page = page;
    _data = page.data;
}

function setData(data, widthRpx) {
    trendData = data;
    normalTrend(widthRpx);
}

function initTouchHandler() {
    _page.touchHandler = function (e) {
        lineChart.scrollStart(e);
    };

    _page.moveHandler = function (e) {
        if (e) {
            lineChart.scroll(e);
        }
    };

    _page.touchEndHandler = function (e) {
        lineChart.scrollEnd(e);
        lineChart.showToolTip(e, {
            format: function (item) {
                return item.data
            }
        });
    };
}

function normalTrend(widthRpx) {
    let windowWidth = 370;
    let windowHeight = 200;
    try {
        let {windowWidth: sysWidth} = wx.getSystemInfoSync(), pixelRatio = 750 / sysWidth;

        windowWidth = 370 * ((widthRpx / pixelRatio) || sysWidth) / 375;
        windowHeight = 200 * windowWidth / 370;
    } catch (e) {
        // do something when get system info failed
        console.error(e);
    }

  const { dataListX, dataListY, dataListY1Name, dataListY2, dataListY2Name, yAxisSplit, showLegend, color, legend=true} = trendData;
  let bg_color = color || '#9fe79c';
    const series = [{
        name: dataListY1Name,
        data: dataListY,
        color: bg_color,
        format: function (val) {
            return val;
        }
    }];
    if (dataListY2 && dataListY2.length) {
        series.push({
            name: dataListY2Name,
            data: dataListY2,
            color: '#18D1B9',
            format: function (val) {
                return val;
            }
        });
    }
    lineChart = new charts({
        canvasId: 'lineCanvas',
        type: 'area',
        lineStyle: 'curve',
        categories: dataListX,
        series,
        legend: showLegend,
        yAxis: {
            format: function (val) {
                return val;
            },
            min: 0,
            fontColor: '#9B9B9B'
        },
        xAxis: {
            fontColor: '#9B9B9B'
        },
        extra: {
            legendTextColor: '#666666',
        },
        width: windowWidth,
        height: windowHeight,
        enableScroll: true,
        dataLabel: false,
        haveNum: true,
        legend,
        yAxisSplit: yAxisSplit - 1,
        animation: false
    });
}

module.exports = {
    init: init,
    initTouchHandler: initTouchHandler,
    setData: setData,
};
