
// pages/good/addgood.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    club_place_title:"",
    club_place_type_list:[],
    club_place_equipment:"",
    club_place_environment:"",
    club_place_limit:"",
    club_place_price:"",
    club_place_miniprogram_link:"",
    club_place_other_info:"",
    club_place_detail:"",
    club_place_address: "",
    latitude: "",
    longitude: "",
    imgList:[],
    hobby_tags: ["羽毛球", "篮球", "乒乓球", "台球", "跑步", "骑行","棋牌","露营"],
    
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
  place_title(e){
    this.setData({
      club_place_title: e.detail.value
    })
  },
  typeInput(e) {
    this.setData({
      club_place_type_list: e.detail.value.split(",")
    })
  },
  choose_type(e) {
    var typevalue = e.currentTarget.dataset.type;
    var club_place_type_list = this.data.club_place_type_list;
    console.log(club_place_type_list)
    console.log(typeof(club_place_type_list))
    if(!Array.isArray(club_place_type_list)){
      if(club_place_type_list == ""){
        club_place_type_list = []
      }else{
        club_place_type_list = club_place_type_list.split(",")
      }
    }
    console.log(club_place_type_list)
    if (club_place_type_list.indexOf(typevalue) != -1) {
      club_place_type_list.splice(club_place_type_list.indexOf(typevalue), 1)
    } else if(club_place_type_list.indexOf(typevalue+"") != -1){
      club_place_type_list.splice(club_place_type_list.indexOf(typevalue+""), 1)
    }else {
      club_place_type_list.push(typevalue);
    }
    this.setData({
      club_place_type_list: club_place_type_list
    })
  },
  place_equipment(e){
    this.setData({
      club_place_equipment: e.detail.value
    })
  },
  place_environment(e){
    this.setData({
      club_place_environment: e.detail.value
    })
  },
  place_limit(e){
    this.setData({
      club_place_limit: e.detail.value
    })
  },
  place_price(e){
    this.setData({
      club_place_price: e.detail.value
    })
  },
  place_miniprogram_link(e){
    this.setData({
      club_place_miniprogram_link: e.detail.value
    })
  },
  place_other_info(e){
    this.setData({
      club_place_other_info: e.detail.value
    })
  },
  place_detail(e){
    this.setData({
      club_place_detail: e.detail.value
    })
  },
  chooseposition() {
    
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        var name = res.name
        var address = res.address
        var latitude = res.latitude
        var longitude = res.longitude
        _this.setData({
          club_place_address: name + "--" + address,
          //activityaddress: address,
          latitude: latitude,
          longitude: longitude
        })
      },
      complete(r) {
        console.log(r)
        console.log(222)
      }
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
  
  add_club_place(){
    var that = this;
    if (this.data.club_place_title == "") {
      wx.showToast({
        title: "请填写场地名称",
        icon: "none",
        duration: 3000
      });
      return;
    }else if (this.data.club_place_type_list.length == 0) {
      wx.showToast({
        title: "请填写场地类型",
        icon: "none",
        duration: 3000
      });
      return;
    }else if (this.data.club_place_equipment == "") {
      wx.showToast({
        title: "请填写场地设施",
        icon: "none",
        duration: 3000
      });
      return;
    }else if (this.data.club_place_environment == "") {
      wx.showToast({
        title: "请填写场地环境情况",
        icon: "none",
        duration: 3000
      });
      return;
    }else if (this.data.club_place_limit == "") {
      wx.showToast({
        title: "请填写场地权限设置",
        icon: "none",
        duration: 3000
      });
      return;
    }else if (this.data.club_place_price == "") {
      wx.showToast({
        title: "请填写场地收费情况",
        icon: "none",
        duration: 3000
      });
      return;
    }else if (this.data.club_place_address == "") {
      wx.showToast({
        title: "请填写场地位置",
        icon: "none",
        duration: 3000
      });
      return;
    }else if (this.data.imgList.length == 0) {
      wx.showToast({
        title: "请上传场地详情图",
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
      url: app.globalData.hosturl + 'new_club_place', //仅为示例，并非真实的接口地址
      data: {
        "club_place_title": this.data.club_place_title,
        "club_place_type_list":this.data.club_place_type_list,
        "club_place_equipment": this.data.club_place_equipment,
        "club_place_environment": this.data.club_place_environment,
        "club_place_limit": this.data.club_place_limit,
        "club_place_price":this.data.club_place_price,
        "club_place_miniprogram_link": this.data.club_place_miniprogram_link,
        "club_place_detail": this.data.club_place_detail,
        "club_place_address": this.data.club_place_address,
        "club_place_other_info": this.data.club_place_other_info,
        "latitude": this.data.latitude,
        "longitude": this.data.longitude,
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
            icon: "icon",
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
            url: app.globalData.hosturl + 'upload_place', //接口
            filePath: item,
            name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
            formData: {
              "user_id":app.globalData.login_userInfo["user_id"],
              'club_place_id': result["result"]
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
  }
})