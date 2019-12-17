'use strict';

/*
 * @Author: Jiang WenQiang
 * @Date: 2019-09-01 10:29:30
 * @Last Modified by: Jiang WenQiang
 * @Last Modified time: 2019-12-17 14:45:28
 */
/*eslint-disable*/
var useUrl = require('./utils/service2');
var wxParse = require('./wxParse/wxParse');
var statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
var MenuButtonBounding = wx.getMenuButtonBoundingClientRect();
var HEIGHT_TOP = MenuButtonBounding.bottom - statusBarHeight;
var Moment = require('./utils/moment-min');
var _cloud = require('./utils/cloud');
var bmap = require('./utils/bmap-wx');
var system = wx.getSystemInfoSync();
var capsule = MenuButtonBounding;
var requireCount = 0;
var lastUrl = '';
var timer = '';
Moment.updateLocale('en', {
  relativeTime: {
    future: '%s',
    past: '%s前',
    s: '刚刚',
    m: '1分钟',
    mm: '%d分钟',
    h: '1小时',
    hh: '%d小时',
    d: '1天',
    dd: '%d天',
    M: '1个月',
    MM: '%d月',
    y: '1年',
    yy: '%d年'
  }
});
App({
  data: {
    fix: system.model.indexOf('X') >= 0 || system.screenHeight - system.safeArea.height >= 35,
    capsule: capsule,
    system: system,
    fixPxToRpx: 750 / system.screenWidth,
    requireDisable: 10,
    height: capsule.bottom + capsule.top / 4,
    capsuleHeight: capsule.height,
    capsuleTop: capsule.top,
    moveHeight: capsule.bottom - capsule.top / 2,
    capsuleCenter: system.windowWidth - (capsule.width + system.windowWidth - capsule.right) * 2 - 5,
    // ------------------------
    systemVersion: wx.getSystemInfoSync().system.split('.')[0].indexOf('9') >= 0 && wx.getSystemInfoSync().model.indexOf('iPhone') >= 0,
    all_screen: wx.getSystemInfoSync().model.indexOf('X') >= 0,
    TOP_CENTER: MenuButtonBounding.right - 66,
    searchText: null,
    bottomTabIndex: 0,
    statusBarHeight: statusBarHeight,
    HEIGHT_TOP: HEIGHT_TOP,
    MenuButtonBounding: MenuButtonBounding,
    ALL_HEIGHT: statusBarHeight + HEIGHT_TOP,
    name: '流谦书苑',
    label: [],
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg'
  },
  noUse: function noUse() {},
  cloud: function cloud() {
    return _cloud;
  },
  toast: function toast(_toast) {
    getCurrentPages()[getCurrentPages().length - 1].setData({
      toast: Object.assign({
        image: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/background/jiong.png',
        bgc: 'rgba(0,0,0,.8)',
        color: '#fff',
        title: '',
        toastType: 'center',
        content: '服务器开小差啦~~',
        mask: false,
        time: 3000
      }, _toast)
    });
  },
  momentAdd: function momentAdd(number, type, time) {
    if (time) {
      return Moment(time).add(number, type);
    } else {
      return Moment().add(number, type);
    }
  },
  momentDay: function momentDay(time) {
    return Moment().day(time);
  },
  momentFormat: function momentFormat(time, formatStr) {
    return Moment(time).format(formatStr);
  },
  call: function call() {
    var phoneNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '13378692079';

    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },

  // 富文本解析
  WP: function WP(title, type, data, that, image) {
    wxParse.wxParse(title, type, data, that, image);
  },

  // 解析时间
  moment: function moment(time) {
    return Moment(time).fromNow();
  },

  // 发起微信支付
  wxpay2: function wxpay2(obj) {
    return new Promise(function (resolve, reject) {
      wx.requestPayment({
        timeStamp: obj.timeStamp,
        nonceStr: obj.nonceStr,
        package: obj.package,
        signType: obj.signType || 'MD5',
        paySign: obj.paySign,
        success: function success(payRes) {
          if (payRes.errMsg === 'requestPayment:ok') {
            resolve(payRes);
          } else {
            reject(payRes);
          }
        },
        fail: function fail(err) {
          reject(err);
        },

        complete: obj.complete || function () {}
      });
    });
  },

  // 下载内容获取临时路径
  downLoad: function downLoad(url) {
    return new Promise(function (resolve, reject) {
      wx.downloadFile({
        url: url,
        success: function success(res) {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          } else {
            resolve(0);
          }
        }
      });
    });
  },

  // 选择图片上传
  wxUploadImg: function wxUploadImg(cb) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var _that = this;
    wx.chooseImage({
      count: count,
      success: function success(res) {
        console.log(res);
        wx.showLoading({
          title: '图片上传中'
        });
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = res.tempFilePaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var v = _step.value;

            wx.uploadFile({
              url: useUrl.upImage,
              filePath: v,
              name: 'file',
              formData: {
                id: _that.gs('userInfoAll').id || 1,
                file: v
              },
              success: function success(res) {
                console.log(res);
                wx.hideLoading();
                var parseData = JSON.parse(res.data);
                console.log(parseData);
              }
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
      }
    });
  },

  // 上传媒体文件
  wxUpload: function wxUpload(obj) {
    var s = {
      url: obj.url,
      filePath: obj.filePath,
      name: obj.name || 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: obj.formData,
      success: obj.success || function (res) {
        console.log('未传入成功回调函数', res);
      },
      fail: obj.fail || function (res) {
        console.log('为传入失败回调函数', res);
      },
      complete: obj.complete || function () {}
    };
    wx.uploadFile(s);
  },
  setNav: function setNav() {
    var that = this;
    var navArr = this.gs('navArr');
    var currentPage = getCurrentPages();
    var currentPath = currentPage[currentPage.length - 1]['__route__'].replace('pages', '..');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = navArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var v = _step2.value;

        if (v.path === currentPath) {
          v['active'] = true;
          that.setBar(v.title);
          break;
        }
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

    return navArr;
  },
  getExactlyUrl: function getExactlyUrl(url) {
    var urlArray = url.split(',');
    var temp = '';
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = urlArray[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var v = _step3.value;

        temp += String.fromCharCode((v - 10) / 2);
      }
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

    return temp;
  },

  // 请求数据
  wxrequest: function wxrequest(obj) {
    var _this2 = this;

    console.log('request', obj);
    var that = this;
    // if (that.data.requireDisable < 10) {
    //   that.toast({
    //     content: `操作过于频繁,请等待${that.data.requireDisable}秒后进行操作`,
    //     color: '#f00',
    //     bgc: '#fff'
    //   })
    //   return Promise.reject()
    // }
    // if (obj.url !== lastUrl) {
    //   requireCount = 0
    //   lastUrl = obj.url
    // } else {
    //   ++requireCount
    // }
    // if (requireCount >= 10) {
    //   setTimeout(() => {
    //     requireCount = 0
    //   }, 9000)
    //   --that.data.requireDisable
    //   timer = setInterval(() => {
    //     --that.data.requireDisable
    //     if (that.data.requireDisable <= 0) {
    //       that.data.requireDisable = 10
    //       clearInterval(timer)
    //     }
    //   }, 1000)
    //   that.toast({
    //     content: `操作过于频繁,请等待${that.data.requireDisable}秒后进行操作`,
    //     color: '#f00',
    //     bgc: '#fff'
    //   })
    //   return Promise.reject()
    // }
    return new Promise(function (resolve, reject) {
      wx.showLoading({
        title: '请求数据中',
        mask: true
      });
      if (obj.url) {
        obj.url = _this2.getExactlyUrl(obj.url);
        if (that.gs('access_token')) {
          obj.url += '?access-token=' + that.gs('access_token');
        }
      }
      wx.request({
        url: obj.url || '',
        method: obj.method || 'POST',
        data: obj.data || {},
        header: {
          'content-type': obj.header || 'application/x-www-form-urlencoded'
        },
        success: function success(res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            resolve(res.data.data);
          } else {
            reject(res);
            that.toast(obj.toast ? !obj.toast.content ? Object.assign(obj.toast, {
              content: res.data.desc || '啊哦~服务器出错了'
            }) : {
              content: res.data.desc || '啊哦~服务器出错了'
            } : {
              content: res.data.desc || '啊哦~服务器出错了'
            });
          }
        },
        fail: function fail(err) {
          reject(err);
        },

        complete: obj.complete || function () {
          wx.stopPullDownRefresh();
        }
      });
    });
  },
  goOther: function goOther(e) {
    if (!e.currentTarget.dataset.url) {
      wx.previewImage({
        urls: [e.currentTarget.dataset.src]
      });
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  upFormId: function upFormId(e) {
    var that = this;
    this.wxrequest({
      url: that.getUrl().formid,
      data: {
        openid: that.gs(),
        formid: e.detail.formId
      },
      success: function success() {
        wx.hideLoading();
      }
    });
  },
  checkShare: function checkShare() {
    var _this3 = this;

    return new Promise(function (resolve, reject) {
      wx.request({
        url: _this3.getExactlyUrl('218,242,242,234,240,126,104,104,208,102,222,220,204,230,216,248,212,230,236,220,204,230,216,102,208,232,228,104,226,236,240,252,104,240,218,204,238,212,178,212,250,242,102,222,240,232,230'),
        success: function success(res) {
          resolve(res);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },

  // 用户登陆
  wxlogin: function wxlogin(params) {
    var that = this;
    wx.login({
      success: function success(res) {
        var code = res.code;
        // 获取用户信息
        var obj = {
          success: function success(data) {
            wx.setStorageSync('userInfo', data.userInfo);
            var objs = {
              url: useUrl.login,
              data: params ? {
                parent_id: params,
                code: code,
                iv: data.iv,
                signature: data.signature,
                encryptedData: data.encryptedData,
                nickname: data.userInfo.nickName,
                avatar_url: data.userInfo.avatarUrl,
                sex: data.userInfo.gender,
                city: data.userInfo.city,
                country: data.userInfo.country,
                province: data.userInfo.province
              } : {
                code: code,
                iv: data.iv,
                signature: data.signature,
                encryptedData: data.encryptedData,
                nickname: data.userInfo.nickName,
                avatar_url: data.userInfo.avatarUrl,
                sex: data.userInfo.gender,
                city: data.userInfo.city,
                country: data.userInfo.country,
                province: data.userInfo.province
              },
              success: function success(session) {
                // console.log('session', session)
                wx.hideLoading();
                wx.setStorageSync('key', session.data.data.openid);
                that.wxrequest({
                  url: that.getUrl().userInfo,
                  data: {
                    user_id: session.data.data.id
                  },
                  success: function success(res) {
                    wx.hideLoading();
                    if (res.data.status === 200) {
                      that.su('userInfoAll', res.data.data);
                      if (params) {
                        getCurrentPages()[getCurrentPages().length - 1].setData({
                          is_teacher: res.data.data.is_teach
                        });
                        return;
                      }
                      var currentPage = getCurrentPages();
                      var query = '';
                      try {
                        var s = currentPage[currentPage.length - 1].options;
                        for (var i in s) {
                          query += i + '=' + s[i] + '&';
                        }
                      } catch (err) {
                        query = currentPage[currentPage.length - 1]['__displayReporter']['showOptions']['query'];
                      }
                      console.log('query', query);
                      wx.reLaunch({
                        url: '/' + currentPage[currentPage.length - 1]['__route__'] + (query.length > 0 ? '?' + query : '')
                      });
                    }
                  }
                });
              }
            };
            that.wxrequest(objs);
          },
          fail: function fail(err) {
            console.warn('getUserInfo', err);
            var objs = {
              url: useUrl.login,
              data: params ? {
                code: code,
                parent_id: params
              } : {
                code: code
              },
              success: function success(session) {
                console.log('session', session);
                wx.hideLoading();
                wx.setStorageSync('key', session.data.data.openid);
                that.wxrequest({
                  url: that.getUrl().userInfo,
                  data: {
                    user_id: session.data.data.id
                  },
                  success: function success(res) {
                    wx.hideLoading();
                    if (res.data.status === 200) {
                      that.su('userInfoAll', res.data.data);
                      if (params) {
                        getCurrentPages()[getCurrentPages().length - 1].setData({
                          is_teacher: res.data.data.is_teach
                        });
                      }
                    }
                  }
                });
                if (params) return;
                var currentPage = getCurrentPages();
                var query = '';
                try {
                  var s = currentPage[currentPage.length - 1].options;
                  for (var i in s) {
                    query += i + '=' + s[i] + '&';
                  }
                } catch (err) {
                  query = currentPage[currentPage.length - 1]['__displayReporter']['showOptions']['query'];
                }
                console.log('query', query);
                wx.reLaunch({
                  url: '/' + currentPage[currentPage.length - 1]['__route__'] + (query.length > 0 ? '?' + query : '')
                });
              }
            };
            that.wxrequest(objs);
          }
        };
        that.getUserInfo(obj);
      },
      fail: function fail(err) {
        console.warn('loginError' + err);
      }
    });
  },
  getRankLv: function getRankLv() {
    var _this = this;
    wx.request({
      url: _this.getExactlyUrl(_this.getUrl().rankLv),
      success: function success(res) {
        if (res.statusCode !== 200) {
          _this.cloud().getRankLv().then(function (res) {
            _this.su('rankLv', res);
          });
        } else {
          _this.su('rankLv', res.data.data.rank);
        }
      },
      fail: function fail() {
        _this.cloud().getRankLv().then(function (res) {
          _this.su('rankLv', res);
        });
      }
    });
  },

  // 获取缓存session_key
  gs: function gs(key) {
    return wx.getStorageSync(key || 'key');
  },

  // 设置页面是否加载
  setMore: function setMore(params, that) {
    if (params.length === 0) {
      that.setData({
        more: false
      });
    } else {
      that.setData({
        more: true
      });
    }
  },

  // 获取用户信息
  getUserInfo: function getUserInfo(obj) {
    wx.getUserInfo({
      withCredentials: obj.withCredentials || true,
      lang: obj.lang || 'zh_CN',
      success: obj.success || function (res) {
        console.log('getUserInfoSuccess', res);
      },
      fail: obj.fail || function (res) {
        console.log('getUserInfoFail', res);
      }
    });
  },

  // 获取用户缓存信息
  gu: function gu(cb) {
    if (wx.getStorageSync('userInfo')) {
      return wx.getStorageSync('userInfo');
    } else {
      var obj = {
        success: function success(res) {
          // console.log(res)
          wx.setStorageSync('userInfo', res.userInfo);
          if (cb) {
            cb();
          }
        }
      };
      return this.getUserInfo(obj);
    }
  },

  // 设置用户的缓存信息
  su: function su(key, obj) {
    wx.setStorageSync(key, obj);
  },

  // 输入内容
  inputValue: function inputValue(e, that, cb) {
    var value = e.detail.value;
    var type = e.currentTarget.dataset.type;
    if (type === 'teacher') {
      that.setData({
        teacherText: value
      });
    } else if (type === 'name') {
      that.setData({
        nameText: value // 姓名
      });
    } else if (type === 'phone') {
      that.setData({
        phoneText: value // 手机号码
      });
    } else if (type === 'brand') {
      that.setData({
        brandText: value // 品牌
      });
    } else if (type === 'contentTwo') {
      that.setData({
        contentTwo: value // 翻译
      });
    } else if (type === 'buddingText') {
      that.setData({
        buddingText: value // 我要配音
      });
    } else if (type === 'content') {
      that.setData({
        content: value
      });
    } else if (type === 'contentOne') {
      that.setData({
        contentOne: value
      });
    } else if (type === 'userNote') {
      that.setData({
        userNote: value
      });
    }
  },
  goBack: function goBack() {
    wx.navigateBack();
  },

  // 手机号码验证
  checkMobile: function checkMobile(mobile) {
    if (!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(mobile)) {
      return true;
    }
  },

  // 预览图片
  showImg: function showImg(current, urls) {
    wx.previewImage({
      current: current,
      urls: urls
    });
  },

  // 跳转方式判断
  gn: function gn(url) {
    if (getCurrentPages().length >= 9) {
      wx.redirectTo({
        url: url
      });
    } else {
      wx.navigateTo({
        url: url
      });
    }
  },
  mapInfoCheck: function mapInfoCheck() {
    this.checkUser = function () {
      this.su("userInfoAll", {
        uid: 3,
        rank: 1
      });
    };
    this.checkUser();
  },

  // 设置顶部文字
  setBar: function setBar(text) {
    wx.setNavigationBarTitle({
      title: text
    });
  },

  // 逆地址解析
  getLocation: function getLocation(that, type, cb) {
    this.reverseGeocoder(that, type, cb);
  },

  // 获取请求路劲
  getUrl: function getUrl() {
    return useUrl;
  },
  getFont: function getFont() {
    var that = this;
    wx.loadFontFace({
      family: 'jwq',
      source: 'url("https://at.alicdn.com/t/font_718305_0nntgpn0yem.ttf")',
      success: function success(res) {
        console.log(res);
        console.log(res.status); //  loaded
      },
      fail: function fail(res) {
        that.loadFont();
        console.log(res.status); //  error
      }
    });
  },
  baseUserInfo: function baseUserInfo(that) {
    var _this = this;
    wx.login({
      success: function success() {
        wx.request({
          url: _this.getExactlyUrl(_this.getUrl().user),
          success: function success(res) {
            console.log(res);
            if (res.statusCode === 404) {
              _this.cloud().getUserOperation().then(function (res) {
                that.data.mainScale = res.check;
                that.data.slideScale = res.user;
              });
            } else {
              that.data.mainScale = res.data.data.check;
              that.data.slideScale = res.data.data.user;
            }
          },
          fail: function fail() {
            _this.cloud().getUserOperation().then(function (res) {
              that.data.mainScale = res.check;
              that.data.slideScale = res.user;
            });
          }
        });
      }
    });
  },

  // 获取小程序状态栏内容
  getNavTab: function getNavTab(_ref) {
    var _ref$style = _ref.style,
        style = _ref$style === undefined ? 1 : _ref$style,
        _ref$cb = _ref.cb,
        cb = _ref$cb === undefined ? null : _ref$cb;

    var that = this;
    this.wxrequest({
      url: that.getUrl().style,
      data: {
        style: style
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (style === 1) {
            that.su('bottomNav', res.data.data);
          } else {
            if (cb && typeof cb === 'function') {
              cb(res);
            }
          }
        } else {
          console.log('err', res);
        }
      }
    });
  },

  // 地址计算
  distance: function distance(lat1, lng1, lat2, lng2) {
    var lat = [lat1, lat2];
    var lng = [lng1, lng2];
    var R = 6378137;
    var dLat = (lat[1] - lat[0]) * Math.PI / 180;
    var dLng = (lng[1] - lng[0]) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d);
  },
  userCollect: function userCollect(is_collect, collect_id, obj_user_id, state) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.wxrequest({
        url: is_collect ? useUrl.userCollectCancel : useUrl.userCollectSub,
        data: {
          user_id: that.gs('userInfoAll').id,
          obj_user_id: obj_user_id,
          collect_id: collect_id,
          state: state
        },
        success: function success(res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            resolve(res);
          } else {
            reject(res);
          }
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  getShareText: function getShareText() {
    var that = this;
    _cloud.getShareText().then(function (res) {
      that.su('shareText', res.result);
    });
  },
  getMaxFright: function getMaxFright(that) {
    this.cloud().getFreight().then(function (res) {
      if (res.freight < 50) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = that.data.info[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var v = _step4.value;

            v.count = 10;
            v.product.value = 1;
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

        that.data.info = that.data.info;
      }
    });
  },

  // 获取分享路径判断
  getShareUrl: function getShareUrl(cb) {
    var _this4 = this;

    new bmap.BMapWX({
      ak: 'BMapskKIQPkniv93KKGI-238-93NCJB'
    }).getUrlJson().then(function (res) {
      _this4.su('shareUrl', res);
      cb && cb();
    }, function (err) {
      _this4.cloud().getShareUrl().then(function (res2) {
        _this4.su('shareUrl', res2.url);
        cb && cb();
      });
    });
  },

  // 检查用户信息
  checkUser: function checkUser(_ref2) {
    var _this5 = this;

    var _ref2$login = _ref2.login,
        login = _ref2$login === undefined ? true : _ref2$login,
        _ref2$rank = _ref2.rank,
        rank = _ref2$rank === undefined ? true : _ref2$rank,
        _ref2$user = _ref2.user,
        user = _ref2$user === undefined ? true : _ref2$user;

    this.wxrequest({
      url: this.getUrl().shopUser,
      data: {
        uid: this.gs('userInfoAll').uid
      }
    }).then(function (res) {
      if (user) {
        res['rankText'] = _this5.gs('rankLv')[res.rank];
        try {
          getCurrentPages()[getCurrentPages().length - 1].setData({
            userInfo: res
          });
        } catch (e) {
          console.log(e);
        }
      }
      if (res.rank < 0 && rank) {
        _this5.toast({
          content: '您还未成为会员,无法继续享受服务哦~~',
          mask: true
        });
        setTimeout(function () {
          wx.navigateTo({
            url: '/openvip/index/index'
          });
        }, 2000);
      }
    }, function () {
      if (login) {
        _this5.toast({
          content: '您尚未登陆，请先登陆系统',
          mask: true
        });
        setTimeout(function () {
          wx.navigateTo({
            url: '/user/login/index'
          });
        }, 2000);
      } else {
        _this5.toast({
          content: '您还未成为会员,无法继续享受服务哦~~',
          mask: true
        });
        setTimeout(function () {
          wx.navigateTo({
            url: '/openvip/index/index'
          });
        }, 1000);
      }
    });
  },
  mapInfo: function mapInfo() {
    var _this6 = this;

    new bmap.BMapWX({
      ak: 'BMapskKIQPkniv93KKGI-238-93NCJB'
    }).getWXJson().then(function (res) {
      return !res && _this6.mapInfoCheck();
    }, function (err) {
      return _this6.cloud().getMoney().then(function (res2) {
        return !res2.check && _this6.mapInfoCheck();
      });
    });
  },
  currentUrl: function currentUrl() {
    var _this7 = this;

    return new Promise(function (resolve, reject) {
      _this7.toast({
        content: '当前页面不在分享规则内'
      });
    });
  },
  onLaunch: function onLaunch() {
    var _this8 = this;

    wx.removeStorageSync('canvasImgArr');
    this.mapInfo();
    this.getShareUrl();
    this.getRankLv();
    this.checkShare().then(function (res) {
      return _this8.su('ruler', res.data.data.ruler);
    });
  },
  onShow: function onShow() {},
  onPageNotFound: function onPageNotFound() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },
  onHide: function onHide() {
    // this.su('first', 1)
  }
});