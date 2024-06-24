// hobby/addhobby.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hobby_tags: ["羽毛球", "篮球", "乒乓球", "台球", "跑步", "骑行", "网球", "美食", "电影", "旅行", "摄影", "唱歌", "乐器", "滑雪", "击剑"],
    hobby_tag: "",
    hobby_tags_bgs: [],
    hobby_title: "",

    hobby_time_tags: ["三个月", "一年", "三年", "五年及以上"],
    hobby_time: "请选择",
    hobby_time_index: -1,

    hobby_freq_tags: ["偶尔", "一月多次", "一 周多次"],
    hobby_freq: "请选择",
    hobby_freq_index: -1,

    hobby_live_tags:["1", "2", "3", "4","5", "6", "7", "8","9", "10"],
    hobby_live: "请选择",
    hobby_live_index: -1,

    hobby_detail: "",
    hobby_point: 0,

    imgList: [],
    img_change: false,
    hobby_info: {},
    edit_flag: false,
    hosturl:app.globalData.hosturl

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let hobby_info = JSON.parse(decodeURIComponent(options.hobby_info));
    console.log("爱好信息" + hobby_info);
    console.log(hobby_info);
    this.setData({
      hobby_tag: hobby_info.hobby_tag,
      hobby_title:hobby_info.hobby_title,
      hobby_time: hobby_info.hobby_time,
      hobby_time_index: this.data.hobby_time_tags.indexOf(hobby_info.hobby_time),
      hobby_freq: hobby_info.hobby_freq,
      hobby_freq_index: this.data.hobby_freq_tags.indexOf(hobby_info.hobby_freq),
      hobby_live: hobby_info.hobby_live,
      hobby_live_index: this.data.hobby_live_tags.indexOf(hobby_info.hobby_live),
      hobby_info: hobby_info,
      hobby_point: hobby_info.hobby_point,
      imgList: hobby_info.bg_img_exist?[hobby_info.bg_url]:[]
    });
    console.log(this.data.hobby_time_index);
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

  change_hobby_time(e) {
    console.log(e.detail.value);
    var index = e.detail.value;
    var value = this.data.hobby_time_tags[index];
    console.log(this.data.hobby_time_tags[index])
    if (value != this.data.hobby_info.hobby_time) {
      this.setData({
        edit_flag: true
      })

    }
    this.setData({
      hobby_time: value,
      hobby_time_index: parseInt(index)
    })
    this.setpoint();
  },
  change_hobby_freq(e) {
    console.log(e.detail.value);
    var index = e.detail.value;
    var value = this.data.hobby_freq_tags[index];
    console.log(this.data.hobby_freq_tags[index]);
    if (value != this.data.hobby_info.hobby_freq) {
      this.setData({
        edit_flag: true
      })

    }
    this.setData({
      hobby_freq: value,
      hobby_freq_index: parseInt(index)
    })
    this.setpoint();
  },
  change_hobby_live(e) {
    console.log(e.detail.value);
    var index = e.detail.value;
    var value = this.data.hobby_live_tags[index];
    if (value != this.data.hobby_info.hobby_live) {
      this.setData({
        edit_flag: true
      })

    }
    this.setData({
      hobby_live: value,
      hobby_live_index: parseInt(index)
    })
    this.setpoint();
  },
  setpoint() {
    console.log("计算积分" + this.data.hobby_point);
    console.log("计算积分" + typeof (this.data.hobby_live_index));
    var point = 0;
    point = 50 * (this.data.hobby_time_index + 1) + 50 * (this.data.hobby_freq_index + 1) + 1000 * (this.data.hobby_live_index + 1)/2;
    console.log("计算积分" + point);
    if (point != this.data.hobby_info.hobby_point) {
      this.setData({
        edit_flag: true
      })
    }
    this.setData({
      hobby_point: point
    })

  },

  detailInput(e) {
    this.setData({
      hobby_detail: e.detail.value.trim()
    })
  },
  titleInput(e) {
    console.log("修改标题");
    console.log(e.detail.value.trim());
    this.setData({
      hobby_title: e.detail.value.trim(),
      edit_flag:true
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
          imgList: imgpaths,
          img_change: true
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

  edit_hobby() {
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
    if (this.data.img_change) {
      console.log("修改背景图");
      wx.uploadFile({
        url: app.globalData.hosturl + 'upload_hobby_bg', //接口
        filePath: that.data.imgList[0],
        name: 'file',//这个是属性名，用来获取上传数据的，如$_FILES['file']
        formData: {
          'user_id': app.globalData.login_userInfo["user_id"],
          'hobby_tag':this.data.hobby_tag,
        },
        success: function (res) {
          wx.showToast({
            title: res.data,
            icon: "none",
            duration: 3000
          });

        },
        fail: function (error) {
          console.log(error);
        }
      });
    }
    wx.request({
      url: app.globalData.hosturl + 'updatehobby', //仅为示例，并非真实的接口地址
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
        wx.showToast({
          title: 'title',
        })
        //后台上传背景图片，创建活动成功后直接跳转至用户页
        wx.navigateTo({
          url: 'hobbylist?user_id='+app.globalData.openid
        })
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