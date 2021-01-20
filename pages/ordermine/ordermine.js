// pages/ordermine/ordermine.js
var app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: null,
    isuser: null,
    orderlist: [],
    orderlistnum: 0,
    finorderlist: [],
    finorderlistnum: 0,
    unfinorderlist: [],
    unfinorderlistnum: 0,
    nowlist: [],
    nowlistnum: 0,
    ischoosea: true,

    hiddenmodalput: true,
    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    repprice: null,
    repdescribe: null,
    reporderid: null,
    accepted: false,
    acceptprice: null,
    acceptdescribe: null,
  },



  showitempic: function (e) {
    console.log(e)
    var orderid = e.currentTarget.dataset.orderid
    var token = app.globalData.token
    var that = this;
    wx.request({
      url: 'http://106.13.128.146:8080/DownloadFile',
      method: 'POST',
      header: {
        //'content-type': 'application/x-www-form-urlencoded' ,
        token: token
      },
      data: {
        Type: 1,
        OAId: orderid
      },
      success(res) {
        console.log(res)
        for (var i = 0; i < that.data.unfinorderlistnum; i++) {
          if (orderid == that.data.unfinorderlist[i].orderid) {
            var picnum = res.data.listData.length
            that.setData({
              ['unfinorderlist[' + i + '].showpic']: true,
            })
            console.log(111)
            console.log(that.data.unfinorderlist)
            for (var j = 0; j < picnum; j++) {
              that.setData({
                ['unfinorderlist[' + i + '].fault_img[' + j + '].orderImage']: 'data:image/png;base64,' + res.data.listData[j].orderImage
              })
            }
          }
        }
        console.log(that.data.unfinorderlist)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      userInfo: app.globalData.userInfo,
      isuser: app.globalData.isuser,
      nowlist: [],
      unfinorderlist: [],
      finorderlist: [],
      orderlist: []
    })
    if (options == false) {
      this.setData({
        ischoosea: false
      })
    } else {
      this.setData({
        ischoosea: true
      })
    }

    console.log(this.data.userInfo)
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
        that.setData({
          orderlistnum: ordernum
        })
        console.log(ordernum)
        var k = 0;
        var m = 0;
        for (var i = 0; i < ordernum; i++) {
          if (res.data.listData[i].type == 0) {
            let order = {
              pub_user: res.data.listData[i].orderWxName,
              pub_user_img: res.data.listData[i].orderHeadPortrait,
              type: res.data.listData[i].type,
              time_publish: res.data.listData[i].untreatedOrder.releaseTime,
              applian_cate: res.data.listData[i].untreatedOrder.kind,
              service_cate: res.data.listData[i].untreatedOrder.serviceType,
              service_place: res.data.listData[i].untreatedOrder.paddress,
              orderid: res.data.listData[i].untreatedOrder.orderId,
              service_time: res.data.listData[i].untreatedOrder.expectTime,
              fault_text: res.data.listData[i].untreatedOrder.describe,
              phone: res.data.listData[i].untreatedOrder.phone,
              showpic: false,
              fault_img: [{}],
              acceptmine: res.data.listData[i].takeOrder,
              takeOrderCompanyList: res.data.listData[i].takeOderCompanyList,
              finnaltakeOrderCompany:res.data.listData[i].takeOderCompany,
              acceptprice: 100,
              acceptdescribe: "假装这里有一个接单信息",
              berecd: false,
              evaluation:res.data.listData[i].evaluation
            }
            if (res.data.listData[i].takeOderCompanyList == null)
              order.berecd = false;
            else
              order.berecd = true;

            switch (order.service_cate) {
              case (1): { order.service_cate = "上门服务"; break; }
              case (2): { order.service_cate = "到店服务"; break; }
            }
            var json_dateP = new Date(order.time_publish).toJSON();
            var showPDay = new Date(new Date(json_dateP) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') ;
            order.time_publish =util.formatTime(new Date(showPDay))
           
            var json_dateE = new Date(order.service_time).toJSON();
            var showEDay = new Date(new Date(json_dateE) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            order.service_time =  util.formatTime(new Date(showEDay))
            that.setData({
              ['unfinorderlist[' + k + ']']: order,
            })
            k++;
            that.setData({
              unfinorderlistnum: k
            })
            console.log(that.data.unfinorderlist)
          }
          if (res.data.listData[i].type == 1) {
            let order = {
              pub_user: res.data.listData[i].orderWxName,
              pub_user_img: res.data.listData[i].orderHeadPortrait,
              type: res.data.listData[i].type,
              time_publish: res.data.listData[i].processerOrder.releaseTime,
              applian_cate: res.data.listData[i].processerOrder.kind,
              service_cate: res.data.listData[i].processerOrder.serviceType,
              service_place: res.data.listData[i].processerOrder.paddress,
              orderid: res.data.listData[i].processerOrder.orderId,
              service_time: res.data.listData[i].processerOrder.expectTime,
              fault_text: res.data.listData[i].processerOrder.describe,
              phone: res.data.listData[i].processerOrder.phone,
              showpic: false,
              fault_img: [{}],
              acceptmine: res.data.listData[i].takeOrder,
              takeOrderCompanyList: res.data.listData[i].takeOderCompanyList,
              finnaltakeOrderCompany:res.data.listData[i].takeOderCompany,
              acceptprice: 100,
              acceptdescribe: "假装这里有一个接单信息",
              berecd: true,
              evaluation:res.data.listData[i].evaluation
            }

            switch (order.service_cate) {
              case (1): { order.service_cate = "上门服务"; break; }
              case (2): { order.service_cate = "到店服务"; break; }
            }
            var json_dateP = new Date(order.time_publish).toJSON();
            var showPDay = new Date(new Date(json_dateP) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') ;
            order.time_publish =util.formatTime(new Date(showPDay))
           
            var json_dateE = new Date(order.service_time).toJSON();
            var showEDay = new Date(new Date(json_dateE) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            order.service_time =  util.formatTime(new Date(showEDay))
            that.setData({
              ['finorderlist[' + m + ']']: order,
            })
            m++;
            that.setData({
              finorderlistnum: m
            })
            console.log(that.data.finorderlist)
          }

        }
        if (that.data.ischoosea == true) {
          that.setData({
            nowlist: that.data.unfinorderlist,
            nowlistnum: that.data.unfinorderlistnum,
          })
        }
        else {
          that.setData({
            nowlist: that.data.finorderlist,
            nowlistnum: that.data.finorderlistnum
          })
        }
        console.log(that.data.nowlist)
      }
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
  onShow: function(options) {
    console.log(options)
    this.setData({
      userInfo: app.globalData.userInfo,
      isuser: app.globalData.isuser,
      nowlist: [],
      unfinorderlist: [],
      finorderlist: [],
      orderlist: []
    })
    if (options == false) {
      this.setData({
        ischoosea: false
      })
    } else {
      this.setData({
        ischoosea: true
      })
    }

    console.log(this.data.userInfo)
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
        that.setData({
          orderlistnum: ordernum
        })
        console.log(ordernum)
        var k = 0;
        var m = 0;
        for (var i = 0; i < ordernum; i++) {
          if (res.data.listData[i].type == 0) {
            let order = {
              pub_user: res.data.listData[i].orderWxName,
              pub_user_img: res.data.listData[i].orderHeadPortrait,
              type: res.data.listData[i].type,
              time_publish: res.data.listData[i].untreatedOrder.releaseTime,
              applian_cate: res.data.listData[i].untreatedOrder.kind,
              service_cate: res.data.listData[i].untreatedOrder.serviceType,
              service_place: res.data.listData[i].untreatedOrder.paddress,
              orderid: res.data.listData[i].untreatedOrder.orderId,
              service_time: res.data.listData[i].untreatedOrder.expectTime,
              fault_text: res.data.listData[i].untreatedOrder.describe,
              phone: res.data.listData[i].untreatedOrder.phone,
              showpic: false,
              fault_img: [{}],
              acceptmine: res.data.listData[i].takeOrder,
              takeOrderCompanyList: res.data.listData[i].takeOderCompanyList,
              finnaltakeOrderCompany:res.data.listData[i].takeOderCompany,
              acceptprice: 100,
              acceptdescribe: "假装这里有一个接单信息",
              berecd: false,
              evaluation:res.data.listData[i].evaluation
            }
            if (res.data.listData[i].takeOderCompanyList == null)
              order.berecd = false;
            else
              order.berecd = true;

            switch (order.service_cate) {
              case (1): { order.service_cate = "上门服务"; break; }
              case (2): { order.service_cate = "到店服务"; break; }
            }
            var json_dateP = new Date(order.time_publish).toJSON();
            var showPDay = new Date(new Date(json_dateP) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') ;
            order.time_publish =util.formatTime(new Date(showPDay))
           
            var json_dateE = new Date(order.service_time).toJSON();
            var showEDay = new Date(new Date(json_dateE) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            order.service_time =  util.formatTime(new Date(showEDay))
            that.setData({
              ['unfinorderlist[' + k + ']']: order,
            })
            k++;
            that.setData({
              unfinorderlistnum: k
            })
            console.log(that.data.unfinorderlist)
          }
          if (res.data.listData[i].type == 1) {
            let order = {
              pub_user: res.data.listData[i].orderWxName,
              pub_user_img: res.data.listData[i].orderHeadPortrait,
              type: res.data.listData[i].type,
              time_publish: res.data.listData[i].processerOrder.releaseTime,
              applian_cate: res.data.listData[i].processerOrder.kind,
              service_cate: res.data.listData[i].processerOrder.serviceType,
              service_place: res.data.listData[i].processerOrder.paddress,
              orderid: res.data.listData[i].processerOrder.orderId,
              service_time: res.data.listData[i].processerOrder.expectTime,
              fault_text: res.data.listData[i].processerOrder.describe,
              phone: res.data.listData[i].processerOrder.phone,
              showpic: false,
              fault_img: [{}],
              acceptmine: res.data.listData[i].takeOrder,
              takeOrderCompanyList: res.data.listData[i].takeOderCompanyList,
              finnaltakeOrderCompany:res.data.listData[i].takeOderCompany,
              acceptprice: 100,
              acceptdescribe: "假装这里有一个接单信息",
              berecd: true,
              evaluation:res.data.listData[i].evaluation
            }

            switch (order.service_cate) {
              case (1): { order.service_cate = "上门服务"; break; }
              case (2): { order.service_cate = "到店服务"; break; }
            }
            var json_dateP = new Date(order.time_publish).toJSON();
            var showPDay = new Date(new Date(json_dateP) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') ;
            order.time_publish =util.formatTime(new Date(showPDay))
           
            var json_dateE = new Date(order.service_time).toJSON();
            var showEDay = new Date(new Date(json_dateE) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            order.service_time =  util.formatTime(new Date(showEDay))
            that.setData({
              ['finorderlist[' + m + ']']: order,
            })
            m++;
            that.setData({
              finorderlistnum: m
            })
            console.log(that.data.finorderlist)
          }

        }
        if (that.data.ischoosea == true) {
          that.setData({
            nowlist: that.data.unfinorderlist,
            nowlistnum: that.data.unfinorderlistnum,
          })
        }
        else {
          that.setData({
            nowlist: that.data.finorderlist,
            nowlistnum: that.data.finorderlistnum
          })
        }
        console.log(that.data.nowlist)
      }
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
  /*导航栏切换*/
  choosea: function (e) {
    if (this.data.ischoosea == true)
      return;
    else {
      this.setData({
        ischoosea: true,
      })
      this.onLoad(this.data.ischoosea)
    }
  },
  chooseb: function (e) {
    if (this.data.ischoosea == false)
      return;
    else {
      this.setData({
        ischoosea: false,
      })
      this.onLoad(this.data.ischoosea)
    }
  },


  //点击按钮弹窗指定的hiddenmodalput弹出框
  modalinput: function (e) {
    console.log(e)
    var orderid = e.currentTarget.dataset.orderid
    this.setData({
      accepted: false,
      reporderid: orderid,
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认
  confirm: function (e) {
    console.log(e)
    this.setData({
      hiddenmodalput: true
    })
  },
  /*已接单时点击按钮事件*/
  showmodal: function (e) {
    console.log(e)
    var orderid = e.currentTarget.dataset.orderid
    for (var i = 0; i < this.data.unfinorderlistnum; i++) {
      console.log(i)
      if (orderid == this.data.unfinorderlist[i].orderid) {
        console.log(i)
        this.setData({
          accepted: true,
          hiddenmodalput: !this.data.hiddenmodalput,
          acceptprice: this.data.unfinorderlist[i].acceptprice,
          acceptdescribe: this.data.unfinorderlist[i].acceptdescribe,
        })
      }
    }
  },
  /*展示商家接单时的信息*/
  showmorebus: function (e) {
    console.log(e)
    this.setData({
      accepted: true,
      hiddenmodalput: !this.data.hiddenmodalput,
      acceptprice: e.currentTarget.dataset.item.expectedPrice,
      acceptdescribe: e.currentTarget.dataset.item.expectedScheme,
    })
  },
  /*选择商家*/
  choosebus: function (e) {
    console.log(e)
    var openid = e.currentTarget.dataset.openid
    var orderid = e.currentTarget.dataset.orderid
    var token = app.globalData.token
    var that = this
    wx.request({
      url: 'http://106.13.128.146:8080/ChoseCompany',
      method: 'POST',
      header: {
        //'content-type': 'application/x-www-form-urlencoded' ,
        token: token
      },
      data: {
        OrderId: orderid,
        MerchantId: openid,
      },
      success(res) {
        console.log(222)
        console.log(res)
        wx.showModal({
          title: '选择成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              that.onLoad();
            }
          }
        })
      },
       fail() {
        console.log(333)
      }
    })
  },
  navitoeva:function(e){
    console.log(e)
    var orderid=e.currentTarget.dataset.orderid
    var evaluation=e.currentTarget.dataset.eva
    if(evaluation==null)
    var haseva=false
    else
    var haseva=true
    wx.navigateTo({
      url: '../evalu_pub/evalu_pub?id='+orderid+"&haseva="+haseva
    })
  }
})
