// pages/activity.js
const util = require("../../utils/util.js");
const datatime_util = require("../../utils/datatime.js");

//const chooseLocation = requirePlugin('chooseLocation');
//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPrivacy: false,
    activity_id: "",
    activity_type: "default", //"pk"
    begintime: "",
    endtime: "请选择", //year + "-" + month + "-" + day + " 22:00",
    addendtime: "请选择", //year + "-" + month + "-" + day + " 20:00",
    cancelendtime: "请选择", //year + "-" + month + "-" + day + " 20:00",
    hobby_tags: ["羽毛球", "篮球", "徒步", "骑行", "爬山", "棋牌", "台球", "跑步", "麻将", "乒乓球", "其他"],
    hobby_tag: "",
    max_part_number: 6,
    title: "",
    title_tags: [],
    sample_title_tags: ["免费停车", "包球", "娱乐局"],
    detail: "",
    imgList: ["https://www.2week.club:5000/static/userbg.jpg"],
    imgList_fordetail: [],
    latitude: "",
    longitude: "",
    activityaddress: "请选择活动地点",
    partinfo: [],

    part_limit_picker: ["所有人均可参与", "通过发起人和成员分享可以参与", "通过发起人分享可以参与"],
    part_limit_index: 0,
    modalName: "",
    modalcontent: "",
    time: '12:01',
    
    loadModal: false,
    disabled_flag: false,
    add_new_partinfo: "",
    roomlist: [],
    room_items: new Array(9),
    edit_activity_flag: false,
    group_tag_list: new Array(1),
    group_room_list: [],
    group_limit_list: [],
    group_tag_dict: {},
    pay_type: "免费",
    pay_price: "0.00",
    custom_part: false,
    scroll_flag: true,
    take_flag: true,
    club_name: "",
    add_club_flag: false,
    sel_club_flag: false,
    club_name_list: [],
    location_list: [],
    route: {},
    part_member_list: [
      [],
      [],
      [],
      [],
      [],
      []
    ]

  },

  tagInput(e) {
    this.setData({
      hobby_tag: e.detail.value
    })
  },

  titleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  nameInput(e) {
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value
    const arrayKey = `part_member_list[${index}][${0}]`;
    this.setData({
      [arrayKey]: value
    });
  },
  chooseSex(e) {
    var index = e.currentTarget.dataset.index;
    var sex = e.currentTarget.dataset.sex;
    var sexIndex = 1;
    const arrayKey = `part_member_list[${index}][${sexIndex}]`;
    this.setData({
      [arrayKey]: sex
    });
  },
  numberInput(e) {
    var max_part_number = e.detail.value;
    var part_member_list = this.data.part_member_list;
    var new_part_member_list = []
    this.setData({
      max_part_number: e.detail.value
    })
    for (var index = 0; index < max_part_number; index++) {
      if (index < part_member_list.length) {
        new_part_member_list.push(part_member_list[index])
      } else {
        new_part_member_list.push([])
      }
    }
    this.setData({
      part_member_list: new_part_member_list
    })
  },
  cropImage() {
    var img = this.data.imgList[0];
    wx.navigateTo({
      url: 'cropper?imgSrc=' + img,
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

              if (size > 1024 * 1024 * 10) {
                wx.showToast({
                  title: '图片过大,需要小于10M',
                  icon: "none",
                  duration: 3000
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
            fail(res) {
              console.log("选择图片失败")
              console.log(res)
            },
            complete(res) {
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

  create_activity(nickname, url, gender) {
    if (this.data.title == "") {
      wx.showToast({
        title: "请填写活动标题",
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
      address: ""
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
    var bg_url = this.data.imgList[0];
    var hobby_tag = "";
    for(var index in this.data.hobby_tags){
      if(this.data.title.includes(this.data.hobby_tags[index])){
        hobby_tag = this.data.hobby_tags[index];
        break;
      }
    }
    wx.request({
      url: app.globalData.hosturl + 'createactivity', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        "activity_id": this.data.activity_id,
        "openid": app.globalData.login_userInfo.user_id,
        "activity_type":"score",
        "nickName": nickname,
        "avatarUrl": url,
        "gender": gender,
        "title": this.data.title,
        "title_tags":"",
        "activity_tag": hobby_tag,
        "detail": "",
        "detail_imgs": "",
        "location": location,
        "room": "",
        "group_tag_dict": {},
        "time": time,
        "max_part_number": this.data.max_part_number,
        "partinfo": "",
        "part_limit": this.data.part_limit_index,
        "edit_activity_flag": this.data.edit_activity_flag,
        "pay_type": this.data.pay_type,
        "pay_price": this.data.pay_type == '线上收费' ? this.data.pay_price : 0,
        "bg_url": bg_url,
        "take_flag":1,
        "club_name":"",
        "route": "{}"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
       
        console.log("成功创建活动：" + res.data);
        console.log(res.data["activity_id"])
        let result = res.data;
        if (result["activity_id"] == "") {
          wx.showToast({
            title: result["result"],
            icon: "error",
            duration: 3000
          });
        } else {
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
        if (!bg_url.startsWith(app.globalData.hosturl)) {
          console.log("否复用之前的背景图")
          wx.uploadFile({
            url: app.globalData.hosturl + 'upload', //接口
            filePath: that.data.imgList[0],
            name: 'file', //这个是属性名，用来获取上传数据的，如$_FILES['file']
            formData: {
              'user': 'test',
              'activity_id': result["activity_id"]
            },
            success: function (res) {},
            fail: function (error) {
              console.log(error);
            }
          });
        }
        //直接新增成员
        setTimeout(function(){
          that.new_member(result["activity_id"],hobby_tag)
        },2000)
        

      },
      fail: function (error) {
        setTimeout(function () {
          wx.hideLoading({
            success: (res) => {},
          });
        }, 3000)
        wx.showToast({
          title: '创建失败',
          icon: 'error',
          duration: 3000
        })
      }
    });
  },
  new_member(activity_id,hobby_tag){
    var part_member_list = this.data.part_member_list;
    var new_part_member_list = [];
    for(var index in part_member_list){
      if(part_member_list[index][0]&&part_member_list[index][1]!=""&&part_member_list[index][1]!=null){
        new_part_member_list.push(part_member_list[index])
      }
    }
    wx.request({
      url: app.globalData.hosturl + 'pay_miniprog', //仅为示例，并非真实的接口地址
      data: {
        "activity_id": activity_id,
        "user_id": app.globalData.login_userInfo["user_id"],
        "title": this.data.title,
        "partinfo": "[]",
        "latitude": this.data.latitude,
        "longitude": this.data.longitude,
        "activity_tag": "",
        "group_tag":"",
        "pay_price": 0,
        "share_user_id": "",
        "pay_type":this.data.pay_type,
        "part_member_list":JSON.stringify(new_part_member_list)
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //that.update_part_info(that,res);
        console.log("商户server调用支付统一下单")
        console.log(res.data.result);
        wx.hideLoading();
        if (res.data.code == 1) {
          wx.showToast({
            title: "添加成员成功",
            icon: "success",
            duration: 2000
          })
          var activity_info = {}
          activity_info["activity_id"] = activity_id
          activity_info["activity_tag"] = hobby_tag
          activity_info["createuser"] = {
            "user_id": app.globalData.login_userInfo["user_id"]
          }
          activity_info = encodeURIComponent(JSON.stringify(activity_info));
          wx.navigateTo({
            url: '/pages/activityshowinfo/activityshowinfo?' + "activity_info=" + activity_info,
          })
        } else {
          wx.showToast({
            title: res.data.result,
            icon: "error",
            duration: 2000
          })
        }


      },
      fail(res) {
        wx.showToast({
          title: "服务器异常",
          icon: "error"
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var begintime = datatime_util.addHours(datatime_util.getCurrentFormattedTime(),1)
    var endtime = datatime_util.addHours(begintime,9)
    var cancelendtime = begintime;
    var addendtime = begintime;
    this.setData({
      begintime,endtime,cancelendtime,addendtime
    })
    var activity_info = {};
    console.log("是否编辑更新活动信息")
    if (options.hasOwnProperty("activity_type")) {
      var activity_type = options.activity_type;
      this.setData({
        activity_type
      })
      //PK活动仅计分，简略配置显示收费类型-免费隐藏、隐藏活动时间-当前时间6h内、详情-隐藏

      //个人活动&俱乐部活动&比赛活动都一样


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
    util.get_open_id(app, this);
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

  },
  getUserProfile: function (res) {
    if (!util.check_login(app)) {
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
        console.log("缓存openid" + openid)
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
    var that = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        wx.getLocation({
          type: 'wgs84',
          success (res) {
            console.log(res)
            const latitude = res.latitude
            const longitude = res.longitude
           
            that.setData({
              latitude: latitude,
              longitude: longitude
            }) 
           
          }
         }) 
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
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
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
                  delta: 1 // 返回上一级页面。
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
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                      //最后就是返回上一个页面。
                      wx.navigateBack({
                        delta: 1 // 返回上一级页面。
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
          that.getLocation();

        } else { //授权后默认加载
          that.getLocation();
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.cropimgSrc !=""){
      var cropimgSrc = app.globalData.cropimgSrc;
      var imglist = this.data.imgList;
      imglist[0] = cropimgSrc
     
      this.setData({
       imgList:imglist
      })
      app.globalData.cropimgSrc = "";
    }
  },

  inputMsg: function (e) {
    this.setData({
      add_new_partinfo: e.detail.value
    });
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

})