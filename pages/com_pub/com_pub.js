var app=getApp();
Page({
  data: {
    img_url: [],
    content: '',
    select: false,
    grade_name: '请选择发布类型',
    grades: ['二手信息', '经验分享', '故障咨询', '其他',],
    hideAdd:0,
    hasselect:false,
  },
  /**
  * 点击下拉框
  */
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  /**
  * 已选下拉框
  */
  mySelect(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name
    this.setData({
      grade_name: name,
      select: false,
      hasselect:true,
    })
    console.log(this.data.grade_name)
  },

  
  Shareinput: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    this.setData({
      content:value
    })
    },
 
  onLoad: function (options) {
this.setData({
    img_url: [],
    content: '',
    select: false,
    grade_name: '请选择发布类型',
    grades: ['二手信息', '经验分享', '故障咨询', '其他',],
    hideAdd:0,
    hasselect:false,
})
console.log(app.globalData.token)
  },
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9-that.data.img_url.length, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        if (res.tempFilePaths.length > 0) {
          //图如果满了9张，不显示加图
          let images = that.data.img_url;
          if( (res.tempFilePaths.length + images.length)>= 9) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }
          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
          img_url: img_url,
          })
        }
      }
    })
  },
  send: function () {
    if(this.data.hasselect==false){
      wx.showToast({
        icon:'none',
        title: '请选择发布类型'
      })
      return false;
    }
    if(this.data.content==null||this.data.content==''){
      wx.showToast({
        icon:'none',
        title: '请输入发布内容'
      })
      return false;
    }
   
   var communitykind=this.data.grade_name
   var communitydescription=this.data.content
    var temfile=this.data.img_url
    var num=this.data.img_url.length
    var that = this
    var token=app.globalData.token
    console.log(app.globalData.token)
    wx.showLoading({
      title: '上传中',
    })
    wx.request({
      url:'http://106.13.128.146:8080/PostCommunity',
      method:'POST',
      header:{
        //'content-type': 'application/x-www-form-urlencoded' ,
        token:token     
      },  
      data:{
        CommunityKind:communitykind,
        CommunityDescription:communitydescription
      },
      success(res){
        console.log(res)
        var OrderId=res.data.jsonData.CommunityContent.communityId;
        for (let index = 0; index <=num; index++) {
          var file=temfile[index];
          that.unloadimage(OrderId,file)       
        }
        wx.hideLoading()
        wx.showModal({
          title: '提交成功',
          showCancel: false,
          success (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../commun/commun',
                })
            } 
          }
        })
      },
      fail(err){
        console.log(err)
      }
    })
  },
  unloadimage:function (OrderId,file) {
    var token=app.globalData.token;
    wx.uploadFile({
      url:'http://106.13.128.146:8080/UnloadFile',
      header: {
        "Content-Type": "multipart/form-data",
        'token':token 
      },
      filePath:file,
      name: 'file',   
      formData: {
      OAId:OrderId,
      Type:4
      },      
      success: function (res) {
        console.log(res)
      }
    })
  },


  
  /**
   * 预览图片方法
   */
  listenerButtonPreviewImage: function (e) {
    let index = e.target.dataset.index;
    let that = this;
    console.log(that.data.img_url[index]);
    console.log(that.data.img_url);
    wx.previewImage({
      current: that.data.img_url[index],
      urls: that.data.img_url,
    })
  },
  /**
   * 长按删除图片
   */
  deleteImage: function (e) {
    var that = this;
    var img_url = that.data.img_url;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          img_url.splice(index, 1);
           var hideAdd=0;
           that.setData({
             img_url:img_url,
             hideAdd:hideAdd
           });
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          img_url
        });
      }
    })
  },
})

