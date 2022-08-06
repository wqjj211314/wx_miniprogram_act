// pages/activity.js
function getDateString(date = new Date) {
  console.log(date.getMonth());
  return {
      year: date.getFullYear(),
      month: date.getMonth()+1,
      day: date.getDate()
  }
}

const { year, month, day} = getDateString()
const chooseLocation = requirePlugin('chooseLocation');
//在page页面引入app，同时声明变量，获得所需要的全局变量
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    begintime:"18:00",
    endtime:"22:00",
    addendtime:"18:00",
    title:"",
    detail:"",
    imgList: [],
    latitude: "",
    longitude: "",
    activityaddress:"请选择活动地点",
    name:"gray",
    company:"gray",
    job:"gray",
    sex:"gray",
    age:"gray",
    partinfo:[],
    name_cn:"姓名",
    company_cn:"公司",
    job_cn:"职业",
    sex_cn:"性别",
    age_cn:"年龄",
    modalName:"",
    modalcontent:"",
    time: '12:01',
    nowdate:year+"-"+month+"-"+day,
    date: year+"-"+month+"-"+day
  },

titleInput(e){
  this.setData({
    title: e.detail.value
  })
},
detailInput(e){
  this.setData({
    detail: e.detail.value
  })
},
TimeChange_begintime(e) {
  this.setData({
    begintime: e.detail.value
  })
},
TimeChange_endtime(e) {
  this.setData({
    endtime: e.detail.value
  })
},
TimeChange_addendtime(e) {
  this.setData({
    addendtime: e.detail.value
  })
},
DateChange(e) {
  this.setData({
    date: e.detail.value
  })
},
ChooseImage() {
  wx.chooseMedia({
    count: 1, //默认9
    mediaType:["image"],
    sourceType:["album"],
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
chooseposition(){

  const key = 'R4FBZ-BCLKU-AQGVP-B3IJ4-TVKZS-YCBKJ'; //使用在腾讯位置服务申请的key
  const referer = 'Hi 一起玩'; //调用插件的app的名称
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
          activityaddress: name,
          //activityaddress: address,
          latitude: latitude,
          longitude: longitude
        })
      },
      complete(r){
        console.log(r)
        console.log(222)
      }
    })
},
choose(event){
  var value = event.target.dataset.value;
  console.log(value);
  //console.log(this.data[value]);
  this.setData({
    [value]:this.data[value]=="gray"?"green":"gray"
  });

  this.setData({
    partinfo:this.getpartinfo()
  });
},
getpartinfo(){
  var info = [];
  if(this.data.name=="green"){
    info.push(this.data.name_cn)
  }
  if(this.data.company=="green"){
    console.log(this.data.company_cn);
    info.push(this.data.company_cn);
    console.log(info);
  }
  if(this.data.job=="green"){
    info.push(this.data.job_cn)
  }
  if(this.data.sex=="green"){
    info.push(this.data.sex_cn)
  }
  if(this.data.age=="green"){
    info.push(this.data.age_cn)
  }
  return info;
},
create_activity(nickname,url,gender){
    console.log(nickname);
    console.log(url);
    console.log(gender);
    if(this.data.imgList.length == 0){
      this.setData({
        modalName: "modal",
        modalcontent:"请选择图片"
      })
      return;
    }
    else if(this.data.title == ""){
      this.setData({
        modalName: "modal",
        modalcontent:"请填写活动标题"
      });
      return;
    }
    else if(this.data.activityaddress == "请选择活动地点"){
      this.setData({
        modalName: "modal",
        modalcontent:"请选择位置"
      })
      return;
    }
  
  //活动标题、活动详情、活动开始时间、结束时间、报名截止时间、位置、图片、
  //报名信息
  //限制人数
  //位置信息：经纬度、地址名
  const location = JSON.stringify({
    latitude: this.data.latitude,
    longitude: this.data.longitude,
    address:this.data.activityaddress
  });
  //时间信息：活动开始时间、结束时间、报名截止时间
  const time = JSON.stringify({
    date:this.data.date,
    begintime:this.data.begintime,
    endtime:this.data.endtime,
    addendtime:this.data.addendtime
  });

  var that = this;
  wx.request({
    url: app.globalData.hosturl+'createactivity', //仅为示例，并非真实的接口地址
    data: {
      "openid":app.globalData.openid,
      "nickName":nickname,
      "avatarUrl":url,
      "gender":gender,
      "title":this.data.title,
      "detail":this.data.detail,
      "location": location,
      "time":time,
      "partinfo":this.data.partinfo.toString()
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      console.log("创建活动："+res.data);
      var response_activity_id = res.data;
      let activity_id = JSON.stringify({"activity_id":res.data});
      //app.globalData.activity_id = response_activity_id;
       //上传图片
      wx.uploadFile({
        url: app.globalData.hosturl+'upload', //接口
        filePath: that.data.imgList[0],
        name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
        formData: {
          'user': 'test',
          'activity_id':res.data
        },
        success: function (res) {
          wx.navigateTo({
            url: '../index/index?activity_id='+encodeURIComponent(activity_id)
          })
        },
        fail: function (error) {
          console.log(error);
          this.setData({
            modalName: "modal",
            modalcontent:"图片无法上传"
          })
        }
      });
      
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
    var that = this;
    console.log(new Date());
    //查看是否授权
    wx.getSetting({
       success: function(res) {
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
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.hosturl+'getopenid',
            data: {
              code: res.code
            },
            success:(res)=>{
              console.log(res.data.openid);
              app.globalData.openid = res.data.openid;
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  getUserProfile: function(res) {
    var that =this;
    if(!app.globalData.hasUserInfo){
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log("按钮获取用户信息 "+res.userInfo.nickName)
          app.globalData.login_userInfo = res.userInfo;
          app.globalData.hasUserInfo = true;
          this.setData({
            login_userInfo: res.userInfo
          });
          that.create_activity(res.userInfo.nickName,res.userInfo.avatarUrl,res.userInfo.gender);
        }
      });
    }else{
      that.setData({
        login_userInfo: app.globalData.login_userInfo
      });
      that.create_activity(app.globalData.login_userInfo.nickName,app.globalData.login_userInfo.avatarUrl,app.globalData.login_userInfo.gender);
    }
        
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //const _this = this;
    
   this.again_getLocation();
  
  },
  getLocation(){
    var _this =this;
    wx.authorize({
      scope: 'scope.userLocation',
      success () {
        // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
        //wx.startRecord()    
      }
    });
    /*
    wx.getLocation({
      type: 'wgs84',   
      success(res) {
        _this.data.latitude = res.latitude;
        _this.data.longitude = res.longitude;
        console.log(_this.data.latitude);
        console.log(_this.data.longitude);
      },
      fail(){
        console.log("不同意位置授权");
        wx.getSetting({
          success: (res) => {
            console.log(res)
            if (res.authSetting['scope.userLocation'] != true) {
              //最后就是返回上一个页面。
              wx.navigateBack({
                delta: 1  // 返回上一级页面。
              })
            }
          }
        });
      }
    });
    */
  },
  again_getLocation:function(){
    let that = this;
    // 获取位置信息
    wx.getSetting({
      success: (res) => {
        console.log("位置信息"+res)
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
    /*
    //腾讯的位置地点选择插件，微信小程序有专门的函数代替了
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if(location !=null){
      console.log("进到onshow")
      console.log(location);//latitude: 22.520739, longitude: 114.055252
      console.log(location.name);
      //console.log(location.name.substr(-16,16));
      this.setData({
        activityaddress: location.name,
        latitude:location.latitude,
        longitude:location.longitude
        //addressshort:location.name.substr(-16,16)
      })
    }
    */
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    chooseLocation.setLocation(null);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
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