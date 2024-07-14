// pages/activityshowinfo/share_mood.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],
    mood_text:"",
    activity_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.hasOwnProperty("activity_id")) {
      this.setData({
        activity_id:options["activity_id"]
      })
    }
  },
  ChooseImage() {
    wx.getPrivacySetting({
      success: res => {
        console.log(res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
        console.log(res)
        if (res.needAuthorization) {
          console.log("需要授权")
          // 需要弹出隐私协议
          this.setData({
            showPrivacy: true
          })
        } else {
          // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用隐私接口
          console.log("已同意过")
          wx.chooseMedia({
            count: 1, //默认9
            mediaType: ["image"],
            sourceType: ["album"],
            sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (res) => {
              console.log("选择图片结果");
              console.log(res.tempFiles);
              var temp = res.tempFiles;
              var path = temp[0].tempFilePath;
              var imgpaths = [];
              imgpaths.push(path);
              console.log(imgpaths);
              this.setData({
                imgList: imgpaths
              })
      
            }
          });
        }
      },
      fail: () => {},
      complete: () => {}
    })
    
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
  detailInput(e){
    this.setData({
      mood_text: e.detail.value
    })
  },
  save_mood(){
    if (this.data.imgList.length == 0){
      wx.showToast({
        title: '请选择图片',
        icon:"none",
        duration:3000
      })
      return;
    }else if(this.data.mood_text == ""){
      wx.showToast({
        title: '写下你的想法吧',
        icon:"none",
        duration:3000
      })
      return;
    }
    wx.showLoading({
      title: '发表中...',
    })
    wx.uploadFile({
      url: app.globalData.hosturl + 'upload_share_mood_img', //接口
      filePath: this.data.imgList[0],
      name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
      formData: {
        'user_id': app.globalData.login_userInfo["user_id"],
        'activity_id': this.data.activity_id,
        'mood_text':this.data.mood_text
      },
      success: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: res.data,
          icon: "none",
          duration: 2000
        });
        app.globalData.reload_activity_share_moods = true; 
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          });
        },2000);
      },
      fail: function (error) {
        console.log(error);
        wx.hideLoading()
        wx.showToast({
          title: '服务器异常，稍后重试...',
          icon: "none",
          duration: 2000
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})