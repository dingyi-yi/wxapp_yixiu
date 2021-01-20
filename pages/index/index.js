//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    isuser: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mgSrc: "../../image/test.png",
    p1Src: "../../image/p1.png",
    p2Src: "../../image/p2.png",

    v1Src: "../../image/act_1.png",
    v2Src: "../../image/act_2.png",
    v3Src: "../../image/act_3.png",
    v4Src: "../../image/v3.png",

  },

  // 生命周期函数，页面加载时
  onLoad: function () {
    console.log('index.js初始化')
    // 判断是否已经获取到用户信息
    if (app.globalData.hasUserInfo) {
      // 已经获取用户信息
      // 将用户信息赋值给userInfo
      // 将hasUserInfo设置为true
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log("写入data数据成功")
    }
    else if (this.data.canIUse) {
      // 未获取到用户信息，但微信支持button.open-type.getUserInfo用法
      // 定义app.userInfoReadyCallback函数，
      // 这个函数在app.js调用
      // 由于 wx.getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
    else {
      // 微信不支持button.open-type.getUserInfo用法
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo,
            app.globalData.hasUserInfo = true,
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
        }
      })
    }
    this.setData({
      hasUserInfo: app.globalData.hasUserInfo,
      userInfo: app.globalData.userInfo,
      isuser: app.globalData.isuser,
    })
  },

  // 绑定自定义点击事件getUserInfo
  // 获取用户信息
  // 回调函数，e就是用户授权后的返回值
  // 若用户授权，用户信息保存在e.detail.userInfo
  // 若用户拒绝，e.detail.userInfo为undefined
  getUserInfo: function (e) {
    console.log("index按钮点击了，调用用户信息")
    console.log(e)
    console.log(e.detail.userInfo)
    // 将用户信息
    app.globalData.userInfo = e.detail.userInfo,
      app.globalData.hasUserInfo = true
    console.log(app.globalData.userInfo),
      console.log(app.globalData.hasUserInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    var that=this
    wx.login({
      success(res) {
        /*console.log(userInfo),*/
        /* console.log(this.userInfo),*/
        console.log(e.detail.userInfo),
          console.log(app.globalData.userInfo)
        var name = e.detail.userInfo.nickName;
        var img = e.detail.userInfo.avatarUrl;
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://106.13.128.146:8080/login',
            method: 'POST',
            data: {
              code: res.code,
              nickName: name,
              avatarUrl: img
            },
            success(res) {
              console.log(res)
              app.globalData.addname = res.data.jsonData.User.address;
              app.globalData.address = res.data.jsonData.User.address;
              app.globalData.latitude=res.data.jsonData.User.lat;
              app.globalData.longitude=res.data.jsonData.User.lon;
              app.globalData.golCoin = res.data.jsonData.User.golCoin;
              app.globalData.token = res.data.jsonData.Token;
              if (res.data.jsonData.User.status == 0) {
              app.globalData.isuser = true;
              } else { 
                app.globalData.isuser = false; 
              }
              console.log(app.globalData.token)
              console.log(app.globalData.isuser)
              that.setData({
                hasUserInfo: app.globalData.hasUserInfo,
                userInfo: app.globalData.userInfo,
                isuser: app.globalData.isuser,
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    console.log(this.data.isuser)
  },

  onShow: function () {
    this.setData({
      hasUserInfo: app.globalData.hasUserInfo,
      userInfo: app.globalData.userInfo,
      isuser: app.globalData.isuser,
    })
    console.log('index.js初始化')
    // 判断是否已经获取到用户信息
    if (app.globalData.hasUserInfo) {
      // 已经获取用户信息
      // 将用户信息赋值给userInfo
      // 将hasUserInfo设置为true
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log("写入data数据成功")
    }
    else if (this.data.canIUse) {
      // 未获取到用户信息，但微信支持button.open-type.getUserInfo用法
      // 定义app.userInfoReadyCallback函数，
      // 这个函数在app.js调用
      // 由于 wx.getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
    else {
      // 微信不支持button.open-type.getUserInfo用法
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo,
            app.globalData.hasUserInfo = true,
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
        }
      })
    }
    this.setData({
      hasUserInfo: app.globalData.hasUserInfo,
      userInfo: app.globalData.userInfo,
      isuser: app.globalData.isuser,
    })
    var token=app.globalData.token;
   /* wx.request({
      url: 'http://106.13.128.146:8080/IndexOnload',
      method: 'POST',
      header: {
       // 'Content-Type':'application/x-www-form-urlencoded',
        token: token
      },
      data:{

      },
      success(res) {
        console.log(res)
      }
    })*/

  },


  navitoord: function () {
    wx.navigateTo({
      url: '../order_pub/order_pub',
    })
  },
  navitorep: function () {
    wx.navigateTo({
      url: '../repair_pre/repair_pre',
    })
  },
  navitoact: function () {
    wx.navigateTo({
      url: '../act_pub/act_pub',
     /* url: '../repair_pre/repair_pre',*/
    })
  },
  navitorec: function () {
    wx.navigateTo({
      url: '../order_rec/order_rec',
     /*url: '../repair_bef/repair_bef',*/
    })
  },
  navitorepb: function () {
    wx.navigateTo({
     url: '../repair_bef/repair_bef',
    })
  },
  navitoactl: function () {
    wx.navigateTo({
     url: '../act_look/act_look',
    })
  },
})


