module.exports = {
  extends: 'standard',
  plugins: [
    'standard',
    'promise',
    'json'
  ],
  globals: {
    App: true,
    Page: true,
    getApp: true,
    Component: true,
    getCurrentPages: true,
    wx: true,
    noUse: true
  },
  'rules': {
    // 'space-before-function-paren': 'off',
    'no-unused-vars': 1,
    'no-useless-computed-key': 1
    // "space-before-function-paren": 'off'
  }
};