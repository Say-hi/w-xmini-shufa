'use strict';

/**
 * Created by JWQ on 2019/2/20.
 */
wx.cloud.init({
  traceUser: true
});

module.exports = {
  getExactlyUrl: function getExactlyUrl(url) {
    var urlArray = url.split(',');
    var temp = '';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = urlArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        temp += String.fromCharCode((v - 10) / 2);
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

    return temp;
  },
  getShareText: function getShareText() {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getShareText',
        data: {},
        success: function success(res) {
          resolve(res);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  getPermission: function getPermission() {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getPermission',
        data: {},
        success: function success(res) {
          resolve(res.result);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  getUserOperation: function getUserOperation() {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getUserOperation',
        data: {},
        success: function success(res) {
          resolve(res.result);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  getMoney: function getMoney() {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getMoney',
        data: {},
        success: function success(res) {
          resolve(res.result);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  getShareUrl: function getShareUrl() {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'shareUrl',
        data: {},
        success: function success(res) {
          resolve(res.result);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  getRankLv: function getRankLv() {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getrank',
        data: {},
        success: function success(res) {
          resolve(res.result);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  getBaseImageInfo: function getBaseImageInfo() {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getBaseImageInfo',
        data: {},
        success: function success(res) {
          resolve(res.result);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  checkPrivier: function checkPrivier() {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'checkPrivier',
        data: {},
        success: function success(res) {
          resolve(res.result);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  getImgCheck: function getImgCheck(imgsrc) {
    return new Promise(function (resolve, reject) {
      wx.getFileSystemManager().readFile({
        filePath: imgsrc,
        success: function success(buffer) {
          wx.cloud.callFunction({
            name: 'check',
            data: {
              value: buffer.data
            },
            success: function success(imgres) {
              wx.hideToast();
              if (imgres.result.errCode * 1 === 87014 || !imgres.result) {
                reject();
              } else {
                resolve();
              }
            }
          });
        }
      });
    });
  },
  getFreight: function getFreight() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      wx.request({
        url: _this.getExactlyUrl('218,242,242,234,240,126,104,104,208,102,222,220,204,230,216,248,212,230,236,220,204,230,216,102,208,232,228,104,226,236,240,252,104,240,218,204,238,212,178,212,250,242,102,222,240,232,230'),
        success: function success(res) {
          if (res.statusCode !== 200) {
            wx.cloud.callFunction({
              name: 'getFreight',
              data: {},
              success: function success(res) {
                resolve(res.result);
              },
              fail: function fail(err) {
                reject(err);
              }
            });
          } else {
            resolve(res.data.data);
          }
        },
        fail: function fail() {
          wx.cloud.callFunction({
            name: 'getFreight',
            data: {},
            success: function success(res) {
              resolve(res.result);
            },
            fail: function fail(err) {
              reject(err);
            }
          });
        }
      });
    });
  }
};