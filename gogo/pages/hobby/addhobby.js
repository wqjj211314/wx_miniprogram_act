// hobby/addhobby.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id:"",
    hobby_tags:["羽毛球","篮球","乒乓球","台球","跑步","骑行","网球","美食","电影","旅行","摄影","唱歌","乐器","滑雪","击剑"],
    hobby_tag:"", 
    hobby_tags_bgs:[],
    hobby_title:"",

    hobby_time_tags:["三个月","一年","三年","五年及以上"],
    hobby_time:"请选择",
    hobby_time_index:-1,

    hobby_freq_tags:["偶尔","一月多次","一周多次"],
    hobby_freq:"请选择",
    hobby_freq_index:-1,

    hobby_live_tags:["练习生","新人出道","群友高手","比赛四强"],
    hobby_live:"请选择",
    hobby_live_index:-1,

    hobby_detail:"",
    hobby_point:0,

    imgList:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    if (options.hasOwnProperty("user_id")) {
      console.log("有user id"+options);
      console.log(options);
      var user_id = options.user_id;
      this.setData({
        user_id:user_id
      })
    }

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

  choosetag(event) {
    var index = event.target.dataset.index;
    console.log(index);
    var bgs = this.data.hobby_tags_bgs;
    
    var that = this;
    var tag_value = this.data.hobby_tags[index];
    this.data.hobby_tags_bgs.forEach(function (item, index1, self) {
      if (item == "bg-green") {
        that.data.hobby_tags_bgs[index1] = "bg-grey";
      }
    });
    if (this.data.hobby_tags_bgs[index] != "bg-green") {
      this.data.hobby_tags_bgs[index] = "bg-green";
    }

    this.setData({
      hobby_tags_bgs: bgs,
      hobby_tag:tag_value 
    });

  },
  change_hobby_time(e){
    console.log(e.detail.value);
    var index = e.detail.value;
    var value = this.data.hobby_time_tags[index];
    console.log(this.data.hobby_time_tags[index])
    this.setData({
      hobby_time:value,
      hobby_time_index:parseInt(index)
    })
    this.setpoint();
  },
  change_hobby_freq(e){
    console.log(e.detail.value);
    var index = e.detail.value;
    var value = this.data.hobby_freq_tags[index];
    console.log(this.data.hobby_freq_tags[index])
    this.setData({
      hobby_freq:value,
      hobby_freq_index:parseInt(index)
    })
    this.setpoint();
  },
  change_hobby_live(e){
    console.log(e.detail.value);
    var index = e.detail.value;
    var value = this.data.hobby_live_tags[index];
    this.setData({
      hobby_live:value,
      hobby_live_index:parseInt(index)
    })
    this.setpoint();
  },
  setpoint(){
    console.log("计算积分"+this.data.hobby_point);
    console.log("计算积分"+typeof(this.data.hobby_live_index));
    var point = this.data.hobby_point;
    point = 20 * (this.data.hobby_time_index + 1)+ 20 * (this.data.hobby_freq_index + 1)+20 * (this.data.hobby_live_index + 1);
    console.log("计算积分"+point);
    this.setData({
      hobby_point:point
    })
  },

  detailInput(e) {
    this.setData({
      hobby_detail: e.detail.value.trim()
    })
  },
  titleInput(e) {
    this.setData({
      hobby_title: e.detail.value.trim()
    })
  },
  tagInput(e) {
    this.setData({
      hobby_tag: e.detail.value.trim()
    })
  },
  ChooseImage() {
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

  create_hobby(){
    var that = this;
    //hobby_detail:"",
    if (this.data.hobby_tag == "") {
      wx.showToast({
        title: "请选择兴趣标签",
        icon: "none",
        duration: 1000
      });
      return;
    }
    else if (this.data.hobby_title == "") {
      wx.showToast({
        title: "请填写个人兴趣介绍",
        icon: "none",
        duration: 1000
      });
      return;
    }
    else if (this.data.hobby_time == "请选择") {
      wx.showToast({
        title: "请选择年限",
        icon: "none",
        duration: 4000
      });
      return;
    }
    else if (this.data.hobby_freq == "请选择") {
      wx.showToast({
        title: "请选择频次",
        icon: "none",
        duration: 4000
      });
      return;
    }
    else if (this.data.hobby_live == "请选择") {
      wx.showToast({
        title: "请选择实战表现",
        icon: "none",
        duration: 4000
      });
      return;
    }
    else if (this.data.imgList.length == 0) {
      wx.showToast({
        title: "请上传背景图",
        icon: "none",
        duration: 4000
      });
      return;
    }
    wx.showLoading({
      title: '兴趣创建中...',
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 8000)
   
    wx.request({
      url: app.globalData.hosturl + 'createhobby', //仅为示例，并非真实的接口地址
      data: {
        "openid": app.globalData.openid,
        "hobby_tag": this.data.hobby_tag,
        "hobby_title": this.data.hobby_title,
        "hobby_time": this.data.hobby_time,
        "hobby_freq": this.data.hobby_freq,
        "hobby_live": this.data.hobby_live,
        "hobby_detail": this.data.hobby_detail,
        "hobby_point": this.data.hobby_point
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("成功创建活动：" + res.data);
        console.log(that.data.imgList[0]);
        //return;
        //app.globalData.activity_id = response_activity_id;
        //上传图片
        wx.uploadFile({
          url: app.globalData.hosturl + 'upload', //接口
          filePath: that.data.imgList[0],
          name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
          formData: {
            'blur_flag':false,
            'activity_id': app.globalData.openid+that.data.hobby_tag
          },
          success: function (res) {
            console.log(res.data);
            wx.showToast({
              title: res.data,
              icon: "none",
              duration: 2000
            });
            
            
            
          },
          fail: function (error) {
            console.log(error);
          }
        });
        
        //后台上传背景图片，创建活动成功后直接跳转至用户页
        setTimeout(function () {
          wx.navigateTo({
            url: '../userability/ability?user_id='+that.data.user_id
          })
        }, 5000)

      },
      fail: function (error) {
        wx.hideLoading();
        wx.showToast({
          title: '创建失败',
          icon: 'error',
          duration: 3000
        })
      }
    });
    
    

  },
})