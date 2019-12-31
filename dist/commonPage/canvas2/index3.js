'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
var app = getApp();
var UpLoad = require('../upLoad');
var start = null;
var moveYT = null;
var moveXT = null;
var x = null;
var y = null;
var changeIndex = 0;
var canChoose = true;
// let beforeIndex = -1
var tapTime = null;
var chooseArea = {};
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      bgc: 'url(https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/2.png)'
    },
    imgArr: [{
      src: '',
      scale: 1,
      rotate: 0
    }],
    operationArr: {
      chooseIndex: 0,
      tab: [{
        t: '画框',
        img: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvasType_2.png',
        imgChoose: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvasType_1_choose.png',
        sliderText: '缩放',
        currentSlider: 0,
        minSlider: 0,
        maxSlider: 100
      }, {
        t: '卡纸',
        img: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvasType_2.png',
        imgChoose: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvasType_1_choose.png',
        sliderText: '宽度',
        currentSlider: 0,
        minSlider: 0,
        maxSlider: 20
      }, {
        t: '局条',
        img: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvasType_2.png',
        imgChoose: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvasType_1_choose.png',
        sliderText: '宽度',
        currentSlider: 0,
        minSlider: 0,
        maxSlider: 3
      }]
    },
    tabBorderArr: ['关注', '推荐', '热议', '视频', '关注', '推荐', '热议', '视频'],
    canUseWidth: 100,
    canUseHeight: 100,
    positionLeft: 250,
    positionTop: 150,
    positionLeftShow: 0,
    positionTopShow: 0,
    borderImg: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvas_border.jpg',
    tabArr: [{
      src: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvas_bottom_0.jpg',
      oX: 750 / 2,
      oY: 750 / 2,
      oW: 200,
      oH: 250
    }],
    bottomImage: {
      src: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvas_bottom_0.jpg',
      showImgArr: [{
        oX: 750 / 2 - 100,
        oY: 750 / 2 - 175,
        oW: 200,
        oH: 250
      }]
    },
    tabIndex: null,
    tabBorderIndex: -1,
    chooseAreaInfo: {
      path: 'https://c.jiangwenqiang.com/api/logo.jpg',
      x: 0,
      y: 0,
      w: 100,
      h: 100,
      imgW: 375,
      imgH: 375
    }
  },
  sliderChanging: function sliderChanging(e) {
    var _setData;

    this.setData((_setData = {}, _defineProperty(_setData, 'operationArr.tab[' + this.data.operationArr.chooseIndex + '].currentSlider', e.detail.value), _defineProperty(_setData, 'imgArr[0].scale', this.data.operationArr.chooseIndex <= 0 ? 12 - Math.floor(e.detail.value / 10) : this.data.imgArr[0].scale), _setData));
  },
  chooseType: function chooseType(e) {
    this.setData(_defineProperty({}, 'operationArr.chooseIndex', e.currentTarget.dataset.index));
  },
  _toggleMask: function _toggleMask(e) {
    var _this = this,
        _setData4;

    var type = e.currentTarget.dataset.type;
    var animate = type + 'Animate';
    if (this.data[type]) {
      this.setData(_defineProperty({}, animate, !this.data[animate]));
      setTimeout(function () {
        _this.setData(_defineProperty({}, type, !_this.data[type]));
      }, 900);
      return;
    }
    this.setData((_setData4 = {}, _defineProperty(_setData4, animate, !this.data[animate]), _defineProperty(_setData4, type, !this.data[type]), _setData4));
  },
  chooseIndex: function chooseIndex(e) {
    var _this2 = this;

    if (!canChoose) return;
    if (e.currentTarget.dataset.type === 'bgc') {
      if (this.data.tabIndex === e.currentTarget.dataset.index) return;
      canChoose = false;
      this.setData({
        tabIndex: e.currentTarget.dataset.index
      }, function () {
        _this2.getBackImageInfo('' + _this2.data.bottomImage.src);
      });
    } else {
      canChoose = false;
      this.setData({
        tabBorderIndex: e.currentTarget.dataset.index
      }, function () {
        _this2.setBorder();
      });
    }
  },
  itemStart: function itemStart(e) {
    if (e.touches.length < 2) tapTime = e.timeStamp;
    changeIndex = e.currentTarget.dataset.index;
    // beforeIndex = beforeIndex < - 1 ? this.data.imgArr[changeIndex].zIndex : beforeIndex
    // this.setData({
    //   [`imgArr[${changeIndex}].zIndex`]: 20
    // })
  },
  itemEnd: function itemEnd(e) {
    if (e.touches.length >= 2) return;
    var that = this;
    if (e.timeStamp - tapTime < 100) {
      tapTime = 0;
      wx.showActionSheet({
        itemList: that.data.imgArr.length >= 2 ? ['替换图片', '垂直放置', '水平放置', '复位', '裁切图片', '删除图片'] : ['替换图片', '垂直放置', '水平放置', '复位', '裁切图片'],
        success: function success(res) {
          if (res.tapIndex === 0) {
            wx.chooseImage({
              count: 1,
              success: function success(img) {
                that.fixImg(img.tempFilePaths[0]);
              }
            });
          } else if (res.tapIndex === 5) {
            that.data.imgArr.splice(changeIndex, 1);
            that.setData({
              imgArr: that.data.imgArr
            });
          } else if (res.tapIndex === 2) {
            that.setData({
              reload: true
            });
            that.setData(_defineProperty({}, 'imgArr[' + changeIndex + '].rotate', 0), function () {
              setTimeout(function () {
                that.setData({
                  reload: false
                });
              }, 530);
            });
          } else if (res.tapIndex === 1) {
            that.setData({
              reload: true
            });
            that.setData(_defineProperty({}, 'imgArr[' + changeIndex + '].rotate', 90), function () {
              setTimeout(function () {
                that.setData({
                  reload: false
                });
              }, 530);
            });
          } else if (res.tapIndex === 3) {
            var _that$setData3;

            that.setData({
              reload: true
            });
            that.setData((_that$setData3 = {}, _defineProperty(_that$setData3, 'imgArr[' + changeIndex + '].rotate', 0), _defineProperty(_that$setData3, 'imgArr[' + changeIndex + '].scale', 1), _defineProperty(_that$setData3, 'imgArr[' + changeIndex + '].left', that.data.backImageInfo.sX), _defineProperty(_that$setData3, 'imgArr[' + changeIndex + '].top', that.data.backImageInfo.sY), _that$setData3), function () {
              setTimeout(function () {
                that.setData({
                  reload: false
                });
              }, 530);
            });
          } else if (res.tapIndex === 4) {
            that.fixImg(that.data.imgArr[changeIndex].path);
          }
        }
      });
    }
  },
  touchStart: function touchStart(e) {
    start = e.touches;
    if (e.touches.length <= 1) {
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
      moveYT = this.data.imgArr[changeIndex].top;
      moveXT = this.data.imgArr[changeIndex].left;
    } else if (e.touches.length <= 2) {
      start = e.touches;
    } else {
      app.toast({ content: '囧，小主人的手指太灵活了，无法识别呢，请双指或单指操作' });
    }
  },
  touchMove: function touchMove(e) {
    if (e.touches.length <= 1 && start.length <= 1) {
      var _setData5;

      this.setData((_setData5 = {}, _defineProperty(_setData5, 'imgArr[' + changeIndex + '].left', moveXT + (e.touches[0].pageX - x)), _defineProperty(_setData5, 'imgArr[' + changeIndex + '].top', moveYT + (e.touches[0].pageY - y)), _setData5));
    } else if (e.touches.length <= 2) {
      var _setData6;

      if (start.length < 1) start = e.touches;
      var now = e.touches;
      var scale = (this.getDistance(now[0], now[1]) / this.getDistance(start[0], start[1])).toFixed(1);
      var rotate = (this.getAngle(now[0], now[1]) - this.getAngle(start[0], start[1])).toFixed(1);
      this.setData((_setData6 = {}, _defineProperty(_setData6, 'imgArr[' + changeIndex + '].scale', scale > 2 ? 2 : scale < 1 ? 1 : scale), _defineProperty(_setData6, 'imgArr[' + changeIndex + '].rotate', rotate), _setData6));
    }
  },
  touchEnd: function touchEnd() {
    // this.setData({
    //   [`imgArr[${changeIndex}].zIndex`]: beforeIndex
    // })
  },
  longpress: function longpress(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function success(res) {
        that.data.imgArr[e.currentTarget.dataset.index].src = res.tempFilePaths[0];
        that.getItemImageInfo(e.currentTarget.dataset.index, true);
      }
    });
  },
  getDistance: function getDistance(p1, p2) {
    var x = p2.pageX - p1.pageX;
    var y = p2.pageY - p1.pageY;
    return Math.sqrt(x * x + y * y);
  },
  getAngle: function getAngle(p1, p2) {
    var x = p1.pageX - p2.pageX;
    var y = p1.pageY - p2.pageY;
    return Math.atan2(y, x) * 180 / Math.PI;
  },
  upload: function upload() {
    new UpLoad({ imgArr: 'imgArr' }).chooseImage();
  },
  checkAll: function checkAll() {
    if (new UpLoad({ imgArr: 'imgArr' }).checkAll()) {}
  },
  imgOp: function imgOp(e) {
    new UpLoad({ imgArr: e.currentTarget.dataset.img, index: e.currentTarget.dataset.index }).imgOp();
  },
  getBackImageInfo: function getBackImageInfo(src) {
    var that = this;
    wx.showLoading({
      title: '加载底图中',
      mask: true
    });
    wx.getImageInfo({
      src: src,
      success: function success(res) {
        wx.hideLoading();
        var backImageInfo = {
          oWidth: res.width,
          oHeight: res.height,
          path: res.path,
          showWidth: app.data.system.windowWidth,
          showHeight: app.data.system.windowWidth * res.height / res.width,
          zIndex: 1,
          sX: app.data.system.windowWidth * that.data.tabArr[that.data.tabIndex].oX / res.width,
          sY: app.data.system.windowWidth * res.height / res.width * that.data.tabArr[that.data.tabIndex].oY / res.height,
          imgWidth: app.data.system.windowWidth * that.data.tabArr[that.data.tabIndex].oW / res.width,
          imgHeight: that.data.tabArr[that.data.tabIndex].oH / that.data.tabArr[that.data.tabIndex].oW * (app.data.system.windowWidth * that.data.tabArr[that.data.tabIndex].oW / res.width)
        };
        that.setData({
          backImageInfo: backImageInfo
        }, setTimeout(function () {
          that.getItemImageInfo(0);
        }), 50);
      }
    });
  },
  getItemImageInfo: function getItemImageInfo(index) {
    var change = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var that = this;
    wx.showLoading({
      title: '加载图片中',
      mask: true
    });
    wx.getImageInfo({
      src: that.data.imgArr[index].src,
      success: function success(res) {
        var _that$setData4;

        wx.hideLoading();
        var useWidth = res.width > res.height;
        that.setData((_that$setData4 = {
          cutImg: false
        }, _defineProperty(_that$setData4, 'imgArr[' + index + '].oWidth', res.width), _defineProperty(_that$setData4, 'imgArr[' + index + '].oHeight', res.height), _defineProperty(_that$setData4, 'imgArr[' + index + '].showWidth', (useWidth ? that.data.backImageInfo.imgWidth : that.data.backImageInfo.imgHeight * res.width / res.height) / 10), _defineProperty(_that$setData4, 'imgArr[' + index + '].showHeight', (!useWidth ? that.data.backImageInfo.imgHeight : that.data.backImageInfo.imgWidth * res.height / res.width) / 10), _defineProperty(_that$setData4, 'imgArr[' + index + '].path', res.path), _defineProperty(_that$setData4, 'imgArr[' + index + '].left', that.data.backImageInfo.sX - (useWidth ? that.data.backImageInfo.imgWidth : that.data.backImageInfo.imgHeight * res.width / res.height) / 10 / 2), _defineProperty(_that$setData4, 'imgArr[' + index + '].top', that.data.backImageInfo.sY - (!useWidth ? that.data.backImageInfo.imgHeight : that.data.backImageInfo.imgWidth * res.height / res.width) / 10 / 2), _defineProperty(_that$setData4, 'imgArr[' + index + '].zIndex', index + 1), _defineProperty(_that$setData4, 'imgArr[' + index + '].rotate', 0), _defineProperty(_that$setData4, 'imgArr[' + index + '].scale', 12), _that$setData4), function () {
          canChoose = true;
          change ? '' : index >= that.data.imgArr.length - 1 ? '' : that.getItemImageInfo(index + 1);
        });
      }
    });
  },
  fixImg: function fixImg(src) {
    var that = this;
    wx.showLoading({
      title: '获取图片信息'
    });
    wx.getImageInfo({
      src: src,
      success: function success(res) {
        wx.hideLoading();
        that.setData({
          chooseAreaInfo: {
            path: res.path,
            x: that.data.backImageInfo.sX,
            y: that.data.backImageInfo.sY,
            w: that.data.backImageInfo.imgWidth,
            h: that.data.backImageInfo.imgHeight,
            imgW: that.data.backImageInfo.showWidth,
            imgH: res.height * that.data.backImageInfo.showWidth / res.width
          },
          cutImg: true
        });
      }
    });
  },

  // canvas 绘图
  canvasDraw: function canvasDraw() {
    var _this3 = this;

    wx.showLoading({
      title: '疯狂生成中',
      mask: true
    });
    var ctx = wx.createCanvasContext('outPic', this);
    var that = this;
    ctx.setFillStyle('white');
    ctx.fillRect(0, 0, that.data.backImageInfo.showWidth * 2, that.data.backImageInfo.showHeight * 2);
    if (that.data.backImageInfo.zIndex <= 1) {
      ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.backImageInfo.showWidth * 2, that.data.backImageInfo.showHeight * 2);
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = that.data.imgArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        ctx.save();
        ctx.translate(v.left * 2 + v.showWidth, v.top * 2 + v.showHeight);
        ctx.rotate(v.rotate * Math.PI / 180);
        ctx.drawImage(v.path, -(v.showWidth * v.scale), -(v.showHeight * v.scale), v.showWidth * v.scale * 2, v.showHeight * v.scale * 2);
        if (v.border) {
          // 左上角
          ctx.translate(-v.showWidth * v.scale, -v.showHeight * v.scale);
          ctx.rotate(45 * Math.PI / 180);
          ctx.drawImage(v.border.path, -(v.border.width * v.scale), -(v.border.width * v.scale), v.border.width * v.scale * 2, v.border.width * v.scale * 2);
          ctx.rotate(-45 * Math.PI / 180);
          ctx.translate(v.showWidth * 2 * v.scale, 0);
          ctx.rotate(135 * Math.PI / 180);
          ctx.drawImage(v.border.path, -(v.border.width * v.scale), -(v.border.width * v.scale), v.border.width * v.scale * 2, v.border.width * v.scale * 2);
          ctx.rotate(-135 * Math.PI / 180);
          ctx.translate(0, v.showHeight * 2 * v.scale);
          ctx.rotate(225 * Math.PI / 180);
          ctx.drawImage(v.border.path, -(v.border.width * v.scale), -(v.border.width * v.scale), v.border.width * v.scale * 2, v.border.width * v.scale * 2);
          ctx.rotate(-225 * Math.PI / 180);
          ctx.translate(-v.showWidth * 2 * v.scale, 0);
          ctx.rotate(315 * Math.PI / 180);
          ctx.drawImage(v.border.path, -(v.border.width * v.scale), -(v.border.width * v.scale), v.border.width * v.scale * 2, v.border.width * v.scale * 2);
          ctx.rotate(-315 * Math.PI / 180);
          ctx.translate(v.showWidth * v.scale, -v.showHeight * v.scale);
          ctx.drawImage(v.path, -(v.showWidth * v.scale), -(v.showHeight * v.scale), v.showWidth * v.scale * 2, v.showHeight * v.scale * 2);
        }
        ctx.restore();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (that.data.backImageInfo.zIndex >= 10) {
      ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.backImageInfo.showWidth * 2, that.data.backImageInfo.showHeight * 2);
    }
    ctx.draw();
    setTimeout(function () {
      _this3.outImageDouble();
    }, 300);
  },

  // canvas 裁切图片
  canvasCut: function canvasCut() {
    wx.showLoading({
      title: '图片裁切中',
      mask: true
    });
    var ctx = wx.createCanvasContext('outPic', this);
    var that = this;
    ctx.clearRect(0, 0, that.data.chooseAreaInfo.imgW * 2, that.data.chooseAreaInfo.imgH * 2);
    ctx.drawImage(that.data.chooseAreaInfo.path, 0, 0, that.data.chooseAreaInfo.imgW * 2, that.data.chooseAreaInfo.imgH * 2);
    ctx.draw();
    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: that.data.chooseAreaInfo.x * 2,
        y: that.data.chooseAreaInfo.y * 2,
        width: that.data.chooseAreaInfo.w * 2,
        height: that.data.chooseAreaInfo.h * 2,
        destWidth: that.data.chooseAreaInfo.w * 2,
        destHeight: that.data.chooseAreaInfo.h * 2,
        canvasId: 'outPic',
        success: function success(res) {
          wx.hideLoading();
          // console.log(res.tempFilePath)
          that.data.imgArr[changeIndex].src = res.tempFilePath;
          that.getItemImageInfo(changeIndex, true);
        }
      });
    }, 300);
  },
  outImageDouble: function outImageDouble() {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.backImageInfo.showWidth * 2,
      height: that.data.backImageInfo.showHeight * 2,
      destWidth: that.data.backImageInfo.showWidth * 2,
      destHeight: that.data.backImageInfo.showHeight * 2,
      canvasId: 'outPic',
      success: function success(res) {
        if (res.errMsg === 'canvasToTempFilePath:ok') {
          that.setData({
            showImgSrc: res.tempFilePath
          });
          wx.hideLoading();
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function success() {
              wx.showToast({
                title: '图片已存入相册'
              });
            },
            fail: function fail() {
              // app.setToast(that, {content: '请授权相册保存'})
              // that.setData({
              //   buttonShow: true
              // })
            }
          });
        }
      }
    });
  },
  previeImg: function previeImg() {
    app.showImg(this.data.showImgSrc, [this.data.showImgSrc]);
  },
  setBorder: function setBorder() {
    if (this.data.tabBorderIndex < 0) {
      this.setData(_defineProperty({}, 'imgArr[' + changeIndex + '].border', null));
      canChoose = true;
      return;
    }
    var that = this;
    wx.showLoading({
      title: '加载边框中',
      mask: true
    });
    wx.getImageInfo({
      src: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvas_border_' + that.data.tabBorderIndex + '.jpg',
      success: function success(res) {
        wx.hideLoading();
        // let width = that.data.imgArr[changeIndex].showWidth > that.data.imgArr[changeIndex].showHeight ? that.data.imgArr[changeIndex].showHeight / 2 : that.data.imgArr[changeIndex].showWidth / 2
        var width = 4;
        that.setData(_defineProperty({}, 'imgArr[' + changeIndex + '].border', {
          width: width,
          path: res.path,
          x: Math.floor(that.data.imgArr[changeIndex].showWidth / 2) - 1 || 1,
          y: Math.floor(that.data.imgArr[changeIndex].showHeight / 2) || 1
        }));
        canChoose = true;
      }
    });
  },
  chooseAreaStart: function chooseAreaStart(e) {
    chooseArea.x = e.touches[0].pageX;
    chooseArea.y = e.touches[0].pageY;
    chooseArea.xx = this.data.chooseAreaInfo.x;
    chooseArea.yy = this.data.chooseAreaInfo.y;
    chooseArea.w = this.data.chooseAreaInfo.w;
    chooseArea.h = this.data.chooseAreaInfo.h;
  },
  chooseAreaMove: function chooseAreaMove(e) {
    var chooseAreaInfo = this.data.chooseAreaInfo;
    if (e.currentTarget.dataset.type === 'img') {
      var _setData8;

      var _x2 = chooseArea.xx + (e.touches[0].pageX - chooseArea.x);
      var _y = chooseArea.yy + (e.touches[0].pageY - chooseArea.y);
      this.setData((_setData8 = {}, _defineProperty(_setData8, 'chooseAreaInfo.x', _x2 < 0 ? 0 : _x2 >= chooseAreaInfo.imgW - chooseAreaInfo.w ? chooseAreaInfo.imgW - chooseAreaInfo.w : _x2), _defineProperty(_setData8, 'chooseAreaInfo.y', _y < 0 ? 0 : _y >= chooseAreaInfo.imgH - chooseAreaInfo.h ? chooseAreaInfo.imgH - chooseAreaInfo.h : _y), _setData8));
    } else if (e.currentTarget.dataset.type === 'point') {
      var _setData9;

      var width = chooseArea.w + (e.touches[0].pageX - chooseArea.x) < 10 ? 10 : chooseArea.w + (e.touches[0].pageX - chooseArea.x);
      var height = chooseArea.h * width / chooseArea.w;
      if (width > chooseAreaInfo.imgW || height > chooseAreaInfo.imgH) return;
      this.setData((_setData9 = {}, _defineProperty(_setData9, 'chooseAreaInfo.w', width), _defineProperty(_setData9, 'chooseAreaInfo.h', height), _setData9));
    }
  },
  onShareAppMessage: function onShareAppMessage() {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData(_defineProperty({}, 'imgArr[0].src', app.data.userUseImg || 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/nav_0.png'));
    this.chooseIndex({
      currentTarget: {
        dataset: {
          index: 0,
          type: 'bgc'
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {
    // console.log(' ---------- onReady ----------')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    // this.setKill()
    // console.log(' ---------- onShow ----------')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // clearInterval(timer)
    // console.log(' ---------- onHide ----------')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    app.su('canvasImgArr', []);
    // clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // this.getCourse()
  }
});