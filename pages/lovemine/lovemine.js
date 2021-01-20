// pages/commun/commun.js
var app = getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comlistnum: null,
    comlist: [],
    hasUserInfo: null,
  },



  navitocompub: function () {
    wx.navigateTo({
      url: '../com_pub/com_pub'//转到一个页面
    })
  },
  //展示图片
  showitempic: function (e) {
    console.log(e)
    var communityid = e.currentTarget.dataset.communityid
    var token = app.globalData.token
    var that = this;
    console.log(communityid)
    wx.request({
      url: 'http://106.13.128.146:8080/DownloadFile',
      method: 'POST',
      header: {
        //'content-type': 'application/x-www-form-urlencoded' ,
        token: token
      },
      data: {
        Type: 4,
        OAId: communityid
      },
      success(res) {
        console.log(res)
        for (var i = 0; i < that.data.comlistnum; i++) {
          if (communityid == that.data.comlist[i].communityId) {
            var picnum = res.data.listData.length
            that.setData({
              ['comlist[' + i + '].showpic']: true
            })
            console.log(111)
            console.log(that.data.comlist)
            for (var j = 0; j < picnum; j++) {
              that.setData({
                ['comlist[' + i + '].com_img[' + j + '].comImage']: 'data:image/png;base64,' + res.data.listData[j].communityImage
              })
            }
            console.log(that.data.comlist)
          }
        }
        console.log(that.data.comlist)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hasUserInfo: app.globalData.hasUserInfo,
      comlist: [],
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
      comlist: [],
    })
    var token = app.globalData.token
    var that = this;

    wx.request({
      url: 'http://106.13.128.146:8080/PersonCollect',
      method: 'POST',
      header: {
        //'content-type': 'application/x-www-form-urlencoded' ,
        token: token
      },
      data: {
        CommunityKind: '',
        SearchContent: '',
      },
      success(res) {
        console.log(res)
        var commun_num = res.data.listData.length
        that.setData({
          comlistnum: commun_num
        })
        console.log(commun_num)
        for (var i = 0; i < commun_num; i++) {
          let com1 = {
            pub_user: res.data.listData[i].communityWxName,//发布者
            pub_user_img: res.data.listData[i].communityHeadPortrait,//发布者头像
            publishTime: res.data.listData[i].communityContent.publishDate,//发布日期
            communityId: res.data.listData[i].communityContent.communityId,//社区信息id
            communityKind: res.data.listData[i].communityContent.communityKind,//社区信息类型
            communityDescription: res.data.listData[i].communityContent.communityDescription,//社区信息文本
            showpic: false,
            com_img: [],
            like: res.data.listData[i].like,
            collect: res.data.listData[i].collect,
            cancomment: false,
            nowcomment: null,
            hascomment:false,
            comments: [],
          }
          var json_dateP = new Date(com1.publishTime).toJSON();
          var showPDay = new Date(new Date(json_dateP) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') ;
          com1.publishTime=util.formatTime(new Date(showPDay))
          that.setData({
            ['comlist[' + i + ']']: com1
          })
          var comment_num = res.data.listData[i].communityComment.length
          if(comment_num>0)
          that.setData({
            ['comlist[' + i + '].hascomment']: true
          })
          for (var j = 0; j <  comment_num; j++) {
            that.setData({
              ['comlist[' + i + '].comments[' + j + '].comment_user']: res.data.listData[i].communityComment[j].commentWxName,
              ['comlist[' + i + '].comments[' + j + '].comment_text']: res.data.listData[i].communityComment[j].commentContent,
            })
          }

          console.log(that.data.comlist)
        }
        
      }
    })
  },
/*点赞*/
bindlike: function (e) {
  console.log(e)
  var communityid = e.currentTarget.dataset.communityid
  for (var i = 0; i < this.data.comlistnum; i++) {
    if (communityid == this.data.comlist[i].communityId) {
      if (this.data.comlist[i].like == true)
        return;
      this.setData({
        ['comlist[' + i + '].like']: true
      })
    }
  }
  var token = app.globalData.token
  var that = this;
  wx.request({
    url: 'http://106.13.128.146:8080/CommunityLike',
    method: 'POST',
    header: {
      //'content-type': 'application/x-www-form-urlencoded' ,
      token: token
    },
    data: {
      CommunityId: communityid
    },
    success(res) {
      console.log(res)
    }
  })
},
/*评论*//*展示评论框*/
bindcomment: function (e) {
  console.log(e)
  var communityid = e.currentTarget.dataset.communityid
  for (var i = 0; i < this.data.comlistnum; i++) {
    if (communityid == this.data.comlist[i].communityId) {
      var before=this.data.comlist[i].cancomment;
      this.setData({
        ['comlist[' + i + '].cancomment']:!before
      })
    }
  }
},
/*输入评论文字*/
commentcontentInput: function (e) {
  console.log(e)
  var communityid = e.currentTarget.dataset.communityid
  var commentContent = e.detail.value
  for (var i = 0; i < this.data.comlistnum; i++) {
    if (communityid == this.data.comlist[i].communityId) {
      this.setData({
        ['comlist[' + i + '].nowcomment']: commentContent
      })
    }
  }
  console.log(this.data.comlist)
},
/*点击评论*/
tocomment: function (e) {
  console.log(e)
  console.log(this.data.comlist)
  var communityid = e.currentTarget.dataset.communityid

  for (var i = 0; i < this.data.comlistnum; i++) {
    console.log(i)
    if (communityid == this.data.comlist[i].communityId) {
      console.log(i)
      var commentContent = this.data.comlist[i].nowcomment
      if (commentContent == null || commentContent == '') {
        return;
      }
      var token = app.globalData.token
      wx.request({
        url: 'http://106.13.128.146:8080/CommunityComment',
        method: 'POST',
        header: {
          //'content-type': 'application/x-www-form-urlencoded' ,
          token: token
        },
        data: {
          CommunityId: communityid,
          CommentContent: commentContent,
        },
        success(res) {
          console.log(res)
        }
      })
      this.setData({
        ['comlist[' + i + '].nowcomment']: '',
        ['comlist[' + i + '].cancomment']: false
      })
     wx.showLoading({
       title: '发布中',
     })
      this.onLoad();
      wx.hideLoading({
        success: (res) => {},
      })
    }
  }
},
/*收藏*/
bindcollect: function (e) {
  console.log(e)
  var communityid = e.currentTarget.dataset.communityid
  for (var i = 0; i < this.data.comlistnum; i++) {
    if (communityid == this.data.comlist[i].communityId) {
      if (this.data.comlist[i].collect == true)
        return;
      this.setData({
        ['comlist[' + i + '].collect']: true
      })
    }
  }
  var token = app.globalData.token
  var that = this;
  wx.request({
    url: 'http://106.13.128.146:8080/CollectCommunity',
    method: 'POST',
    header: {
      //'content-type': 'application/x-www-form-urlencoded' ,
      token: token
    },
    data: {
      CommunityId: communityid
    },
    success(res) {
      console.log(res)
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
})