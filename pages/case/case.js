// pages/case.js
var app = getApp();
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    caselistnum:null,
    caselist: [
      { pub_user_img: "../../image/tabbar_index.png",pub_user: '用户名称', publishTime: '2020-12-16', appliancesType: "冰箱", maintenanceCompany: "京华数码", caseDescription: "描述文本",  price: "105元",showpic:false,  case_img:[{}],caseId:100},
    ],
    hasUserInfo: null,
    searchcontent:'',

  },
  searchcontentInput:function(e){
    this.setData({
      searchcontent: e.detail.value
    })
    console.log(this.data.searchcontent)
  },
  tosearch:function(){
    this.setData({
      caselist:{}
    })
    if (this.data.searchcontent=='') {
      wx.showToast({
        icon:'none',
        title: '请输入搜索内容'
      })
      return false;
    }
    var that = this;
    var token=app.globalData.token;
    wx.request({
      url: 'http://106.13.128.146:8080/GainCase',
      method: 'POST',
      header: {
        //'content-type': 'application/x-www-form-urlencoded' ,
        token: token
      },
      data: {
        AppliancesType:that.data. searchcontent
      },
      success(res) {
        console.log(res)
        var casenum = res.data.listData.length
        that.setData({
          caselistnum: casenum
        })
        console.log(casenum)

        for (var i = 0; i <casenum; i++) {
          let case1 = {
            pub_user: res.data.listData[i].caseWxName,
            pub_user_img: res.data.listData[i].caseHeadPortrait,
            appliancesType: res.data.listData[i].caseContent.appliancesType,
            caseDescription: res.data.listData[i].caseContent.caseDescription,
            maintenanceCompany: res.data.listData[i].caseContent.maintenanceCompany,
            publishTime: res.data.listData[i].caseContent.publishTime,
            price: res.data.listData[i].caseContent.price,
            caseId: res.data.listData[i].caseContent.caseId,
            showpic: false,
            case_img:[{}]
          }
          /*case1.publishTime = case1.publishTime.toLocaleDateString();*/
          var json_dateP = new Date(case1.publishTime).toJSON();
          var showPDay = new Date(+new Date(json_dateP) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') ;
          case1.publishTime=util.formatTime(new Date(showPDay))
        
          that.setData({
            ['caselist[' + i + ']']: case1
          })
          console.log(that.data.caselist)
        }
      }
    })
  },
  showitempic: function (e) {
    console.log(e)
    var caseId=e.currentTarget.dataset.caseid
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
              Type:3,
              OAId:caseId
          },
          success(res) {
            console.log(res)
            for (var i = 0; i < that.data.caselistnum; i++) {
            if(caseId==that.data.caselist[i].caseId){
              var picnum=res.data.listData.length
             that.setData({
              ['caselist[' + i + '].showpic']:true
            })
            console.log(111)
            console.log(that.data.caselist)
             for(var j=0;j<picnum;j++){
              that.setData({
              ['caselist[' + i + '].case_img['+j+'].caseImage']:'data:image/png;base64,'+res.data.listData[j].caseImage
             })
            }
              console.log(that.data.caselist)
           }
        }
        console.log(that.data.caselist)
      }
    })
  },

  navitocompub: function () {
    wx.navigateTo({
      url: '../case_pub/case_pub'//转到一个页面
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hasUserInfo: app.globalData.hasUserInfo
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
  onShow: function () {
    this.setData({
      hasUserInfo: app.globalData.hasUserInfo,
        caselist:{}
    })
    var token = app.globalData.token
    var that = this;
    wx.request({
      url: 'http://106.13.128.146:8080/CaseLoad',
      method: 'POST',
      header: {
        //'content-type': 'application/x-www-form-urlencoded' ,
        token: token
      },
      data: {

      },
      success(res) {
        console.log(res)
        var casenum = res.data.listData.length
        that.setData({
          caselistnum: casenum
        })
        console.log(casenum)

        for (var i = 0; i <casenum; i++) {
          let case1 = {
            pub_user: res.data.listData[i].caseWxName,
            pub_user_img: res.data.listData[i].caseHeadPortrait,
            appliancesType: res.data.listData[i].caseContent.appliancesType,
            caseDescription: res.data.listData[i].caseContent.caseDescription,
            maintenanceCompany: res.data.listData[i].caseContent.maintenanceCompany,
            publishTime: res.data.listData[i].caseContent.publishTime,
            price: res.data.listData[i].caseContent.price,
            caseId: res.data.listData[i].caseContent.caseId,
            showpic: false,
            case_img:[{}]
 
          }
          var json_dateP = new Date(case1.publishTime).toJSON();
          var showPDay = new Date(+new Date(json_dateP) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') ;
          case1.publishTime=util.formatTime(new Date(showPDay))
        
          that.setData({
            ['caselist[' + i + ']']: case1
          })
          console.log(that.data.caselist)
        }
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

  }
  ,
   })
