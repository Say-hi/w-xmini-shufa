'use strict';

// 获取全局应用程序实例对象
var app = getApp();
// const bmap = require('../../utils/bmap-wx')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsule: {
      transparent: true,
      bgc: '',
      hImg: null
    },
    showItem: false,
    HEIGHT_TOP: app.data.HEIGHT_TOP,
    ALL_HEIGHT: app.data.ALL_HEIGHT,
    capsules: app.data.capsule,
    page: 0,
    wordsCategoryList: [],
    answerArr: [],
    indicatorColor: 'rgba(0, 0, 0, 0.4)',
    indicatorActiveColor: '#ffffff',
    indicatorActiveColorVideo: '#dab866',
    show: true,
    tabNav: []
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  open_site: function open_site(e) {
    if (e.detail.authSetting['scope.userLocation']) {
      wx.showToast({
        title: '授权成功'
      });
      this.setData({
        openType: null
      });
      var that = this;
      setTimeout(function () {
        that.Bmap(that);
      }, 100);
    }
  },
  choose_site: function choose_site() {
    var that = this;
    if (!this.data.openType) {
      wx.chooseLocation({
        success: function success(res) {
          that.setData({
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }, that.Bmap(that, res.longitude + ',' + res.latitude));
        }
      });
    }
  },

  // Bmap (that, site) {
  //   let BMap = new bmap.BMapWX({
  //     ak: 'RBTsmFCaerZ25VkuGhpSIZa5lyC36BcV'
  //   })
  //   BMap.regeocoding({
  //     location: site || null,
  //     success (res) {
  //       that.setData({
  //         addressInfo: res
  //       })
  //     },
  //     fail (data) {
  //       that.setData({
  //         openType: 'openSetting'
  //       })
  //       console.log('fail', data)
  //     }
  //   })
  // },
  getLocation: function getLocation() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        app.su('userLocation', res);
        that.getIndex();
      }
    });
  },
  MaskGetUserInfo: function MaskGetUserInfo(e) {
    if (e.detail.iv) {
      this.setData({
        needUserInfo: false
      });
      app.wxlogin(this.getLocation);
    }
  },
  goOther: function goOther(e) {
    app.goOther(e);
  },
  getCourse: function getCourse() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().course,
      data: {
        page: 1,
        style: 2
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var list = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              list.push({
                id: v.id,
                avatar: v.avatar,
                image: v.image,
                room_name: v.room_name,
                title: v.title,
                price: v.price > 0 ? v.price : '免费'
              });
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

          that.setData({
            list: list
          });
        }
      }
    });
  },
  getUser: function getUser() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success: function success(res) {
        app.su('userInfoAll', Object.assign(app.gs('userInfoAll'), { star: res.data.data.star }));
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            userInfo: res.data.data
          }, that.checkLvShow);
        }
      }
    });
  },
  phone: function phone(e) {
    var that = this;
    wx.login({
      success: function success(res) {
        app.wxrequest({
          url: app.getUrl().shopPhone,
          data: {
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            uid: that.data.userInfo.id
          },
          success: function success(res) {
            wx.hideLoading();
            if (res.data.status === 200) {
              that.getUser();
            } else {
              app.setToast(that, { content: res.data.desc });
            }
          }
        });
      }
    });
  },
  login: function login() {
    app.wxlogin();
  },
  goNow: function goNow() {
    this.setData({
      'userInfo.nickname': '未登录用户',
      'userInfo.phone': 18888888888
    });
  },
  checkLvShow: function checkLvShow(e) {
    if (e) {
      this.setData({
        lvShow: false
      });
      app.su('beforeShow', app.gs('userInfoAll').star || 5);
      return;
    }
    var that = this;
    this.setData({
      lvShow: app.gs('beforeShow') * 1 !== app.gs('userInfoAll').star * 1
    }, function () {
      if (that.data.lvShow) {
        that.setData({
          lvStar: app.gs('userInfoAll').star || 5
        });
      }
    });
  },
  getTopNav: function getTopNav() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().homeConfig
    }).then(function (res) {
      that.setData({
        nav: res.middle_menu,
        openVipImg: res.page_img.home_page_img || 'https://book-1258261086.cos.ap-guangzhou.myqcloud.com/lqsy/vip.png'
      }, function () {
        setTimeout(function () {
          that.setData({
            showItem: true
          });
        }, 10);
      });
    });
  },
  getWordsCategory: function getWordsCategory() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().wordsCategory,
      data: {
        page: ++this.data.page
      }
    }).then(function (res) {
      that.setData({
        wordsCategoryList: that.data.wordsCategoryList.concat(res.lists)
      });
      that.data.more = res.lists.length >= res.pre_page;
    });
  },
  onPageScroll: function onPageScroll(e) {
    this.setData({
      moveY: e.scrollTop - app.data.moveHeight > 0 ? e.scrollTop - app.data.moveHeight : 0
    });
  },
  showLog: function showLog() {
    this.data.num = this.data.num ? ++this.data.num : 1;
    this.data.num > 10 && app.su('canLog', 10);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.getTopNav();
    this.getWordsCategory();
  },
  onReachBottom: function onReachBottom() {
    if (!this.data.more) {
      return app.toast({
        content: '没有更多内容了'
      });
    }
    this.getWordsCategory();
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
    // app.toast()
    // this.setKill()
    // console.log(' ---------- onShow ----------')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // this.setData({
    //   showItem: false
    // })
    // clearInterval(timer)
    // console.log(' ---------- onHide ----------')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    // this.setData({
    //   showItem: false
    // })
    // clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  },
  onShareAppMessage: function onShareAppMessage() {
    // return {
    //   title: app.gs('shareText').t || '绣学问，真纹绣',
    //   path: `/pages/index/index`,
    //   imageUrl: app.gs('shareText').g
    // }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // this.getCourse()
  }
});