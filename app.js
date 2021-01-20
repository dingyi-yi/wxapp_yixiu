//app.js
App({
  globalData: {
    isuser: true,
    wechatUserType: 'normal',
    featureManager: {},
    userInfo: null,
    currentCustomer: null,
    hasUserInfo: null,
    addname: null,
    address: null,
    latitude: null,
    longitude: null,
    golCoin: 0,
    token: null
  },

  onLaunch: function () {
    console.log("app.js初始化")
    var that = this
    // 展示本地存储能力
    // 往本地存储写入log数据，登录日志
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // 用户登录小程序
    /* wx.login({
       success: res => {
         // 登录成功后的回调
         // 发送 res.code 到后台换取 openId, sessionKey, unionId
         console.log('wx.login登录成功')
       }
     })*/
    // 重点在这
    // 获取用户的设置，返回用户的授权信息
    // 判断用户是否授权，若已经授权，调用wx.getUserInfo接口获取用户信息，
    // 将获取的信息存到全局状态this.globalData.userInfo
    // 若用户未授权，直接跳过，进入index页面
    wx.getSetting({
      success: res => {
        // 获取成功的回调
        console.log('获取用户的当前设置,返回授权后的信息')
        console.log(res)

        //判断用户是否授权
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，则无需重复授权
          // 可以直接调用 wx.getUserInfo 获取用户信息，不会弹框
          console.log("用户已经授权")
          wx.getUserInfo({
            success: res => {
              // 获取用户信息成功后的回调
              // 可以将 res 发送给后台解码出 unionId
              // 将用户信息赋值给this.globalData.userInfo
              that.globalData.userInfo = res.userInfo,
                that.globalData.hasUserInfo = true
              console.log('app.js中获取用户信息成功') 
              wx.login({
                success(res) {
                  var name=that.globalData.userInfo.nickName;
                  var img = that.globalData.userInfo.avatarUrl;
                  if (res.code) {
                    //发起网络请求
                    wx.request({
                      url: 'http://106.13.128.146:8080/login',
                      method: "POST",
                      data: {
                        code: res.code,
                        nickName: name,
                        avatarUrl: img
                      },
                      success(res) {
                        console.log(res),
                        that.globalData.addname = res.data.jsonData.User.address;
                        that.globalData.address=res.data.jsonData.User.address;
                        that.globalData.latitude=res.data.jsonData.User.lat;
                        that.globalData.longitude=res.data.jsonData.User.lon;
                        that.globalData.golCoin = res.data.jsonData.User.golCoin;
                        that.globalData.token=res.data.jsonData.Token;
                        if(res.data.jsonData.User.status==0){
                          that.globalData.isuser=true;
                          } else{ that.globalData.isuser=false;}
                          console.log(that.globalData.isuser)
                      }
                    })
                  } 
                  else {
                    console.log('登录失败！' + res.errMsg)}
                  }
              })




              
  
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // app.userInfoReadyCallback是在index的onLoad函数中定义的
              // 判断userInfoReadyCallback这个属性是否存在
              // 如果存在，则执行，将用户数据赋值给globalData及index中的data
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
          })
        }
      }
    })
  },

  /*onLoad: function () {
    // 查看是否授权
    console.log(event.detail.userInfo)
    //使用
    console.log(121212)
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: function (res) {
              var code = res.code;//登录凭证
              console.log(131313)
              if (code) {
                //2、调用获取用户信息接口
                wx.getUserInfo({
                  success: function (res) {
                    console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code }),
                    console.log(res),
                    console.log(res.detail.rawData)
                    console.log(141414)
                    //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                    wx.request({
                      url: 'http://106.13.128.146:8080/login',//自己的服务接口地址
                      method: 'post',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      data: { 
                        encryptedData: res.encryptedData, 
                        iv: res.iv, 
                        code: code ,
                      },
                      success: function (data) 
                      {
                        //4.解密成功后 获取自己服务器返回的结果
                        if (data.data.status == 1) {
                          var userInfo_ = data.data.userInfo;
                          console.log(userInfo_)
                        } else {
                          console.log('解密失败')
                        }

                      },
                      fail: function () {
                        console.log('系统错误')
                      }
                    })
                  },
                  fail: function () {
                    console.log('获取用户信息失败')
                  }
                })

              } else {
                console.log('获取用户登录态失败！' + r.errMsg)
              }
            },
            fail: function () {
              console.log('登陆失败')
            }
          })

        } else {
          console.log('获取用户信息失败')

        }

      }
    })
  },*/

})