// pages/case_pub/case_pub.js
var app = getApp();
Page({
    /**
* 页面的初始数据
*/
    data: {
        picSrc: "../../image/pic.png",
        img_url: [],
        hideAdd: 0,
        AppliancesType: null,
        CaseDescription: null,
        MaintenanceTime: null,
        Price: null,
        MaintenanceCompany: null,
    },
    AppliancesTypeInput: function (e) {
        this.setData({
            AppliancesType: e.detail.value
        })
    },
    CaseDescriptionInput: function (e) {
        this.setData({
            CaseDescription: e.detail.value
        })
    },
    MaintenanceTimeInput: function (e) {
        this.setData({
            MaintenanceTime: e.detail.value
        })
        console.log(this.data.Phone)
    },
    PriceInput: function (e) {
        this.setData({
            Price: e.detail.value
        })
    },
    MaintenanceCompanyInput: function (e) {
        this.setData({
            MaintenanceCompany: e.detail.value
        })
    },
    /**
    * 生命周期函数--监听页面加载
    */
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
    chooseimage: function () {
        var that = this;
        wx.chooseImage({
            count: 9 - that.data.img_url.length, // 默认9  
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function (res) {
                if (res.tempFilePaths.length > 0) {
                    //图如果满了9张，不显示加图
                    let images = that.data.img_url;
                    if ((res.tempFilePaths.length + images.length) >= 9) {
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
        var token = app.globalData.token;
        if (this.data.AppliancesType == null) {
            wx.showToast({
                icon: 'none',
                title: '请输入家电类型'
            })
            return false;
        }
        if (this.data.MaintenanceCompany == null) {
            wx.showToast({
                icon: 'none',
                title: '请输入维修企业'
            })
            return false;
        }
        if (this.data.Price == null) {
            wx.showToast({
                icon: 'none',
                title: '请输入维修价格'
            })
            return false;
        }
        if (this.data.CaseDescription == null) {
            wx.showToast({
                icon: 'none',
                title: '请输入案例描述'
            })
            return false;
        }
        var that = this;
        var temfile = this.data.img_url;
        var num = this.data.img_url.length;
        var Price= parseInt(this.data.Price)
        wx.showLoading({
            title: '上传中',
        })
        wx.request({
            url: 'http://106.13.128.146:8080/PostCase',
            method: 'POST',
            header: {
                //'content-type': 'application/x-www-form-urlencoded' ,
                token: token
            },
            data: {
                AppliancesType: that.data.AppliancesType,
                CaseDescription: that.data.CaseDescription,
                MaintenanceTime: "1",
                Price: Price,
                MaintenanceCompany: that.data.MaintenanceCompany
            },
            success(res) {
                console.log(res)
                var OrderId = res.data.jsonData.Case.caseId;
                for (let index = 0; index <= num; index++) {
                    var file = temfile[index];
                    that.unloadimage(OrderId, file)
                }
                wx.hideLoading()
                wx.showModal({
                    title: '提交成功',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            wx.switchTab({
                                url: '../case/case',
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
    unloadimage: function (OrderId, file) {
        var token = app.globalData.token;
        wx.uploadFile({
            url: 'http://106.13.128.146:8080/UnloadFile',
            header: {
                "Content-Type": "multipart/form-data",
                token: token
            },
            filePath: file,
            name: 'file',
            formData: {
                OAId: OrderId,
                Type: 3
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
                    var hideAdd = 0;
                    that.setData({
                        img_url: img_url,
                        hideAdd: hideAdd
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

