// pages/acc/acc.js
var app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actlistnum: [],
    actnum: 0,
    v3Src: "/images/v3.png",
  },

  jpf: function () {
    wx.navigateTo({
      url: '../act_pub/act_pub',
      success: function (res) {

      },
      fail: function (res) {

      },
      complete: function (res) {

      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.setData({
      actlist: {}
    })
    console.log(this.data.actlist)
    var token = app.globalData.token;
    var that = this;
    wx.request({
      url: 'http://106.13.128.146:8080/PersonActivity',
      method: 'POST',
      header: {
        // 'Content-Type':'application/x-www-form-urlencoded',
        token: token
      },
      data: {

      },
      success(res) {
        console.log(res)
        var actnum = res.data.listData.length
        that.setData({
          actlistnum: actnum
        })
        for (var i = 0; i < actnum; i++) {
          let act1 = {
            pub_user: res.data.listData[i].firmName,
            pub_user_img: res.data.listData[i].tradeMark,
            activeName: res.data.listData[i].activityContent.activeName,
            activityAdress:res.data.listData[i].activityAdress,
            activeId: res.data.listData[i].activityContent.activeId,
            startTime: res.data.listData[i].activityContent.startTime,
            endTime: res.data.listData[i].activityContent.endTime,
            activeDescription: res.data.listData[i].activityContent.activeDescription,
            hasimg:false,
            act_img: [{}]
          }
          var json_dateS = new Date(act1.startTime).toJSON();
          var showSDay = new Date(new Date(json_dateS) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
          act1.startTime = util.formatTime(new Date(showSDay))
         
          var json_dateE = new Date(act1.endTime).toJSON();
          var showEDay = new Date(new Date(json_dateE) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
          act1.endTime = util.formatTime(new Date(showEDay))
          that.setData({
            ['actlist[' + i + ']']: act1
          })
          console.log(that.data.actlist)
          var actid = res.data.listData[i].activityContent.activeId
          that.showpic(actid)
          console.log(actid)
        }
      }
    })
  },
  showpic: function (actid) {
    var token = app.globalData.token;
    var that = this
    console.log(actid)
    wx.request({
      url: 'http://106.13.128.146:8080/DownloadFile',
      method: 'POST',
      header: {
        //'content-type': 'application/x-www-form-urlencoded' ,
        token: token
      },
      data: {
        Type: 2,
        OAId: actid
      },
      success(res) {
        console.log(res)
        var actnum=that.data.actlistnum
        for (var i = 0; i < actnum; i++) {
          if (actid == that.data.actlist[i].activeId) {
            var picnum = res.data.listData.length
            if(picnum>0)
            that.setData({
              ['actlist[' + i + '].hasimg']:true
            })
            for (var j = 0; j < picnum; j++) {
              that.setData({
                ['actlist[' + i + '].act_img[' + j + '].actImage']: 'data:image/png;base64,' + res.data.listData[j].activeImage
              })
              console.log(that.data.actlist)
            }
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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