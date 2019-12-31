'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
var app = getApp();
// const UpLoad = require('../upLoad')
var baseScale = 1; // 底图缩放率
var currentIndex = 0; // 当前的图片
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    backImageInfo: {
      src: '',
      zIndex: 1,
      positionItem: [// 展示点位置坐标
      {
        x: 375, // 中心点x
        y: 375, // 中心店y
        width: 200, // 实际宽
        height: 200 // 实际高
      }]
    },
    shareArr: ['社区', '墨宝真迹', '保存相册', '微信好友', '朋友圈'],
    upImgArr: [],
    tabBorderArr: {
      i: -1,
      item: ['https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvas_border_0.jpg', 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvas_border_1.jpg', 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvas_border_2.jpg', 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvas_border_3.jpg', 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvas_border_4.jpg', 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/canvas_border_5.jpg']
    },
    bgColorArr: {
      i: -1,
      item: ['#ffffff', '#F1ECD9', '#E7D3D4', '#CDC2C0', '#BDC8C0']
    },
    borderColorArr: {
      i: 0,
      item: ['#ffffff', '#F1ECD9', '#E7D3D4', '#CDC2C0', '#BDC8C0']
    },
    operationArr: {
      chooseIndex: 0,
      tab: [{
        t: '画框',
        img: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sb11.png',
        imgChoose: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sb1.png',
        sliderText: '缩放',
        currentSlider: 0,
        minSlider: 0,
        maxSlider: 80
      }, {
        t: '卡纸',
        img: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sb2.png',
        imgChoose: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sb22.png',
        sliderText: '宽度',
        currentSlider: 0,
        minSlider: 0,
        maxSlider: 20
      }, {
        t: '局条',
        img: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sb3.png',
        imgChoose: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/sb33.png',
        sliderText: '宽度',
        currentSlider: 0,
        minSlider: 0,
        maxSlider: 3
      }]
    }
  },
  shareType: function shareType(e) {
    var that = this;
    switch (this.data.shareArr[e.currentTarget.dataset.index]) {
      case '社区':
        wx.navigateTo({
          url: '/commonPage/talk/index?type=community&url=' + that.data.shareImageSrc
        });
        that.setData({
          showSpec: !that.data.showSpec
        });
        break;
      case '墨宝真迹':
        wx.redirectTo({
          url: '/commonPage/release/index?from=release&u=' + that.data.shareImageSrc
        });
        break;
      case '保存相册':
        wx.saveImageToPhotosAlbum({
          filePath: that.data.shareImageSrc,
          success: function success() {
            wx.showToast({
              title: '图片已存入相册'
            });
            that.setData({
              showSpec: !that.data.showSpec
            });
          },
          fail: function fail() {
            app.toast({
              content: '请授权相册保存--点击右上角是三个小点--选择设置--允许使用相册--返回重新保存',
              time: 10000
            });
          }
        });
        break;
      case '微信好友':
        wx.saveImageToPhotosAlbum({
          filePath: that.data.shareImageSrc,
          success: function success() {
            app.toast({
              content: '图片已存入相册,快去发送给你的好友吧',
              image: ''
            });
            that.setData({
              showSpec: !that.data.showSpec
            });
          },
          fail: function fail() {
            app.toast({
              content: '请授权相册保存--点击右上角是三个小点--选择设置--允许使用相册--返回重新保存',
              time: 10000
            });
          }
        });
        break;
      case '朋友圈':
        wx.saveImageToPhotosAlbum({
          filePath: that.data.shareImageSrc,
          success: function success() {
            app.toast({
              content: '图片已存入相册,快去发条朋友圈吧',
              image: ''
            });
            that.setData({
              showSpec: !that.data.showSpec
            });
          },
          fail: function fail() {
            app.toast({
              content: '请授权相册保存--点击右上角是三个小点--选择设置--允许使用相册--返回重新保存',
              time: 10000
            });
          }
        });
        break;
    }
  },
  _toggleSpec: function _toggleSpec() {
    this.canvasDraw();
    if (this.data.sell_release) {
      // this.canvasDraw()
    } else {
      this.setData({
        showSpec: !this.data.showSpec
      });
    }
  },
  chooseImage: function chooseImage(e) {
    if (this.data.single === 'single') return;
    wx.chooseImage({
      count: 1,
      success: function success(res) {
        app.data['chooseImage'] = res.tempFilePaths[0];
        wx.navigateTo({
          url: '/commonPage/canvas2/step_two/index?single=more&index=' + e.currentTarget.dataset.index
        });
      }
    });
  },

  /**
   * slider对应不同内容处理
   * @param e
   */
  sliderChange: function sliderChange(e) {
    if (this.data.operationArr.chooseIndex === 0) {
      var _setData;

      // 改变整体大小
      this.setData((_setData = {}, _defineProperty(_setData, 'operationArr.tab[0].currentSlider', e.detail.value), _defineProperty(_setData, 'upImgArr[0].scale', (100 - e.detail.value) / 100), _setData));
    } else if (this.data.operationArr.chooseIndex === 1) {
      var _setData2;

      // 改变图片大小
      var inScale = 1 - e.detail.value / 40;
      this.setData((_setData2 = {}, _defineProperty(_setData2, 'operationArr.tab[1].currentSlider', e.detail.value), _defineProperty(_setData2, 'upImgArr[' + currentIndex + '].width', this.data.upImgArr[currentIndex].startWidth * inScale), _defineProperty(_setData2, 'upImgArr[' + currentIndex + '].height', this.data.upImgArr[currentIndex].startHeight * inScale), _defineProperty(_setData2, 'upImgArr[' + currentIndex + '].xx', (1 - inScale) * this.data.upImgArr[currentIndex].startWidth / 2), _defineProperty(_setData2, 'upImgArr[' + currentIndex + '].yy', (1 - inScale) * this.data.upImgArr[currentIndex].startHeight / 2), _setData2));
      if (this.data.operationArr.tab[2].currentSlider > 0) {
        var _setData3;

        var value = this.data.upImgArr[currentIndex].width < this.data.upImgArr[currentIndex].startWidth - 3 ? this.data.operationArr.tab[2].currentSlider * 2 : 0;
        this.setData((_setData3 = {}, _defineProperty(_setData3, 'upImgArr[' + currentIndex + '].border.x', this.data.upImgArr[currentIndex].xx - value / 2), _defineProperty(_setData3, 'upImgArr[' + currentIndex + '].border.y', this.data.upImgArr[currentIndex].yy - value / 2), _defineProperty(_setData3, 'upImgArr[' + currentIndex + '].border.width', this.data.upImgArr[currentIndex].width + value), _defineProperty(_setData3, 'upImgArr[' + currentIndex + '].border.height', this.data.upImgArr[currentIndex].height + value), _setData3));
      }
    } else if (this.data.operationArr.chooseIndex === 2 && this.data.upImgArr[currentIndex].width < this.data.upImgArr[currentIndex].startWidth - 3) {
      var _setData4;

      // 改变局条颜色
      var _value = 2 * e.detail.value;
      this.setData((_setData4 = {}, _defineProperty(_setData4, 'operationArr.tab[2].currentSlider', e.detail.value), _defineProperty(_setData4, 'upImgArr[' + currentIndex + '].border.x', this.data.upImgArr[currentIndex].xx - _value / 2), _defineProperty(_setData4, 'upImgArr[' + currentIndex + '].border.y', this.data.upImgArr[currentIndex].yy - _value / 2), _defineProperty(_setData4, 'upImgArr[' + currentIndex + '].border.width', this.data.upImgArr[currentIndex].width + _value), _defineProperty(_setData4, 'upImgArr[' + currentIndex + '].border.height', this.data.upImgArr[currentIndex].height + _value), _setData4));
    }
  },

  /**
   * 修改不同分类的索引
   * @param e
   */
  chooseIndex: function chooseIndex(e) {
    var _this = this;

    if (e.currentTarget.dataset.type === 'type') {
      // 选择类型
      this.setData(_defineProperty({}, 'operationArr.chooseIndex', e.currentTarget.dataset.index));
    } else if (e.currentTarget.dataset.type === 'type0') {
      // 选择边框
      this.setData(_defineProperty({}, 'tabBorderArr.i', e.currentTarget.dataset.index), function () {
        _this.getBorderInfo(_this.data.tabBorderArr.item[e.currentTarget.dataset.index]);
      });
    } else if (e.currentTarget.dataset.type === 'type1') {
      var _setData7;

      // 选择卡纸
      this.setData((_setData7 = {}, _defineProperty(_setData7, 'bgColorArr.i', e.currentTarget.dataset.index), _defineProperty(_setData7, 'upImgArr[' + currentIndex + '].bgc', this.data.bgColorArr.item[e.currentTarget.dataset.index]), _setData7));
    } else if (e.currentTarget.dataset.type === 'type2') {
      var _setData8;

      // 选择局条
      this.setData((_setData8 = {}, _defineProperty(_setData8, 'borderColorArr.i', e.currentTarget.dataset.index), _defineProperty(_setData8, 'upImgArr[' + currentIndex + '].border.color', this.data.borderColorArr.item[e.currentTarget.dataset.index]), _setData8));
    }
  },

  /**
   * 获取图片信息
   * @param src // 传入图片路径
   * @returns {Promise}
   */
  getImageInfo: function getImageInfo(src) {
    wx.showLoading({
      title: '加载中...'
    });
    return new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: src,
        success: function success(res) {
          wx.hideLoading();
          resolve(res);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },

  /**
   * 获取底图的尺寸信息
   * @param src
   */
  getBackImageInfo: function getBackImageInfo(src) {
    var _this2 = this;

    this.getImageInfo(src).then(function (res) {
      res.fixWidth = app.data.system.windowWidth;
      // console.log('res.fixWidth', res.fixWidth)
      baseScale = app.data.system.windowWidth / res.width;
      // console.log('baseScale', baseScale)
      res.fixHeight = baseScale * res.height;
      // console.log('res.fixHeight', res.fixHeight)
      // console.log('this.data.backImageInfo.positionItem', this.data.backImageInfo.positionItem)
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this2.data.backImageInfo.positionItem[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var v = _step.value;

          v.x = baseScale * v.x;
          v.y = baseScale * v.y;
          // v.width = baseScale * v.width / 8
          // v.height = baseScale * v.height / 8
          v.width = baseScale * v.width;
          v.height = baseScale * v.height;
        }
        // console.log('this.data.backImageInfo.positionItem', this.data.backImageInfo.positionItem)
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

      _this2.setData({
        backImageInfo: Object.assign(_this2.data.backImageInfo, res)
      }, function () {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _this2.data.backImageInfo.positionItem.keys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var i = _step2.value;

            // console.log(i)
            _this2.data.upImgArr[i] = {
              'src': app.data.userUseImg || 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/nav_0.png'
            };
            _this2.getItemImageInfo(i);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      });
    }, function () {
      wx.hideLoading();
      app.toast({ content: '图片信息加载失败，请重新进入' });
    });
  },

  /**
   * 获取每个图片的信息和位置
   * @param index
   */
  getItemImageInfo: function getItemImageInfo(index) {
    var _this3 = this;

    this.getImageInfo(this.data.upImgArr[index].src).then(function (res) {
      if (_this3.data.backImageInfo.positionItem[index].width <= _this3.data.backImageInfo.positionItem[index].height) {
        var temp = _this3.data.backImageInfo.positionItem[index].width * res.height / res.width;
        res.width = _this3.data.backImageInfo.positionItem[index].width.toFixed(1);
        res.height = temp.toFixed(1);
      } else {
        var _temp = _this3.data.backImageInfo.positionItem[index].height * res.width / res.height;
        res.height = _this3.data.backImageInfo.positionItem[index].height.toFixed(1);
        res.width = _temp.toFixed(1);
      }
      // 记录图片的宽高
      res.startWidth = res.width;
      res.startHeight = res.height;
      res.useWidth = res.width < res.height;
      res.scale = 1;
      res.rotate = _this3.data.slideScale - 1;
      res.x = _this3.data.backImageInfo.positionItem[index].x - res.width / 2;
      res.y = _this3.data.backImageInfo.positionItem[index].y - res.height / 2;
      res.xx = 0;
      res.yy = 0;
      res.bgc = '#ffffff';
      res.border = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: '#ffffff'
      };
      _this3.setData(_defineProperty({}, 'upImgArr[' + index + ']', res));
    }, function () {
      wx.hideLoading();
      app.toast({ content: '图片信息加载失败，请重新进入' });
    });
  },

  /**
   * 获取对应图片的边框信息
   * @param src
   * @param index
   */
  getBorderInfo: function getBorderInfo(src) {
    var _this4 = this;

    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (!src) {
      return this.setData(_defineProperty({}, 'upImgArr[' + currentIndex + '].borderImageInfo', null));
    }
    this.getImageInfo(src).then(function (res) {
      res.width = (res.width * baseScale).toFixed(1);
      var x = _this4.data.upImgArr[index].startWidth / (res.width / 2);
      var y = _this4.data.upImgArr[index].startHeight / (res.width / 2);
      res.x = x === Math.floor(x) ? Math.floor(x) - 1 : Math.floor(x);
      res.y = y === Math.floor(y) ? Math.floor(y) - 1 : Math.floor(y);
      _this4.setData(_defineProperty({}, 'upImgArr[' + currentIndex + '].borderImageInfo', res));
    }, function () {
      wx.hideLoading();
      app.toast({ content: '图片信息加载失败，请重新进入' });
    });
  },
  canvasDraw: function canvasDraw() {
    var _this5 = this;

    wx.showLoading({
      title: '图片生成中',
      mask: true
    });
    var ctx = wx.createCanvasContext('outPic', this);
    var that = this;
    ctx.setFillStyle('white');
    ctx.fillRect(0, 0, that.data.backImageInfo.fixWidth * 2, that.data.backImageInfo.fixHeight * 2);
    if (that.data.backImageInfo.zIndex <= 1) {
      ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.backImageInfo.fixWidth * 2, that.data.backImageInfo.fixHeight * 2);
    }
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = that.data.upImgArr[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var v = _step3.value;

        ctx.save();
        // 移动坐标点到图片中心位置
        ctx.translate(v.x * 2 + v.startWidth * that.data.slideScale, v.y * 2 + v.startHeight * that.data.slideScale);
        // 旋转画布对应的角度
        ctx.rotate(v.rotate * that.data.slideScale * Math.PI / 180);
        // 边框 ---s
        if (v.borderImageInfo) {
          // 上边框
          var count = 0;
          while (count < v.borderImageInfo.x) {
            ctx.translate(((v.borderImageInfo.x - 1 - count) * v.borderImageInfo.width * that.data.slideScale - v.startWidth) * v.scale, -v.startHeight * v.scale);
            ctx.rotate(45 * Math.PI / 180 * that.data.slideScale);
            ctx.drawImage(v.borderImageInfo.path, -(v.borderImageInfo.width * v.scale), -(v.borderImageInfo.width * v.scale), v.borderImageInfo.width * v.scale * 2, v.borderImageInfo.width * v.scale * 2);
            ctx.rotate(-45 * Math.PI / 180);
            ctx.translate(-((v.borderImageInfo.x - 1 - count) * v.borderImageInfo.width - v.startWidth) * v.scale, v.startHeight * v.scale);
            count++;
          }
          // 右边框
          count = 0;
          while (count < v.borderImageInfo.y) {
            // (v.borderImageInfo.width * v.scale * (v.borderImageInfo.x - 1 - count)) - v.startWidth
            ctx.translate(v.startWidth * v.scale, ((v.borderImageInfo.y - 1 - count) * v.borderImageInfo.width * that.data.slideScale - v.startHeight) * v.scale);
            ctx.rotate(135 * Math.PI / 180 * that.data.slideScale);
            ctx.drawImage(v.borderImageInfo.path, -(v.borderImageInfo.width * v.scale), -(v.borderImageInfo.width * v.scale), v.borderImageInfo.width * v.scale * 2, v.borderImageInfo.width * v.scale * 2);
            ctx.rotate(-135 * Math.PI / 180);
            ctx.translate(-v.startWidth * v.scale, -((v.borderImageInfo.y - 1 - count) * v.borderImageInfo.width - v.startHeight) * v.scale);
            count++;
          }
          // 下边框
          count = 0;
          while (count < v.borderImageInfo.x) {
            // (v.borderImageInfo.width * v.scale * (v.borderImageInfo.x - 1 - count)) - v.startWidth
            ctx.translate((-(v.borderImageInfo.x - 1 - count) * v.borderImageInfo.width * that.data.slideScale + v.startWidth * 1) * v.scale, v.startHeight * v.scale);
            ctx.rotate(225 * Math.PI / 180 * that.data.slideScale);
            ctx.drawImage(v.borderImageInfo.path, -(v.borderImageInfo.width * v.scale), -(v.borderImageInfo.width * v.scale), v.borderImageInfo.width * v.scale * 2, v.borderImageInfo.width * v.scale * 2);
            ctx.rotate(-225 * Math.PI / 180);
            ctx.translate(-(-(v.borderImageInfo.x - 1 - count) * v.borderImageInfo.width + v.startWidth * 1) * v.scale, -v.startHeight * v.scale);
            count++;
          }
          // 右边框
          count = 0;
          while (count < v.borderImageInfo.y) {
            // (v.borderImageInfo.width * v.scale * (v.borderImageInfo.x - 1 - count)) - v.startWidth
            ctx.translate(-v.startWidth * v.scale, (-(v.borderImageInfo.y - 1 - count) * v.borderImageInfo.width * that.data.slideScale + v.startHeight * 1) * v.scale);
            ctx.rotate(315 * Math.PI / 180 * that.data.slideScale);
            ctx.drawImage(v.borderImageInfo.path, -(v.borderImageInfo.width * v.scale), -(v.borderImageInfo.width * v.scale), v.borderImageInfo.width * v.scale * 2, v.borderImageInfo.width * v.scale * 2);
            ctx.rotate(-315 * Math.PI / 180);
            ctx.translate(v.startWidth * v.scale, -(-(v.borderImageInfo.y - 1 - count) * v.borderImageInfo.width + v.startHeight * 1) * v.scale);
            count++;
          }
        }
        // 边框 ---e
        // 卡纸 ---s
        ctx.setFillStyle(v.bgc);
        ctx.fillRect(-(v.startWidth * v.scale), -(v.startHeight * v.scale), v.startWidth * v.scale * 2, v.startHeight * v.scale * 2);
        // 卡纸 ---e
        // 局条 ---s
        if (v.border) {
          ctx.setFillStyle(v.border.color);
          ctx.fillRect(-(v.border.width * v.scale), -(v.border.height * v.scale), v.border.width * v.scale * 2, v.border.height * v.scale * 2);
        }
        // 局条 ---e
        // 图片 ---s
        ctx.drawImage(v.path, -(v.width * v.scale), -(v.height * v.scale), v.width * v.scale * 2, v.height * v.scale * 2);
        // 图片 ---e
        ctx.restore();
      }

      // 图片 ---e
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    if (that.data.backImageInfo.zIndex >= 10) {
      ctx.drawImage(that.data.backImageInfo.path, 0, 0, that.data.backImageInfo.fixWidth * 2 * that.data.slideScale, that.data.backImageInfo.fixHeight * 2 * that.data.slideScale);
    }
    ctx.draw();
    setTimeout(function () {
      _this5.outImageDouble();
    }, 300);
  },
  getuser: function getuser() {
    app.baseUserInfo(this);
  },
  outImageDouble: function outImageDouble() {
    var _this6 = this;

    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.backImageInfo.fixWidth * 2,
      height: that.data.backImageInfo.fixHeight * 2,
      destWidth: that.data.backImageInfo.fixWidth * 2,
      destHeight: that.data.backImageInfo.fixHeight * 2,
      canvasId: 'outPic',
      success: function success(res) {
        if (res.errMsg === 'canvasToTempFilePath:ok') {
          // that.setData({
          //   showImgSrc: res.tempFilePath
          // })
          wx.hideLoading();
          // 发布拍品
          if (_this6.data.sell_release) {
            var pages = getCurrentPages();
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = pages.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _step4$value = _slicedToArray(_step4.value, 2),
                    i = _step4$value[0],
                    v = _step4$value[1];

                if (v.route === 'commonPage/release/index') {
                  v.uploadSingleImg(res.tempFilePath);
                  wx.navigateBack({
                    delta: pages.length - 1 - i
                  });
                }
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          } else {
            _this6.data.shareImageSrc = res.tempFilePath;
          }
          // wx.saveImageToPhotosAlbum({
          //   filePath: res.tempFilePath,
          //   success () {
          //     wx.showToast({
          //       title: '图片已存入相册'
          //     })
          //   },
          //   fail () {
          //     // app.setToast(that, {content: '请授权相册保存'})
          //     // that.setData({
          //     //   buttonShow: true
          //     // })
          //   }
          // })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    var _this7 = this;

    this.getuser();
    this.setData({
      single: options.single,
      sell_release: app.data.sell_release,
      backImageInfo: app.gs('backImageInfo')
    }, function () {
      _this7.getBackImageInfo(_this7.data.backImageInfo.src);
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
    // console.log(' ---------- onUnload ----------')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // this.getCourse()
  }
});