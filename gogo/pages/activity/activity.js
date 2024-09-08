// pages/activity.js
const util = require("../../utils/util.js");
function formatdate(datestr) {
  var datestr = datestr.toString();
  return datestr.length == 1 ? "0" + datestr : datestr;//1位变2位，2->02
}
function getDateString() {
  var dateTime = new Date();
  //dateTime = dateTime.setDate(dateTime.getDate());
  //dateTime = new Date(dateTime);
  //dateTime = dateTime.setMonth(dateTime.getMonth());
  //dateTime = new Date(dateTime);
  return {
    year: dateTime.getFullYear(),
    month: formatdate(dateTime.getMonth()+1),
    day: formatdate(dateTime.getDate())
  }
}
const { year, month, day } = getDateString();
//const chooseLocation = requirePlugin('chooseLocation');
//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPrivacy:false,
    activity_id:"",
    begintime: year + "-" + month + "-" + day + " 20:00",
    endtime: year + "-" + month + "-" + day + " 22:00",
    addendtime: year + "-" + month + "-" + day + " 20:00",
    cancelendtime: year + "-" + month + "-" + day + " 18:00",
    hobby_tags: ["羽毛球", "篮球", "乒乓球", "台球", "跑步", "骑行","棋牌","露营","校友会","老乡会"],
    hobby_tag: "",
    max_part_number: 10,
    title: "",
    title_tags:[],
    detail: "",
    imgList: [],
    latitude: "",
    longitude: "",
    activityaddress: "请选择活动地点",
    partinfo: [],
    partinfo_all_options: ["姓名", "性别", "年龄", "籍贯", "公司", "职业", "学校", "专业", "年级"],
    sel_index: -1,
    part_limit_picker: ["所有人均可参与", "通过发起人和成员分享可以参与", "通过发起人分享可以参与"],
    part_limit_index: 0,
    modalName: "",
    modalcontent: "",
    time: '12:01',
    nowdate: year + "-" + month + "-" + day,
    date: year + "-" + month + "-" + day + " 20:00",
    loadModal: false,
    disabled_flag: false,
    add_new_partinfo: "",
    roomlist: [],
    room_items: new Array(10),
    edit_activity_flag:false,
    group_tag_list:new Array(1),
    group_room_list:[],
    group_limit_list:[],
    group_tag_dict:{},
    pay_type:"免费",
    pay_price:"0.00",
    custom_part:false,
    scroll_flag:true,
    take_flag:true,
    club_name:"",
    add_club_flag:false,
    sel_club_flag:false,
    club_name_list:[],
    location_list:[]
  },
  takechange(e){
    var value = e.detail.value;
    console.log(value)
    this.setData({
      take_flag:value
    })
  },
  choosetag(event) {
    var hobbytagvalue = event.target.dataset.hobbytag;
    this.setData({
      hobby_tag: hobbytagvalue
    })
    this.get_activity_info(hobbytagvalue);

  },
  choose_cache_location(event){
    var index = event.target.dataset.index;
    var location = this.data.location_list[index]

    this.setData({
      latitude: location.latitude,
      longitude:location.longitude,
      activityaddress:location.activityaddress,
      sel_cache_location:location.short_activityaddress,
    })
  },
  choose_club_name(event) {
    var clubname = event.target.dataset.clubname;
    if(clubname == this.data.club_name){
      this.setData({
        club_name: ""
      })
    }else{
      this.setData({
        club_name: clubname
      })
    }
   
  },
  tagInput(e){
    this.setData({
      hobby_tag: e.detail.value
    })
  },
  get_activity_info(hobbytagvalue) {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_activity_info', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        "activity_tag":hobbytagvalue
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.hasOwnProperty("detail")) {
          that.setData({
            detail: res.data["detail"],
            max_part_number:res.data["max_part_number"],
            modalName:res.data["bg_img_exist"]?"bgurl_modal":"",
            bg_url:res.data["bg_img_exist"]?res.data["bg_url"]:"",
            club_name:that.data.club_name==""?res.data["club_name"]:that.data.club_name
          });
        }
       
      }
    });
  },
  get_club_list() {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_club_list', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if(Array.isArray(res.data)){
          that.setData({
            club_name_list:res.data
          })
        }
       
      }
    });
  },
  get_activity_location_list() {
    var that = this;
    wx.request({
      url: app.globalData.hosturl + 'get_activity_location_list', //仅为示例，并非真实的接口地址
      data: {
        "user_id": app.globalData.login_userInfo["user_id"],
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if(Array.isArray(res.data)){
          that.setData({
            location_list:res.data
          })
        }
       
      }
    });
  },
  use_exited_bg_url(){
    this.setData({
      "imgList[0]":this.data.bg_url,
      modalName:""
    })
  },
  choose_pay_type(event) {
    var pay_type = event.target.dataset.paytype;
    this.setData({
      pay_type: pay_type
    })
  },
  titleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  detailInput(e) {
    this.setData({
      detail: e.detail.value
    })
  },
  numberInput(e) {
    this.setData({
      max_part_number: e.detail.value
    })
  },
  priceInput(e) {
    console.log(typeof(e.detail.value))
    //var price = parseFloat(e.detail.value).toFixed(2);
    this.setData({
      pay_price: e.detail.value
    })
  },
  priceInputBlur(){
    var price = Math.abs(parseFloat(this.data.pay_price)).toFixed(2);
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
        pay_price:"0.00"
      })
    }else{
      wx.showToast({
        title: '收费金额： '+price+"元",
        icon:"none",
        duration:3000
      })
      this.setData({
        pay_price:price
      })
    }
  },
  roomInput(e) {
    this.setData({
      roomlist: e.detail.value.split(",")
    })
  },
  chooseroom(e) {
    var roomvalue = e.currentTarget.dataset.room;
    var roomlist = this.data.roomlist;
    console.log(roomlist)
    console.log(typeof(roomlist))
    if(!Array.isArray(roomlist)){
      if(roomlist == ""){
        roomlist = []
      }else{
        roomlist = roomlist.split(",")
      }
      
    }
    console.log(roomlist)
    if (roomlist.indexOf(roomvalue) != -1) {
      roomlist.splice(roomlist.indexOf(roomvalue), 1)
    } else if(roomlist.indexOf(roomvalue+"") != -1){
      roomlist.splice(roomlist.indexOf(roomvalue+""), 1)
    }
     else {
      roomlist.push(roomvalue);
    }
    this.setData({
      roomlist: roomlist.sort()
    })
  },
  TimeChange_begintime(e) {
    this.setData({
      begintime: e.detail.value
    })
    var enddate = new Date(e.detail.value.replaceAll("-","/"))//IOS时间兼容格式
    var begindate = new Date(this.data.begintime.replaceAll("-","/"))
    console.log(enddate)
    console.log(begindate)
    
  },
  TimeChange_endtime(e) {
    var enddate = new Date(e.detail.value.replaceAll("-","/"))//IOS时间兼容格式
    var begindate = new Date(this.data.begintime.replaceAll("-","/"))
    console.log(enddate)
    console.log(begindate)
    if(begindate - enddate >= 0){
      console.log("不合理的日期")
      wx.showToast({
        title: '不合理的日期',
        icon:"error",
        duration:3000
      })
      return;
    }
    this.setData({
      endtime: e.detail.value
    })
  },
  TimeChange_addendtime(e) {
    this.setData({
      addendtime: e.detail.value
    })
    var cancelendtime = new Date(e.detail.value.replaceAll("-","/"))//IOS时间兼容格式
    var addendtime = new Date(this.data.addendtime.replaceAll("-","/"))
    console.log(cancelendtime)
    console.log(addendtime)
    if(cancelendtime - addendtime > 0){
      this.setData({
        cancelendtime: e.detail.value
      })
    }
  },
  TimeChange_cancelendtime(e) {
    var cancelendtime = new Date(e.detail.value.replaceAll("-","/"))//IOS时间兼容格式
    var addendtime = new Date(this.data.addendtime.replaceAll("-","/"))
    console.log(cancelendtime)
    console.log(addendtime)
    if(cancelendtime - addendtime > 0){
      console.log("不合理的日期")
      wx.showToast({
        title: '不合理的日期',
        icon:"error",
        duration:3000
      })
      return;
    }
    this.setData({
      cancelendtime: e.detail.value
    })

  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  part_limit_change(e) {
    this.setData({
      part_limit_index: e.detail.value
    })
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
            //sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有,原图可以支持gif
            sourceType: ['album'], //从相册选择
            success: (res) => {
              
              console.log("选择图片成功，选择图片结果");
              console.log(res.tempFiles);
              var temp = res.tempFiles;
              var path = temp[0].tempFilePath;
              var size = temp[0].size;
              
              if(size > 1024 * 1024 * 10){
                wx.showToast({
                  title: '图片过大,需要小于10M',
                  icon:"none",
                  duration:3000
                })
                return;
              }
              var imgpaths = [];
              imgpaths.push(path);
              console.log(imgpaths);
              this.setData({
                imgList: imgpaths
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
  chooseposition() {
    const key = 'R4FBZ-BCLKU-AQGVP-B3IJ4-TVKZS-YCBKJ'; //使用在腾讯位置服务申请的key
    const referer = '来呀'; //调用插件的app的名称
    console.log(this.data.latitude);
    console.log(this.data.longitude);

    const location = JSON.stringify({
      latitude: this.data.latitude,
      longitude: this.data.longitude
    });
    /*
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}`
    });
    */
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        var name = res.name
        var address = res.address
        var latitude = res.latitude
        var longitude = res.longitude
        _this.setData({
          activityaddress: name + "--" + address,
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
  choose_partinfo(event) {
    var partinfovalue = event.target.dataset.partinfo;
    var partinfo = this.data.partinfo;
    if (partinfo.indexOf(partinfovalue) != -1) {
      partinfo.splice(partinfo.indexOf(partinfovalue), 1)
    } else {
      partinfo.push(partinfovalue);
    }
    this.setData({
      partinfo: partinfo
    });

  },
  getpartinfo() {
    var that = this;
    var info = [];
    this.data.partinfo_all_options_bg.forEach(function (item, index, self) {
      if (item == "bg-green") {
        info.push(that.data.partinfo_all_options[index])
      }
    });
    return info;
  },
  create_activity(nickname, url, gender) {
    console.log(nickname);
    console.log(url);
    console.log(gender);
    this.setData({
      disabled_flag: true
    });
    
    if (this.data.title == "") {
      wx.showToast({
        title: "请填写活动标题",
        icon: "none",
        duration: 3000
      });
      return;
    }
    else if (this.data.hobby_tag == "") {
      wx.showToast({
        title: "请指定活动类型",
        icon: "none",
        duration: 3000
      });
      return;
    }else if(this.data.pay_type == "线上报名收费"&& (this.data.pay_price == NaN || this.data.pay_price == "0.00")){
      wx.showToast({
        title: "收费金额有误",
        icon: "none",
        duration: 3000
      });
      
      return;
    }
    else if (this.data.activityaddress == "请选择活动地点") {
      wx.showToast({
        title: "请选择位置",
        icon: "none",
        duration: 3000
      });
      return;
    }
    else if (this.data.imgList.length == 0 && this.data.edit_activity_flag == false) {
      wx.showToast({
        title: "请选择图片",
        icon: "none",
        duration: 3000
      });
      return;
    }
    wx.showLoading({
      title: '活动创建中...',
    });

    //活动标题、活动详情、活动开始时间、结束时间、报名截止时间、位置、图片、
    //报名信息
    //限制人数
    //位置信息：经纬度、地址名
    const location = JSON.stringify({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      address: this.data.activityaddress
    });
    //时间信息：活动开始时间、结束时间、报名截止时间
    const time = JSON.stringify({
      //date: this.data.date,
      begintime: this.data.begintime,
      endtime: this.data.endtime,
      addendtime: this.data.addendtime,
      cancelendtime: this.data.cancelendtime
    });
    var that = this;
    console.log(typeof(that.data.edit_activity_flag))
    var bg_url = this.data.imgList[0];
    //if(!bg_url.startsWith(app.globalData.hosturl)){
      //bg_url = ""
    //}
    wx.request({
      url: app.globalData.hosturl + 'createactivity', //仅为示例，并非真实的接口地址
      data: {
        "activity_id":this.data.activity_id,
        "openid": app.globalData.openid,
        "nickName": nickname,
        "avatarUrl": url,
        "gender": gender,
        "title": this.data.title,
        "title_tags":this.data.title_tags.toString(),
        "activity_tag": this.data.hobby_tag.trim(),
        "detail": this.data.detail,
        "location": location,
        "room": this.data.roomlist.toString(),
        "group_tag_dict":this.data.group_tag_dict,
        "time": time,
        "max_part_number": this.data.max_part_number,
        "partinfo": this.data.partinfo.toString(),
        "part_limit": this.data.part_limit_index,
        "edit_activity_flag":this.data.edit_activity_flag,
        "pay_type":this.data.pay_type,
        "pay_price":this.data.pay_price,
        "bg_url":bg_url,
        "take_flag":this.data.take_flag==false?0:1,
        "club_name":this.data.club_name
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        setTimeout(function(){
          wx.hideLoading({
            success: (res) => {},
          });
        },3000)
        console.log("成功创建活动：" + res.data);
        let result = res.data;
        if (result["activity_id"] == "") {
          wx.showToast({
            title: result["result"],
            icon: "error",
            duration: 3000
          });
        }else{
          wx.showToast({
            title: result["result"],
            icon: "success",
            duration: 3000
          });
        }
        if (result["activity_id"] == "") {
          console.log("创建失败");
          return;
        }
        //app.globalData.activity_id = response_activity_id;
        //上传图片
        if(!bg_url.startsWith(app.globalData.hosturl)){
          console.log("否复用之前的背景图")
          wx.uploadFile({
            url: app.globalData.hosturl + 'upload', //接口
            filePath: that.data.imgList[0],
            name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
            formData: {
              'user': 'test',
              'activity_id': result["activity_id"]
            },
            success: function (res) {
            },
            fail: function (error) {
              console.log(error);
            }
          });
        }
        //后台上传背景图片，创建活动成功后直接跳转至用户页
        setTimeout(function(){
          wx.switchTab({
            url: '../user/user'
          })
        },3000)
       
      },
      fail: function (error) {
        setTimeout(function(){
          wx.hideLoading({
            success: (res) => {},
          });
        },3000)
        wx.showToast({
          title: '创建失败',
          icon: 'error',
          duration: 3000
        })
      }
    });
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log("年月日" + year + month + day);
    var activity_info = {};
    console.log("是否编辑更新活动信息")
    if (options.hasOwnProperty("activity_info")) {
      //传递了活动信息，那就意味着要进行编辑更新
      console.log("编辑更新活动信息")
      wx.setNavigationBarTitle({
        title: '更新活动',
      })
      activity_info = JSON.parse(decodeURIComponent(options.activity_info));
      console.log(activity_info);
      console.log(activity_info.partinfo.split(","));
      this.setData({
        "activity_id":activity_info.activity_id,
        "title": activity_info.title,
        "hobby_tag": activity_info.activity_tag,
        "detail": activity_info.detail,
        "begintime": activity_info.begintime,
        "endtime": activity_info.endtime,
        "addendtime": activity_info.addendtime,
        "cancelendtime": activity_info.cancelendtime,
        "latitude": activity_info.latitude,
        "longitude": activity_info.longitude,
        "activityaddress":activity_info.activityaddress,
        "roomlist": activity_info.room.split(","),
        "max_part_number": activity_info.max_part_number,
        "partinfo": activity_info.partinfo.split(","),
        "part_limit_index": activity_info.part_limit,
        "edit_activity_flag":true,
        "group_tag_dict":activity_info.group_tag_dict
      })
    }
    var that = this;
    console.log(new Date());
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res.authSetting);
        if (res.authSetting['scope.userInfo']) {
          console.log("用户授权了");
        } else {
          //用户没有授权
          console.log("用户没有授权");
        }
      }
    });
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.hosturl + 'getopenid',
            data: {
              code: res.code
            },
            success: (res) => {
              console.log(res.data.openid);
              app.globalData.openid = res.data.openid;
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
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
         
        }
      },
      fail: () => {},
      complete: () => {}
    })
    this.get_club_list()
    this.get_activity_location_list()
  },
  getUserProfile: function (res) {
    if(!util.check_login(app)){
      return;
    }
    var that = this;
    if (!this.check_user_profile_cache()) {
      wx.showToast({
        title: '用户异常，请重新进入',
        icon: "none",
        duration: 2000
      })
    } else {
      that.setData({
        login_userInfo: app.globalData.login_userInfo
      });
      that.create_activity(app.globalData.login_userInfo.nickName, app.globalData.login_userInfo.avatarUrl, app.globalData.login_userInfo.gender);
    }
  },

  check_user_profile_cache() {
    var that = this;
    if (app.globalData.hasUserInfo) {
      try {
        var openid = wx.getStorageSync('openid');
        console.log("缓存openid"+openid)
        if (openid == "" || openid == undefined) {
          app.globalData.hasUserInfo = false;
          return false;
        }
        app.globalData.hasUserInfo = true;
      } catch (e) {
        console.log(e);
      }
      return true;
    } else {
      return false;
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //const _this = this;

    this.again_getLocation();

  },
  getLocation() {
    var _this = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
        //wx.startRecord()    
      }
    });

  },
  again_getLocation: function () {
    let that = this;
    // 获取位置信息
    wx.getSetting({
      success: (res) => {
        console.log("位置信息" + res)
        console.log(res.authSetting['scope.userLocation'])
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
            success: function (res) {
              console.log(res)
              if (res.cancel) {
                wx.showToast({
                  title: '授权失败',
                  icon: 'success',
                  duration: 1000
                })
                //最后就是返回上一个页面。
                wx.navigateBack({
                  delta: 1  // 返回上一级页面。
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    console.log(dataAu)
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用getLocationt的API
                      that.getLocation(that);
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                      //最后就是返回上一个页面。
                      wx.navigateBack({
                        delta: 1  // 返回上一级页面。
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
          that.getLocation(that);

        }
        else { //授权后默认加载
          that.getLocation(that);
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    console.log("活动创建页onshow")
    wx.request({
      url: app.globalData.hosturl + 'get_partinfo_all_options', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("获取list");
        console.log(res.data);
        console.log(typeof res.data);
        if (res.data.length <= _this.data.partinfo_all_options.length || res.data.length > 20) return;
        _this.setData({
          partinfo_all_options: res.data,
        });


      }
    });
    var group_tag_dict = app.globalData.custom_group_tag_dict;
    
    var group_tag_list = [];
    var group_room_list = [];
    var group_limit_list = [];
    for(var key in group_tag_dict){
      group_tag_list.push(group_tag_dict[key]["name"])
      group_room_list.push(group_tag_dict[key]["room"])
      group_limit_list.push(group_tag_dict[key]["limit"])
    }
    this.setData({
      group_tag_dict:app.globalData.custom_group_tag_dict,
      group_tag_list:group_tag_list,
      group_room_list:group_room_list,
      group_limit_list:group_limit_list
    })
    app.globalData.custom_group_tag = {}
  },
  add_partinfo: function () {
    this.setData({
      custom_club: !this.data.custom_club,
    });
  },
  add_partinfo: function () {
    this.setData({
      custom_part: !this.data.custom_part,
      //scroll_flag:!this.data.scroll_flag
      //modalName:"partinfo_modal"
    });
  },
  onbindblur(){
    this.setData({
      //scroll_flag:true
      //modalName:"partinfo_modal"
    });
  },
  onbindfocus(){
    this.setData({
      //scroll_flag:false
      //modalName:"partinfo_modal"
    });
  },
  add_part_tag: function () {
    console.log("add_part_tag:" + this.data.add_new_partinfo);
    var new_tag = this.data.add_new_partinfo.replace(" ", "");
    new_tag = new_tag.replace(",", "");
    new_tag = new_tag.replace("，", "");
    if (new_tag == "") {
      wx.showToast({
        title: '无效数据',
      })
      return;
    }
    console.log("add_part_tag:" + this.data.add_new_partinfo);
    var partinfo_all_options = this.data.partinfo_all_options;
    partinfo_all_options.push(new_tag);
    
    this.setData({
      partinfo_all_options,
      modalName: "",
      add_new_partinfo: "",
      custom_part:false
    });
  },
  inputMsg: function (e) {
    this.setData({
      add_new_partinfo: e.detail.value
    });
  },
  add_club(){
    this.setData({
      add_club_flag:!this.data.add_club_flag
    })
  },
  sel_club_flag(){
    this.setData({
      sel_club_flag:true
    })
  },
  input_club_name: function (e) {
    var customer_club_name = e.detail.value;
    this.setData({
      club_name:customer_club_name
    });
  },
  add_club_name(){
    var club_name_list = this.data.club_name_list;
    club_name_list.unshift(this.data.customer_club_name)
    this.setData({
      club_name_list:club_name_list,
      add_club_flag:false,
      club_name:this.data.customer_club_name
    });
  },
  input_title_tag: function (e) {
    var new_title_tag = e.detail.value;
    //new_title_tag = new_title_tag.replace(",|，","")
    //new_title_tag = new_title_tag.replace(" ","")
    this.setData({
      new_title_tag:new_title_tag
    });
  },
  add_title_tag: function () {
    console.log("add_title_tag:" + this.data.new_title_tag);
    var new_tag = this.data.new_title_tag.replace(" ", "");
    new_tag = new_tag.replace(",", "");
    new_tag = new_tag.replace("，", "");
    if (new_tag == ""||this.data.title_tags.length > 10) {
      wx.showToast({
        title: '添加失败',
      })
      return;
    }
    console.log("add_title_tag:" + this.data.title_tags);
    var title_tags = this.data.title_tags;
    title_tags.push(new_tag);
    
    this.setData({
      title_tags,
      new_title_tag: ""
    });
  },

  custom_group_tag(){
    wx.navigateTo({
      url: 'customgroup?group_tag_list='+encodeURIComponent(JSON.stringify(this.data.group_tag_list))+'&&group_room_list='+encodeURIComponent(JSON.stringify(this.data.group_room_list))+'&&group_limit_list='+encodeURIComponent(JSON.stringify(this.data.group_limit_list)),
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //chooseLocation.setLocation(null);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    //chooseLocation.setLocation(null);
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
  onTabItemTap(item) {
    console.log(item.index)//0
    console.log(item.pagePath)//pages/index/index
    console.log(item.text)//首页
    app.globalData.tab_page_path = item.pagePath;
  },
})