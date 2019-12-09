'use strict';

// 获取全局应用程序实例对象
var app = getApp();
var UpLoad = require('../upLoad');
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fix: app.data.fix,
    capsule: {
      bgc: 'url(https://c.jiangwenqiang.com/lqsy/2.png)'
    },
    textArr: ['非常差', '差', '一般', '好', '非常好'],
    imgArr: [],
    sos: ['笔画求教', '单字求救', '作品求救', '无'],
    sosIndex: 0,
    commentLV: 4
  },
  chooseSoS: function chooseSoS() {
    var that = this;
    wx.showActionSheet({
      itemList: this.data.sos,
      success: function success(res) {
        that.setData({
          sosIndex: res.tapIndex
        });
      }
    });
  },
  _chooseLv: function _chooseLv(e) {
    this.setData({
      commentLV: e.currentTarget.dataset.index
    });
  },
  upImgSingle: function upImgSingle(src) {
    new UpLoad({
      imgArr: 'imgArr'
    }).upImgSingle(src);
  },
  upload: function upload() {
    new UpLoad({
      imgArr: 'imgArr'
    }).chooseImage();
  },
  checkAll: function checkAll() {
    return new UpLoad({
      imgArr: 'imgArr'
    }).checkAll();
  },
  imgOp: function imgOp(e) {
    new UpLoad({
      imgArr: e.currentTarget.dataset.img,
      index: e.currentTarget.dataset.index
    }).imgOp();
  },
  getRealUrl: function getRealUrl() {
    var url = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.data.imgArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        url.push(v.real);
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

    return url;
  },
  hundredPostsSub: function hundredPostsSub(e) {
    var that = this;
    switch (this.data.options.type) {
      case 'hundred':
        if (!e.detail.value.title.trim()) {
          return app.toast({
            content: '标题不能为空'
          });
        } else if (!e.detail.value.comment.trim()) {
          return app.toast({
            content: '内容不能为空'
          });
        }
        if (!new UpLoad({
          imgArr: 'imgArr'
        }).checkAll()) return;
        app.wxrequest({
          url: app.getUrl().hundredPostsSub,
          data: {
            uid: app.gs('userInfoAll').uid || 10000,
            title: e.detail.value.title.trim(),
            comment: e.detail.value.comment.trim(),
            imgs_url: JSON.stringify({
              'imgs': that.getRealUrl()
            })
          }
        }).then(function (res) {
          app.toast({
            content: '发布成功',
            image: '',
            mask: true
          });
          setTimeout(function () {
            wx.navigateBack();
          }, 1000);
        });
        break;
      case 'community':
        if (!e.detail.value.title.trim()) {
          return app.toast({
            content: '标题不能为空'
          });
        } else if (!e.detail.value.comment.trim()) {
          return app.toast({
            content: '内容不能为空'
          });
        }
        if (!new UpLoad({
          imgArr: 'imgArr'
        }).checkAll()) return;
        app.wxrequest({
          url: app.getUrl().communityPostsSub,
          data: {
            uid: app.gs('userInfoAll').uid || 10000,
            is_video: -1,
            title: e.detail.value.title.trim(),
            comment: e.detail.value.comment.trim(),
            imgs_url: JSON.stringify({
              'imgs': that.getRealUrl()
            })
          }
        }).then(function (res) {
          app.toast({
            content: '发布成功',
            image: '',
            mask: true
          });
          setTimeout(function () {
            wx.navigateBack();
          }, 1000);
        });
        break;
      case 'comment':
        if (!e.detail.value.comment.trim()) {
          return app.toast({
            content: '评价内容不能为空'
          });
        }
        if (!new UpLoad({
          imgArr: 'imgArr'
        }).checkAll()) {
          return app.toast({
            content: '请等待图片上传完成后继续操作'
          });
        }
        app.wxrequest({
          url: app.getUrl()[this.data.info.goodsType === 'sell' ? 'sellDiscussSub' : 'shopDiscussSub'],
          data: this.data.info.goodsType === 'sell' ? {
            uid: app.gs('userInfoAll').uid || 10000,
            pid: this.data.info.id,
            out_trade_no: this.data.info.out_trade_no,
            star: this.data.commentLV * 1 + 1,
            comment: e.detail.value.comment.trim(),
            imgs_url: JSON.stringify({
              'imgs': that.getRealUrl()
            })
          } : {
            uid: app.gs('userInfoAll').uid || 10000,
            pid: this.data.info.id,
            sku_id: this.data.info.list[0].id,
            value: this.data.info.list[0].value || -1,
            out_trade_no: this.data.info.out_trade_no,
            star: this.data.commentLV * 1 + 1,
            comment: e.detail.value.comment.trim(),
            imgs_url: JSON.stringify({
              'imgs': that.getRealUrl()
            })
          }
        }).then(function (res) {
          app.toast({
            content: '评价成功',
            mask: true
          });
          setTimeout(function () {
            wx.navigateBack();
          }, 1000);
        });
        break;
      default:
        return app.toast({
          content: '错误！！请返回上一页重新进入'
        });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      options: options
    });
    if (options.type === 'comment') {
      this.setData({
        info: app.gs('pjInfo')
      });
    }
    if (options.url && options.url.length > 5) {
      this.upImgSingle(options.url);
    }
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
    // clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  },

  // onShareAppMessage () {
  //   // return {
  //   //   title: app.gs('shareText').t || '绣学问，真纹绣',
  //   //   path: `/pages/index/index`,
  //   //   imageUrl: app.gs('shareText').g
  //   // }
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // this.getCourse()
  }
});