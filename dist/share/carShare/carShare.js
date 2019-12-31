'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    painting: {},
    goodsInfo: {},
    color: '#0094ff',
    shareImage: '',
    width: 375,
    height: 603
  },
  getBottomList: function getBottomList() {
    this.getGood();
  },
  getGood: function getGood() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().goodOne,
      data: {
        id: that.data.options.type
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status) {
          that.data.goodsInfo = res.data.data;
          that.getQrCode();
        } else {
          app.setToast(that, {
            content: res.data.desc
          });
        }
      }
    });
  },
  eventDraw: function eventDraw() {
    wx.showLoading({
      title: '定制专属海报中',
      mask: true
    });
    var that = this;
    var views = [{
      type: 'image',
      url: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/share/stele_share.png',
      top: 0,
      left: 0,
      width: 375,
      height: 603
    }, {
      type: 'image',
      url: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/list1.png',
      top: 150,
      left: 375 / 2 - 110,
      width: 220,
      height: 220
    }, {
      type: 'image',
      url: '' + that.data.qrCode,
      top: 385,
      left: 250,
      width: 80,
      height: 80
    }, {
      type: 'text',
      content: '啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦',
      breakWord: true,
      MaxLineNumber: 2,
      fontSize: 20,
      lineHeight: 20,
      color: 'black',
      textAlign: 'center',
      top: 400,
      left: 134,
      width: 160
    }];
    switch (this.data.options.type) {
      case 'inviteFriend':
        views = [{
          type: 'image',
          url: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/share/shopUserShare.png',
          top: 0,
          left: 0,
          width: 375,
          height: 603
        }, {
          type: 'image',
          url: '' + that.data.qrCode,
          top: 230,
          left: 145,
          width: 80,
          height: 80
        }];
        break;
      case 'user':
        views = [{
          type: 'image',
          url: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/share/shopUserShare.png',
          top: 0,
          left: 0,
          width: 375,
          height: 603
        }, {
          type: 'image',
          url: '' + that.data.qrCode,
          top: 230,
          left: 145,
          width: 80,
          height: 80
        }];
        break;
      case 'stele':
        views = [{
          type: 'image',
          url: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/share/stele_share.png',
          top: 0,
          left: 0,
          width: 375,
          height: 603
        }, {
          type: 'image',
          url: this.data.info.img_name || this.data.info.cover_url,
          top: 150,
          left: 375 / 2 - 110,
          width: 220,
          height: 220
        }, {
          type: 'image',
          url: '' + that.data.qrCode,
          top: 385,
          left: 250,
          width: 80,
          height: 80
        }, {
          type: 'text',
          content: this.data.info.name || this.data.info.title,
          breakWord: true,
          MaxLineNumber: 2,
          fontSize: 20,
          lineHeight: 20,
          color: 'black',
          textAlign: 'center',
          top: 400,
          left: 134,
          width: 160
        }];
        break;
      case 'shop':
        views = [{
          type: 'image',
          url: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/share/stele_share.png',
          top: 0,
          left: 0,
          width: 375,
          height: 603
        }, {
          type: 'image',
          url: this.data.info.img_url,
          top: 150,
          left: 375 / 2 - 110,
          width: 220,
          height: 220
        }, {
          type: 'image',
          url: '' + that.data.qrCode,
          top: 385,
          left: 250,
          width: 80,
          height: 80
        }, {
          type: 'text',
          content: this.data.info.title,
          breakWord: true,
          MaxLineNumber: 2,
          fontSize: 20,
          lineHeight: 20,
          color: 'black',
          textAlign: 'center',
          top: 400,
          left: 134,
          width: 160
        }];
        break;
      case 'hundred':
        views = [{
          type: 'image',
          url: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/share/stele_share.png',
          top: 0,
          left: 0,
          width: 375,
          height: 603
        }, {
          type: 'image',
          url: this.data.info.imgs_url.imgs && this.data.info.imgs_url.imgs[0] ? this.data.info.imgs_url.imgs[0] : this.data.info.avatar_url,
          top: 150,
          left: 375 / 2 - 110,
          width: 220,
          height: 220
        }, {
          type: 'image',
          url: '' + that.data.qrCode,
          top: 385,
          left: 250,
          width: 80,
          height: 80
        }, {
          type: 'text',
          content: this.data.info.title,
          breakWord: true,
          MaxLineNumber: 2,
          fontSize: 20,
          lineHeight: 20,
          color: 'black',
          textAlign: 'center',
          top: 400,
          left: 134,
          width: 160
        }];
        break;
      case 'community':
        views = [{
          type: 'image',
          url: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/share/stele_share.png',
          top: 0,
          left: 0,
          width: 375,
          height: 603
        }, {
          type: 'image',
          url: this.data.info.imgs_url.imgs && this.data.info.imgs_url.imgs[0] ? this.data.info.imgs_url.imgs[0] : this.data.info.avatar_url,
          top: 150,
          left: 375 / 2 - 110,
          width: 220,
          height: 220
        }, {
          type: 'image',
          url: '' + that.data.qrCode,
          top: 385,
          left: 250,
          width: 80,
          height: 80
        }, {
          type: 'text',
          content: this.data.info.title,
          breakWord: true,
          MaxLineNumber: 2,
          fontSize: 20,
          lineHeight: 20,
          color: 'black',
          textAlign: 'center',
          top: 400,
          left: 134,
          width: 160
        }];
        break;
      case 'dayword':
        views = [{
          type: 'image',
          url: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/share/stele_share.png',
          top: 0,
          left: 0,
          width: 375,
          height: 603
        }, {
          type: 'image',
          url: this.data.info.img_url,
          top: 150,
          left: 375 / 2 - 110,
          width: 220,
          height: 220
        }, {
          type: 'image',
          url: '' + that.data.qrCode,
          top: 385,
          left: 250,
          width: 80,
          height: 80
        }, {
          type: 'text',
          content: this.data.info.title,
          breakWord: true,
          MaxLineNumber: 2,
          fontSize: 20,
          lineHeight: 20,
          color: 'black',
          textAlign: 'center',
          top: 400,
          left: 134,
          width: 160
        }];
        break;
      case 'camera':
        views = [{
          type: 'image',
          url: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/share/stele_share.png',
          top: 0,
          left: 0,
          width: 375,
          height: 603
        }, {
          type: 'image',
          url: this.data.info.img_name,
          top: 150,
          left: 375 / 2 - 110,
          width: 220,
          height: 220
        }, {
          type: 'image',
          url: '' + that.data.qrCode,
          top: 385,
          left: 250,
          width: 80,
          height: 80
        }, {
          type: 'text',
          content: this.data.info.word,
          breakWord: true,
          MaxLineNumber: 2,
          fontSize: 20,
          lineHeight: 20,
          color: 'black',
          textAlign: 'center',
          top: 400,
          left: 134,
          width: 160
        }];
        break;
    }

    this.setData({
      painting: {
        width: 375,
        height: 603,
        clear: true,
        views: views
      }
    });
  },
  eventDraw2: function eventDraw2(e) {
    wx.showLoading({
      title: '定制海报中',
      mask: true
    });
    var that = this;
    var views = [{
      type: 'image',
      url: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/mask/share_4.png',
      top: 0,
      left: 0,
      width: 375,
      height: 603
    }, {
      type: 'image',
      url: this.data.imgDomain + '/' + this.data.goodsInfo.cover_image,
      top: 120,
      left: 36,
      width: 300,
      height: 220
    }, {
      type: 'text',
      content: this.data.goodsInfo.name,
      breakWord: true,
      MaxLineNumber: 1,
      fontSize: 20,
      lineHeight: 20,
      top: 360,
      left: 40,
      width: 120
    }, {
      type: 'text',
      content: '售价：' + this.data.goodsInfo.price,
      breakWord: true,
      MaxLineNumber: 2,
      top: 420,
      left: 40,
      width: 120
    }, {
      type: 'image',
      url: '' + that.data.qrCode,
      top: 358,
      left: 198,
      width: 130,
      height: 130
    }];

    this.setData({
      painting: {
        width: 375,
        height: 603,
        clear: true,
        views: views
      }
    });
  },
  eventDraw3: function eventDraw3(e) {
    wx.showLoading({
      title: '生成中',
      mask: true
    });
    var that = this;
    var views = [{
      type: 'image',
      url: 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/cavas_bottom.jpg',
      top: 0,
      left: 0,
      width: 375,
      height: 603
    }, {
      type: 'image',
      url: this.data.imgDomain + '/' + this.data.goodsInfo.cover_image,
      top: 120,
      left: 36,
      width: 300,
      height: 220
    }, {
      type: 'text',
      content: this.data.goodsInfo.name,
      breakWord: true,
      MaxLineNumber: 1,
      fontSize: 20,
      lineHeight: 20,
      top: 360,
      left: 40,
      width: 120
    }, {
      type: 'text',
      content: '售价：' + this.data.goodsInfo.price,
      breakWord: true,
      MaxLineNumber: 2,
      top: 420,
      left: 40,
      width: 120
    }, {
      type: 'image',
      url: '' + that.data.qrCode,
      top: 358,
      left: 198,
      width: 130,
      height: 130
    }];

    this.setData({
      painting: {
        width: 375,
        height: 603,
        clear: true,
        views: views
      }
    });
  },
  eventGetImage: function eventGetImage(event) {
    wx.hideLoading();
    var tempFilePath = event.detail.tempFilePath;

    this.setData({
      shareImage: tempFilePath
    });
  },
  getQrCode: function getQrCode() {
    var _this = this;

    // let that = this
    app.wxrequest({
      url: app.getUrl().codeInvite,
      data: {
        uid: app.gs('userInfoAll').uid || 1,
        scene: app.gs('scene') || null
      }
    }).then(function (res) {
      _this.setData({
        qrCode: res
      }, _this.eventDraw);
    }).catch(function (err) {
      console.error(err);
      app.toast({ content: '服务器出错啦' });
      setTimeout(function () {
        wx.navigateBack();
      }, 1000);
    });
    // wx.request({
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   url: 'https://teach.idwenshi.com/teach/teach/web/index.php/product/qrcode',
    //   data: {
    //     uid: 10000,
    //     pid: 472,
    //     mid: 10000
    //   },
    //   success (res) {
    //     that.setData({
    //       qrCode: res.data.data
    //     }, that.eventDraw)
    //   }
    // })
    // app.wxrequest({
    //   url: 'https://teach.idwenshi.com/teach/teach/web/index.php/product/qrcode',
    //   data: {
    //     uid: 10000,
    //     pid: 1,
    //     mid: 10000
    //   }
    // }).then(res => {
    //   that.setData({
    //     qrCode: res
    //   }, that.eventDraw)
    // })
  },
  savePhoto: function savePhoto() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success: function success() {
        wx.showToast({
          title: '保存成功'
        });
      },
      fail: function fail() {
        app.toast({
          content: '请授权相册保存'
        });
        that.setData({
          buttonShow: true
        });
      }
    });
  },

  // onShareAppMessage () {
  //   let title = app.gs('share')[0].title
  //   let imageUrl = app.gs('share')[0].image_url
  //   return {
  //     title,
  //     imageUrl,
  //     path: `/pages/menu/menu?recommend=${app.gs('userInfoAll').id},${app.gs('userInfoAll').rank <= 1 ? 1 : app.gs('userInfoAll').rank},${app.gs('userInfoAll').parent_id}`
  //   }
  // },
  openSettingO: function openSettingO(e) {
    if (e.detail.authSetting['scope.writePhotosAlbum']) {
      this.setData({
        buttonShow: false
      });
    } else {
      this.setData({
        buttonShow: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    wx.showLoading({
      title: '资源整理中'
    });
    this.data.options = options;
    this.data.info = app.gs('shareCardInfo');
    this.getQrCode();
    // TODO: onLoad
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {
    // TODO: onReady
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    // TODO: onShow
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // TODO: onHide
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});