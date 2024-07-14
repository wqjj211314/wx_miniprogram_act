// pages/good/addgood.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good_title:"",
    good_type:[],
    good_size:[],
    good_color:[],
    good_tag:[],
    good_price:0,
    good_store:0,
    good_limit:0,
    good_detail:"",
    good_deliver_options:[],
    deliver_options:["预付配送","上门货到付款","自提"],
    imgList:[],
    contact_address:"杭州市余杭区创景路万达广场自提，时间另行预约",
    contact_name:"行乐",
    contact_tel:"18018757991"
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
  good_title(e){
    this.setData({
      good_title: e.detail.value
    })
  },
  good_type(e){
    console.log(e.detail.value)
    var value = e.detail.value;
    value = value.replace("，",",")
    this.setData({
      good_type:value==""?[]:value.split(",")
    })
  },
  good_size(e){
    console.log(e.detail.value)
    var value = e.detail.value;
    value = value.replace("，",",")
    this.setData({
      good_size: value==""?[]:value.split(",")
    })
  },
  good_color(e){
    console.log(e.detail.value)
    var value = e.detail.value;
    value = value.replace("，",",")
    this.setData({
      good_color: value==""?[]:value.split(",")
    })
  },
  good_tag(e){
    console.log(e.detail.value)
    var value = e.detail.value;
    value = value.replace("，",",")
    this.setData({
      good_tag: value==""?[]:value.split(",")
    })
  },
  good_price(e) {
    console.log(typeof(e.detail.value))
    //var price = parseFloat(e.detail.value).toFixed(2);
    this.setData({
      good_price: e.detail.value
    })
  },
  good_price_blur(){
    var price = Math.abs(parseFloat(this.data.good_price)).toFixed(0);
    //price = parseFloat(this.data.pay_price).toFixed(2);
    console.log(typeof(price))
    console.log(price)
    if(price == "NaN"){
      wx.showToast({
        title: '金额有误',
        icon:"error",
        duration:3000
      })
      this.setData({
        good_price:0
      })
    }else{
      wx.showToast({
        title: '商品价格： '+price/100+"元",
        icon:"none",
        duration:3000
      })
      this.setData({
        good_price:price
      })
    }
  },
  good_store(e){
    this.setData({
      good_store: e.detail.value
    })
  },
  good_limit(e){
    this.setData({
      good_limit: e.detail.value
    })
  },
  good_deliver(e) {
    this.setData({
      good_deliver_options: e.detail.value.split(",")
    })
  },
  choose_deliver(e) {
    var delivervalue = e.currentTarget.dataset.deliver;
    var good_deliver_options = this.data.good_deliver_options;
    console.log(good_deliver_options)
    console.log(typeof(good_deliver_options))
    if(!Array.isArray(good_deliver_options)){
      if(good_deliver_options == ""){
        good_deliver_options = []
      }else{
        good_deliver_options = good_deliver_options.split(",")
      }
      
    }
    console.log(good_deliver_options)
    if (good_deliver_options.indexOf(delivervalue) != -1) {
      good_deliver_options.splice(good_deliver_options.indexOf(delivervalue), 1)
    } else if(good_deliver_options.indexOf(delivervalue+"") != -1){
      good_deliver_options.splice(good_deliver_options.indexOf(delivervalue+""), 1)
    }
     else {
      good_deliver_options.push(delivervalue);
    }
    this.setData({
      good_deliver_options: good_deliver_options
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
  contact_tel(e){
    this.setData({
      contact_tel:e.detail.value
    })
  },
  contact_address(e){
    this.setData({
      contact_address:e.detail.value
    })
  },
  contact_name(e){
    this.setData({
      contact_name:e.detail.value
    })
  },
  good_detail(e) {
    this.setData({
      good_detail: e.detail.value
    })
  },
  add_good(){
    var that = this;
    if (this.data.good_title == "") {
      wx.showToast({
        title: "请填写商品标题",
        icon: "none",
        duration: 3000
      });
      return;
    }
    else if (this.data.good_type == "") {
      wx.showToast({
        title: "请填写商品类型",
        icon: "none",
        duration: 3000
      });
      return;
    }else if((this.data.good_price == NaN || this.data.good_price == 0)){
      wx.showToast({
        title: "商品价格有误",
        icon: "none",
        duration: 3000
      });
      
      return;
    }
    else if (this.data.good_size == "") {
      wx.showToast({
        title: "请填写商品大小",
        icon: "none",
        duration: 3000
      });
      return;
    }
    else if (this.data.good_store == 0) {
      wx.showToast({
        title: "请填写商品库存",
        icon: "none",
        duration: 3000
      });
      return;
    }
    else if (this.data.good_deliver_options.length == 0) {
      wx.showToast({
        title: "请填写商品配送",
        icon: "none",
        duration: 3000
      });
      return;
    }
    wx.showLoading({
      title: '商品新增中...',
    });
    var selfgetaddress={}
    selfgetaddress["联系人"] = this.data.contact_name;
    selfgetaddress["联系方式"] = this.data.contact_tel;
    selfgetaddress["收件地址"] = this.data.contact_address;
    wx.request({
      url: app.globalData.hosturl + 'new_good', //仅为示例，并非真实的接口地址
      data: {
        "good_title": this.data.good_title,
        "good_type": this.data.good_type,
        "good_size": this.data.good_size,
        "good_color": this.data.good_color,
        "good_tag":this.data.good_tag,
        "good_price": this.data.good_price,
        "good_detail": this.data.good_detail,
        "good_deliver_options": this.data.good_deliver_options,
        "good_store": this.data.good_store,
        "good_limit": this.data.good_limit,
        "selfgetaddress":JSON.stringify(selfgetaddress)
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
        //app.globalData.activity_id = response_activity_id;
        //上传图片
        var imgList = that.data.imgList;
        imgList.forEach(item=>{
          wx.uploadFile({
            url: app.globalData.hosturl + 'upload_good', //接口
            filePath: item,
            name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
            formData: {
              "user_id":app.globalData.login_userInfo["user_id"],
              'good_id': result["result"]
            },
            success: function (res) {
            },
            fail: function (error) {
              console.log(error);
            }
          });
        })
         
        
        //后台上传背景图片，创建活动成功后直接跳转至用户页
        setTimeout(function(){
          wx.switchTab({
            url: '../index/listindex'
          })
        },5000)
        wx.hideLoading();
       
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