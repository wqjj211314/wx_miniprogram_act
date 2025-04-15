
//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    club_name:"",
    club_detail:"",
    imgList:[],
    hobby_tags:["羽毛球", "篮球", "徒步","骑行","爬山","棋牌", "台球", "跑步","麻将","乒乓球","其他"],
    club_type:""
  },
  onInputClubName: function (e) {
    const clubname = e.detail.value;
    if(clubname == ""||clubname == "匿名"){
      wx.showToast({
        title: '请填写合法昵称',
        icon:'error',
        duration:3000
      })
      return;
    }
    this.setData({
      club_name: clubname
    });
  },
  onInputClubType: function (e) {
    const clubtype = e.detail.value;
    if(clubtype == ""){
      wx.showToast({
        title: '请填写合法昵称',
        icon:'error',
        duration:3000
      })
      return;
    }
    this.setData({
      club_type: clubtype
    });
  },
  choose_club_type(event) {
    var club_type = event.target.dataset.clubtype;
    this.setData({
      club_type: club_type
    })
    
  },
  detailInput(e) {
    this.setData({
      club_detail: e.detail.value
    })
  },
  ChooseImage() {
    var that = this;
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
            count: 10, //默认9
            mediaType: ["image"],
            sourceType: ["album"],
            //sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有,原图可以支持gif
            sourceType: ['album'], //从相册选择
            success: (res) => {
              
              console.log("选择图片成功，选择图片结果");
              console.log(res)
              console.log(res.tempFiles);
              var imgList = that.data.imgList;
              var tempFiles = res.tempFiles;
              tempFiles.forEach(item=>{
                imgList.push(item.tempFilePath)
              })
              that.setData({
                imgList: imgList
              })
            },
            fail(res){
              console.log("选择图片失败")
              console.log(res)
            },
            complete(res){
              console.log("选择图片完成")
              console.log(res)
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
  new_club(){
    if(!util.check_login(app)){
      wx.showToast({
        title: '请先登录!',
      })
      return;
    }
    var that = this;
    if (this.data.club_name == "") {
      wx.showToast({
        title: "请填写俱乐部名称",
        icon: "none",
        duration: 3000
      });
      return;
    }else if (this.data.imgList.length == 0) {
      wx.showToast({
        title: "请选择详情图",
        icon: "none",
        duration: 3000
      });
      return;
    }else if (this.data.imgList.length > 5) {
      wx.showToast({
        title: "最多支持5张图片",
        icon: "none",
        duration: 3000
      });
      return;
    }
    wx.showLoading({
      title: '新增中...',
    });
    
    wx.request({
      url: app.globalData.hosturl + 'new_club', //仅为示例，并非真实的接口地址
      data: {
        "club_name": this.data.club_name,
        "club_type": this.data.club_type,
        "club_detail": this.data.club_detail,
        "user_id": app.globalData.login_userInfo["user_id"],
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("成功创建活动：" + res.data);
        let result = res.data;
        if (result["code"] == 200) {
          wx.showToast({
            title: "新增成功",
            icon: "success",
            duration: 3000
          });
          
        }else{
          wx.showToast({
            title: result["result"],
            icon: "error",
            duration: 3000
          });
        }
        if (result["code"] != 200) {
          console.log("创建失败");
          return;
        }
        
        //上传图片
        var imgList = that.data.imgList;
        imgList.forEach(item=>{
          wx.uploadFile({
            url: app.globalData.hosturl + 'upload_club_imgs', //接口
            filePath: item,
            name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
            formData: {
              "user_id":app.globalData.login_userInfo["user_id"],
              'club_name': that.data.club_name
            },
            success: function (res) {
            },
            fail: function (error) {
              console.log(error);
            }
          });
        })
        wx.hideLoading();
        wx.navigateBack();
      },
      fail: function (error) {
        wx.hideLoading();
        wx.showToast({
          title: '新增失败',
          icon: 'error',
          duration: 3000
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   
    
    
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