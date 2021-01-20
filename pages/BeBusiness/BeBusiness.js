// pages/BeBusiness/BeBusiness.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    role: null,
    bebus: 1,
    isuser: app.globalData.isuser,
    addname: null,
    address: null,
    latitude: null,
    longitude: null,
    bName: {},
    LegalRepre: null,
    ship: null,
    LicenseNo: null,
    specialBrand: null,
    scope: null,
    remarks: null

  },
  bNameInput: function (e) {
    this.setData({
      bName: e.detail.value
    })
    console.log(this.data.bName)
  },
  LegalRepreInput: function (e) {
    this.setData({
      LegalRepre: e.detail.value
    })
  },
  shipInput: function (e) {
    this.setData({
      ship: e.detail.value
    })
  },
  LicenseNoInput: function (e) {
    this.setData({
      LicenseNo: e.detail.value
    })
  },
  specialBrandInput: function (e) {
    this.setData({
      specialBrand: e.detail.value
    })
  },
  scopeInput: function (e) {
    this.setData({
      scope: e.detail.value
    })
  },
  remarksInput: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  getLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var name = res.name
        var address = res.address
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(res)
        that.setData({
          addname: name,
          address: address,
          latitude: latitude,
          longitude: longitude,
        })
      },
      complete(r) {
        console.log(r)
      }
    })
  },
  send: function () {
    var token=app.globalData.token;
    if (this.data.bName == null) {
      wx.showToast({
        icon: 'none',
        title: '请输入商店名称'
      })
      return false;
    }
    console.log(this.data.addname)
    if (this.data.addname == null || this.data.addname == ' ') {
      wx.showToast({
        icon: 'none',
        title: '请选择地址'
      })
      return false;
    }
    if (this.data.LegalRepre == null) {
      wx.showToast({
        icon: 'none',
        title: '请输入法人代表'
      })
      return false;
    }
    if (this.data.ship == null) {
      wx.showToast({
        icon: 'none',
        title: '请输入公司性质'
      })
      return false;
    }
    if (this.data.LicenseNo == null) {
      wx.showToast({
        icon: 'none',
        title: '请输入许可证编号'
      })
      return false;
    }
    if (this.data.scope == null) {
      wx.showToast({
        icon: 'none',
        title: '请输入维修范围'
      })
      return false;
    }
    console.log(this.data.bName)
    var that = this;
    var user_id = wx.getStorageSync('userid')
    wx.showLoading({
      title: '上传中',
    })
    console.log(that.data.bName)
    wx.request({
      url: 'http://106.13.128.146:8080/LicencedHouse',
      method: 'POST',
      header: {
        //'content-type': 'application/x-www-form-urlencoded' ,
        token: token
      },
      data: {
        bName: this.data.bName,
        LegalRepre: this.data.LegalRepre,
        ship: this.data.ship,
        LicenseNo: this.data.LicenseNo,
        specialBrand: this.data.specialBrand,
        scope: this.data.scope,
        remarks: this.data.remarks,
        bAdd: this.data.address,
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      success(res) {
        console.log(res)
        wx.hideLoading()
        wx.showModal({
          title: '提交成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              app.globalData.isuser=false;
              app.globalData.addname=that.data.address;
              wx.switchTab({
                url: '../person/person',
              })
            }
          }
        })
      },
      fail(err) {
        console.log(err)
      }
    })


  },



  /**
   * 生命周期函数--监听页面加载
   */
  updateisuser: function () {
    /* getApp().globalData.isuser=false*/
  },
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData.isuser);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})