const app = getApp()
Component({
  data: {
    isModalShow: false,
    selected: 0,
    "selectedColor": "#4689FF",
    "backgroundColor": "#fff",
    "borderStyle": "white",
    "list": [{
        "pagePath": "/pages/index/newindex",
        "iconPath": "/image/index.png",
        "selectedIconPath": "/image/index_sel.png",
        "text": "首页"
      },
      {
        "pagePath": "/pages/activity/activity",
        "iconPath": "/image/add_sel.png",
        "selectedIconPath": "/image/add_sel.png",
      },
      {
        "pagePath": "/pages/user/user",
        "iconPath": "/image/my.png",
        "selectedIconPath": "/image/my_sel.png",
        "text": "我的"
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      });
      //app.globalData.tab_page_path = url;
      console.log("切换tab");
      console.log(data);
      this.setData({
        selected: data.index
      })
    },
    showAddOptionModal() {
      this.setData({
        isModalShow: true
      });
    },
    toScoreActivity() {
      wx.navigateTo({
        url: '/pages/activity/scoreactivity?activity_type=pk',
      })
      this.setData({
        isModalShow: false
      })
    },
    toActivity() {
      wx.navigateTo({
        url: '/pages/activity/newactivity?activity_type=default',
      })
      this.setData({
        isModalShow: false
      })
    },
    toNewClub() {
      wx.navigateTo({
        url: '/pages/activity/newclub',
      })
      this.setData({
        isModalShow: false
      })
    },

    // 关闭模态框
    closeModal() {
      this.setData({
        isModalShow: false
      });
    },

    // 阻止事件冒泡
    stopPropagation(e) {
      if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
      }
    },

    // 确定按钮
    confirm() {
      this.closeModal();
      // 处理确定逻辑
    },

    // 取消按钮
    cancel() {
      this.closeModal();
      // 处理取消逻辑
    },
    show_game_type() {
      wx.navigateTo({
        url: '/pages/activity/gametype',
      })
      this.setData({
        isModalShow: false
      })
    }
  }
})