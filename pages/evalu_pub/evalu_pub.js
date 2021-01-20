// pages/evalu_pub/evalu_pub.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaimg: "/image/eva.png",
    eva2img: "/image/eva2.png",
    total: 5,//总体评价
    service: 5,//服务态度
    quality: 5,//施工质量
    repairtime: 5,//维修时间
    orderid: null,
    evatext: null,
    haseva: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderid: options.id,
      haseva: options.haseva
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var token = app.globalData.token
    var that = this;
    wx.request({
      url: 'http://106.13.128.146:8080/PersonOrder',
      method: 'POST',
      header: {
        //'content-type': 'application/x-www-form-urlencoded' ,
        token: token
      },
      data: {
      },
      success(res) {
        console.log(res)
        var ordernum = res.data.listData.length
        for (var i = 0; i < ordernum; i++) {
          if (res.data.listData[i].type == 1) {
            if (res.data.listData[i].processerOrder.orderId == that.data.orderid) {
              that.setData({
                evatext: res.data.listData[i].evaluation.evaluationText,
                total: res.data.listData[i].evaluation.comprehensiveGrade,
                service: res.data.listData[i].evaluation.attitudeGrade,
                quality: res.data.listData[i].evaluation.qualityGrade,
                repairtime: res.data.listData[i].evaluation.durationGrade,
              })
            }
          }
        }
      },
    })
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

  },

  evatextinput: function (e) {
    this.setData({
      evatext: e.detail.value
    })
  },
  img_bind: function (event) {
    var id = event.currentTarget.dataset.item + 1;
    var variable = event.currentTarget.dataset.name;
    console.log(id)
    console.log(variable)
    if (variable == "total")
      this.setData({
        total: id,
      })
    else if (variable == "service")
      this.setData({
        service: id,
      })
    else if (variable == "quality")
      this.setData({
        quality: id,
      })
    else {
      this.setData({
        repairtime: id,
      })
    }
  },
  send: function () {
    var token = app.globalData.token;
    if (this.data.evatext == null) {
      wx.showToast({
        icon: 'none',
        title: '请输入您的评价'
      })
      return false;
    }

    var ComprehensiveGrade = parseInt(this.data.total)
    var AttitudeGrade = parseInt(this.data.service)
    var QualityGrade = parseInt(this.data.quality)
    var DurationGrade = parseInt(this.data.repairtime)
    console.log(this.data.orderid)
    console.log(ComprehensiveGrade)
    console.log(AttitudeGrade)
    console.log(QualityGrade)
    console.log(DurationGrade)
    console.log(this.data.evatext)
    var that = this;
    AttitudeGrade
    wx.request({
      url: 'http://106.13.128.146:8080/Evaluation',
      method: 'POST',
      header: {
        //'content-type': 'application/x-www-form-urlencoded' ,
        token: token
      },
      data: {
        OrderId: that.data.orderid,
        ComprehensiveGrade: ComprehensiveGrade,
        AttitudeGrade: AttitudeGrade,
        QualityGrade: QualityGrade,
        DurationGrade: DurationGrade,
        EvaluationText: that.data.evatext
      },
      success(res) {
        console.log(res)
        wx.hideLoading()
        wx.showModal({
          title: '提交成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      },
      fail() {
        console.log(222)
      }
    })
  }
})