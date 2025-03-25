// 引入腾讯地图 SDK
const QQMapWX = require('qqmap-wx-jssdk.js');
const app = getApp();

// 实例化 API 核心类，替换为你自己的 key
const qqmapsdk = new QQMapWX({
  key: 'UBDBZ-QR5WJ-XNYFL-KC3T7-Z6RB2-ZIB3S'
});


Page({
  data: {
    /**
       * address: "浙江省杭州市临平区龙王塘路87号(邱山大街地铁站D口步行350米)"
latitude: 30.41924
longitude: 120.297897
name: "利宾饭店(龙王塘路店)"
       */
    startPoint: {
      address: '',
      name: '',
      latitude: 0,
      longitude: 0
    },
    waypoints: [],
    waypointTransportModes: [],
    endPoint: {
      address: '',
      name: '',
      latitude: 0,
      longitude: 0
    },
    longitude: 120.121431,
    latitude: 30.221378, //默认杭州西湖
    markers: [],
    polyline: [],
    scale: 17,
    routeInfos: [],
    newScale: 0,
    route_title: "",
    pre_page:""
  },
  onLoad(options) {
    var pages = getCurrentPages()
    var pre_page = pages[pages.length-2]
    console.log(pre_page)
    this.setData({
      pre_page:pre_page
    })
    if (options.hasOwnProperty("route")) {
      const route = JSON.parse(decodeURIComponent(options.route));
      if (route.hasOwnProperty("scale")) {
        this.setData({
          scale: route.scale,
          startPoint: route.markers[0],
          endPoint: route.markers[route.markers.length - 1],
          waypoints: route.markers.slice(1, -1),
          route_title: route.route_name,
          latitude: route.markers[0].latitude,
          longitude: route.markers[0].longitude
        })
      }
    }
    const query = wx.createSelectorQuery();
    query.select('#routeMap').boundingClientRect((rect) => {
      if (rect) {
        this.setData({
          mapWidth: rect.width,
          mapHeight: rect.height
        });
      }
    }).exec();
  },
  route_title(e) {
    this.setData({
      route_title: e.detail.value.trim()
    });
  },
  // 添加途径点
  addWaypoint() {
    const waypoints = this.data.waypoints;
    const waypointTransportModes = this.data.waypointTransportModes;
    waypoints.push({
      address: '',
      name: '',
      latitude: 0,
      longitude: 0
    });
    waypointTransportModes.push('walking');
    this.setData({
      waypoints,
      waypointTransportModes,

    });
  },
  // 添加途径点
  insertWaypoint(e) {
    const index = e.currentTarget.dataset.index;
    const waypoints = this.data.waypoints;
    const waypointTransportModes = this.data.waypointTransportModes;
    waypoints.splice(index + 1, 0, {
      address: '',
      name: '',
      latitude: 0,
      longitude: 0
    });
    waypointTransportModes.push('walking');
    this.setData({
      waypoints,
      waypointTransportModes,

    });
  },
  // 添加途径点
  delWaypoint(e) {
    const index = e.currentTarget.dataset.index;
    const waypoints = this.data.waypoints;
    waypoints.splice(index, 1);
    this.setData({
      waypoints,
    });
  },

  // 途径点交通方式选择事件处理
  onWaypointTransportChange(e) {
    const index = e.currentTarget.dataset.index;
    const waypointTransportModes = this.data.waypointTransportModes;
    waypointTransportModes[index] = e.detail.value;
    this.setData({
      waypointTransportModes
    });
  },

  // 选择起点
  selectStartPoint() {
    this.selectLocation((location) => {
      this.setData({
        startPoint: location,
        longitude: location.longitude,
        latitude: location.latitude
      });
    });
  },

  // 选择途径点
  selectWaypoint(e) {
    const index = e.currentTarget.dataset.index;
    this.selectLocation((location) => {
      const waypoints = this.data.waypoints;
      waypoints[index] = location;
      this.setData({
        waypoints,
        longitude: location.longitude,
        latitude: location.latitude
      });
    });
  },

  // 选择终点
  selectEndPoint() {
    this.selectLocation((location) => {
      this.setData({
        endPoint: location,
        longitude: location.longitude,
        latitude: location.latitude
      });
    });
  },

  // 选择位置通用方法
  selectLocation(callback) {
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        const location = {
          address: res.address,
          name: res.name,
          latitude: res.latitude,
          longitude: res.longitude
        };
        callback(location);
      },
      fail: (err) => {
        console.error('选择位置失败', err);
        wx.showToast({
          title: '选择位置失败',
          icon: 'none'
        });
      }
    });
  },
  calculateCenterAndScale() {
    const {
      startPoint,
      waypoints,
      waypointTransportModes,
      endPoint
    } = this.data;
    const markers = [startPoint, ...waypoints, endPoint];

    let totalLng = 0;
    let totalLat = 0;

    // 计算中心点经纬度
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      totalLng += marker.longitude;
      totalLat += marker.latitude;
    }
    const centerLng = totalLng / markers.length;
    const centerLat = totalLat / markers.length;

    // 找出距离中心点最远的点
    let maxDistance = 0;
    let farthestMarker = null;
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      const distance = this.calculateDistance(centerLng, centerLat, marker.longitude, marker.latitude);
      console.log(distance)
      if (distance >= maxDistance) {
        maxDistance = distance;
        farthestMarker = marker;
      }
    }

    // 计算经纬度跨度
    const lngDelta = Math.abs(farthestMarker.longitude - centerLng);
    const latDelta = Math.abs(farthestMarker.latitude - centerLat);

    // 根据经纬度跨度和地图宽高确定缩放比例
    const scale = this.getScale(lngDelta, latDelta, this.data.mapWidth, this.data.mapHeight);



    // 创建中心点的 marker
    const centerMarker = {
      id: markers.length + 1,
      longitude: centerLng,
      latitude: centerLat,
      iconPath: '/images/center_marker.png',
      width: 30,
      height: 30
    };


    this.setData({
      longitude: centerLng,
      latitude: centerLat,
      scale: scale,

    });
  },
  calculateDistance(lng1, lat1, lng2, lat2) {
    // 简单的距离计算，实际应用中可使用更精确的算法
    return Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2));
  },
  getScale(lngDelta, latDelta, mapWidth, mapHeight) {
    // 经纬度一度对应的像素值（近似值）
    const lngDegreeToPixel = mapWidth / 360;
    const latDegreeToPixel = mapHeight / 180;

    // 计算经纬度跨度对应的像素跨度
    const lngPixelSpan = lngDelta * 2 * lngDegreeToPixel;
    const latPixelSpan = latDelta * 2 * latDegreeToPixel;

    // 根据像素跨度确定缩放比例
    let scale;

    scale = this.calculateZoomLevel(mapWidth, mapHeight, lngDelta, latDelta)
    console.log("ds给的缩放")
    console.log(scale)
    return scale;
  },

  calculateZoomLevel(width, height, maxΔlng, maxΔlat) {
    if (maxΔlng === 0 && maxΔlat === 0) return 20; // 所有点重合时使用最大缩放

    let z1 = Infinity,
      z2 = Infinity;
    if (maxΔlng > 0) {
      const ratio = (width * 1.40625) / (2 * maxΔlng);
      z1 = Math.log2(ratio);
    }
    if (maxΔlat > 0) {
      const ratio = (height * 1.40625) / (2 * maxΔlat);
      z2 = Math.log2(ratio);
    }
    const z = Math.min(z1, z2);
    return Math.min(20, Math.max(3, z)); // 限制缩放级别在3-20之间
  },


  // 生成路线
  generateRoute() {

    const {
      startPoint,
      waypoints,
      waypointTransportModes,
      endPoint
    } = this.data;
    if (!startPoint.address || !endPoint.address) {
      wx.showToast({
        title: '请输入起点和终点',
        icon: 'none'
      });
      return;
    }
    const new_waypoints = [];
    var is_valid_point = 0;
    for (var index in waypoints) {
      if (waypoints[index].address == '' || waypoints[index].name == '' || waypoints[index].latitude == 0 || waypoints[index].longitude == 0) {
        is_valid_point = 1;
        continue;
      } else {
        new_waypoints.push(waypoints[index])
      }
    }
    if (is_valid_point) {

      wx.showModal({
        title: '存在空的途径点',
        content: '确定删除空的途径点吗？',
        complete: (res) => {
          if (res.cancel) {

          }

          if (res.confirm) {
            this.setData({
              waypoints: new_waypoints
            })
          }
        }
      })
      return;
    }


    //计算中心点和缩放比例
    this.calculateCenterAndScale();

    const allPoints = [startPoint, ...waypoints, endPoint];
    const allRoutes = [];
    let markers = [];
    let polyline = [];
    let routeInfos = [];

    const fetchRoute = (index) => {
      if (index >= allPoints.length - 1) {
        // 所有路线都已获取
        markers = [{
          id: 0,
          longitude: allPoints[0].longitude,
          latitude: allPoints[0].latitude,
          title: `起点: ${allPoints[0].name}`,
          width: 30,
          height: 30,
          iconPath: 'icon_start.png',
          /** customField: {
            fullAddress: allPoints[0].address,
            name: allPoints[0].name
          },
          默认显示地图点名称
          label: {
              content: allPoints[0].name,
              color: '#000000',
              fontSize: 12,
              anchorX: 0,
              anchorY: -30
          }*/
        }];

        let allPointsArray = [];
        allRoutes.forEach((route, i) => {
          if (i > 0) {
            markers.push({
              id: i,
              longitude: allPoints[i].longitude,
              latitude: allPoints[i].latitude,
              title: `途径点${i}: ${allPoints[i].name}`,
              width: 20,
              height: 20,
              iconPath: 'https://www.2week.club:5000/static/mapicon/icon'+ i +'.png',
              /**customField: {
                fullAddress: allPoints[i].address,
                name: allPoints[i].name
              },
               
              label: {
                content: allPoints[i].name,
                color: '#000000',
                fontSize: 12,
                anchorX: 0,
                anchorY: -30
              }
              */
            });
          }
          allPointsArray = allPointsArray.concat(route.points);
        });

        markers.push({
          id: markers.length,
          longitude: allPoints[allPoints.length - 1].longitude,
          latitude: allPoints[allPoints.length - 1].latitude,
          title: `终点: ${allPoints[allPoints.length - 1].name}`,
          width: 30,
          height: 30,
          iconPath: 'icon_end.png',
          customField: {
            fullAddress: allPoints[allPoints.length - 1].address,
            name: allPoints[allPoints.length - 1].name
          },
          /** 
          label: {
            content: allPoints[allPoints.length - 1].name,
            color: '#000000',
            fontSize: 12,
            anchorX: 0,
            anchorY: -30
          }
          */
        });

        // 生成不分段的路径线
        if (allPointsArray.length > 0) {
          polyline.push({
            points: allPointsArray,
            color: '#04BE02', // 路径线颜色，可根据需要修改
            width: 10,
            borderColor: '#28f000',
            borderWidth: 1
          });
        }

        // 计算路线范围和中心点
        //const {
        //centerLatitude,
        //centerLongitude,
        //scale
        //} = this.calculateMapBounds(allPointsArray);

        this.setData({
          //longitude: centerLongitude,
          //latitude: centerLatitude,
          markers: markers,
          polyline: polyline,
          //scale: scale,
          routeInfos: routeInfos
        });
        return;
      }

      const origin = `${allPoints[index].latitude},${allPoints[index].longitude}`;
      const destination = `${allPoints[index + 1].latitude},${allPoints[index + 1].longitude}`;
      const transportMode = index < waypointTransportModes.length ? waypointTransportModes[index] : 'walking';

      qqmapsdk.direction({
        mode: transportMode,
        from: origin,
        to: destination,
        success: (res) => {
          if (res.status === 0) {
            const route = res.result.routes[0];
            const points = [];
            const path = route.polyline;
            for (let i = 2; i < path.length; i++) {
              path[i] = path[i - 2] + path[i] / 1000000;
            }
            for (let i = 0; i < path.length; i += 2) {
              points.push({
                longitude: path[i + 1],
                latitude: path[i]
              });
            }
            allRoutes.push({
              points: points,
              distance: route.distance,
              duration: route.duration
            });
            fetchRoute(index + 1);
          } else {
            wx.showToast({
              title: `第 ${index + 1} 段路线规划失败`,
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error(`第 ${index + 1} 段请求失败`, err);
          wx.showToast({
            title: err.message,
            icon: 'none'
          });
        }
      });
    };

    fetchRoute(0);
  },


  // marker 点击事件处理函数
  onMarkerTap(e) {
    const markerId = e.markerId;
    console.log(`点击了 marker，id 为: ${markerId}`);
    const marker = this.data.markers[markerId];
    if (marker.customField) {
      const fullAddress = marker.customField.fullAddress;
      wx.showToast({
        title: `地址: ${fullAddress}`,
        icon: 'none'
      });
    }
  },
  // 监听地图缩放事件
  onMapScale(e) {
    console.log(e)
    if (e.type === 'end' && e.causedBy === 'scale') {
      const newScale = e.detail.scale;
      this.setData({
        newScale: newScale
      })

    }
  },
  save_route() {
    const {
      startPoint,
      waypoints,
      waypointTransportModes,
      endPoint,
      route_title
    } = this.data;
    if (route_title == "") {
      wx.showToast({
        title: '请输入路线名称',
        icon: 'error'
      });
      return;
    }
    if (!startPoint.address || !endPoint.address) {
      wx.showToast({
        title: '请输入起点终点',
        icon: 'error'
      });
      return;
    }
    const new_waypoints = [];

    for (var index in waypoints) {
      if (waypoints[index].address == '' || waypoints[index].name == '' || waypoints[index].latitude == 0 || waypoints[index].longitude == 0) {
        continue;
      } else {
        new_waypoints.push(waypoints[index])
      }
    }

    const allPoints = [startPoint, ...new_waypoints, endPoint];
    var route = {};
    route["scale"] = this.data.scale;
    route["route_name"] = this.data.route_title;
    route["markers"] = allPoints
    app.globalData.route = route;

    if(this.data.pre_page.route == "pages/activity/editactivity"){
      wx.navigateBack()
    }else{
      wx.switchTab({
        url: '/pages/activity/activity',
      })
    }
    
  }
});