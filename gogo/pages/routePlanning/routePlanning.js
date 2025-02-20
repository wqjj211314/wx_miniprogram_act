// 引入腾讯地图 SDK
const QQMapWX = require('qqmap-wx-jssdk.js');

// 实例化 API 核心类，替换为你自己的 key
const qqmapsdk = new QQMapWX({
    key: 'UBDBZ-QR5WJ-XNYFL-KC3T7-Z6RB2-ZIB3S'
});


Page({
    data: {
        startPoint: { address: '', name: '', latitude: 0, longitude: 0 },
        waypoints: [],
        waypointTransportModes: [],
        endPoint: { address: '', name: '', latitude: 0, longitude: 0 },
        longitude: 0,
        latitude: 0,
        markers: [],
        polyline: [],
        scale: 13,
        routeInfos: []
    },

    // 起点输入事件处理
    onStartPointInput(e) {
        const startPoint = { ...this.data.startPoint, address: e.detail.value };
        this.setData({
            startPoint
        });
    },

    // 途径点输入事件处理
    onWaypointInput(e) {
        const index = e.currentTarget.dataset.index;
        const waypoints = this.data.waypoints;
        waypoints[index] = { ...waypoints[index], address: e.detail.value };
        this.setData({
            waypoints
        });
    },

    // 终点输入事件处理
    onEndPointInput(e) {
        const endPoint = { ...this.data.endPoint, address: e.detail.value };
        this.setData({
            endPoint
        });
    },

    // 添加途径点
    addWaypoint() {
        const waypoints = this.data.waypoints;
        const waypointTransportModes = this.data.waypointTransportModes;
        waypoints.push({ address: '', name: '', latitude: 0, longitude: 0 });
        waypointTransportModes.push('walking');
        this.setData({
            waypoints,
            waypointTransportModes
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
                startPoint: location
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
                waypoints
            });
        });
    },

    // 选择终点
    selectEndPoint() {
        this.selectLocation((location) => {
            this.setData({
                endPoint: location
            });
        });
    },

    // 选择位置通用方法
    selectLocation(callback) {
        wx.chooseLocation({
            success: (res) => {
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

// 生成路线
generateRoute() {
  const { startPoint, waypoints, waypointTransportModes, endPoint } = this.data;
  if (!startPoint.address || !endPoint.address) {
      wx.showToast({
          title: '请输入起点和终点',
          icon: 'none'
      });
      return;
  }

  const allPoints = [startPoint, ...waypoints, endPoint];
  const allRoutes = [];
  let markers = [];
  let polyline = [];
  let routeInfos = [];

  const fetchRoute = (index) => {
      if (index >= allPoints.length - 1) {
          // 所有路线都已获取
          markers = [
              {
                  id: 0,
                  longitude: allPoints[0].longitude,
                  latitude: allPoints[0].latitude,
                  title: `起点: ${allPoints[0].name}`,
                  width: 30,
                  height: 30,
                  iconPath: '/images/blue-marker.png',
                  customField: {
                      fullAddress: allPoints[0].address,
                      name: allPoints[0].name
                  },
                  label: {
                      content: allPoints[0].name,
                      color: '#000000',
                      fontSize: 12,
                      anchorX: 0,
                      anchorY: -30
                  }
              }
          ];

          let allPointsArray = [];
          allRoutes.forEach((route, i) => {
              if (i > 0) {
                  markers.push({
                      id: i,
                      longitude: allPoints[i].longitude,
                      latitude: allPoints[i].latitude,
                      title: `途径点${i}: ${allPoints[i].name}`,
                      width: 30,
                      height: 30,
                      customField: {
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
                  });
              }

              if (route.points.length > 0) {
                  allPointsArray = allPointsArray.concat(route.points);

                  const colorStops = ["#b3cdd1", "#b1c9ce", "#aec5cb", "#acc1c8", "#a9bdc5", "#a7b9c2", "#a4b5bf", "#a2b1bc", "#9fadb9", "#9fa4c4"];
                  const numSegments = colorStops.length;
                  const totalPoints = route.points.length;

                  for (let j = 0; j < numSegments; j++) {
                      let startIndex = Math.floor(j * (totalPoints / numSegments));
                      let endIndex = (j === numSegments - 1) ? totalPoints : Math.floor((j + 1) * (totalPoints / numSegments));

                      // 为保证连续性，让相邻段有重叠
                      if (j > 0) {
                          startIndex = Math.max(0, startIndex - 1);
                      }

                      const segmentPoints = route.points.slice(startIndex, endIndex);

                      if (segmentPoints.length > 0) {
                          // 模拟顶部边框
                          polyline.push({
                              points: segmentPoints,
                              color: colorStops[j],
                              width: 10,
                              borderColor: '#000000',
                              borderWidth: 2
                          });
                          // 模拟底部边框
                          polyline.push({
                              points: segmentPoints,
                              color: colorStops[j],
                              width: 10,
                              borderColor: '#000000',
                              borderWidth: 2
                          });
                      }
                  }
              }

              const distance = route.distance;
              const duration = Math.ceil(route.duration / 60);
              routeInfos.push({ distance, duration, points: route.points });
          });

          markers.push({
              id: markers.length,
              longitude: allPoints[allPoints.length - 1].longitude,
              latitude: allPoints[allPoints.length - 1].latitude,
              title: `终点: ${allPoints[allPoints.length - 1].name}`,
              width: 30,
              height: 30,
              iconPath: '/images/red-marker.png',
              customField: {
                  fullAddress: allPoints[allPoints.length - 1].address,
                  name: allPoints[allPoints.length - 1].name
              },
              label: {
                  content: allPoints[allPoints.length - 1].name,
                  color: '#000000',
                  fontSize: 12,
                  anchorX: 0,
                  anchorY: -30
              }
          });

          // 计算路线范围和中心点
          const { centerLatitude, centerLongitude, scale } = this.calculateMapBounds(allPointsArray);

          this.setData({
              longitude: centerLongitude,
              latitude: centerLatitude,
              markers: markers,
              polyline: polyline,
              scale: scale,
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
                  allRoutes.push({ points: points, distance: route.distance, duration: route.duration });
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
                  title: `第 ${index + 1} 段请求失败`,
                  icon: 'none'
              });
          }
      });
  };

  fetchRoute(0);
},

    // 计算地图范围和缩放级别
    calculateMapBounds(points) {
        if (points.length === 0) {
            return { centerLatitude: 0, centerLongitude: 0, scale: 13 };
        }

        let minLat = Infinity;
        let maxLat = -Infinity;
        let minLng = Infinity;
        let maxLng = -Infinity;

        points.forEach((point) => {
            if (point.latitude < minLat) {
                minLat = point.latitude;
            }
            if (point.latitude > maxLat) {
                maxLat = point.latitude;
            }
            if (point.longitude < minLng) {
                minLng = point.longitude;
            }
            if (point.longitude > maxLng) {
                maxLng = point.longitude;
            }
        });

        const centerLatitude = (minLat + maxLat) / 2;
        const centerLongitude = (minLng + maxLng) / 2;

        // 计算经纬度范围
        const latRange = maxLat - minLat;
        const lngRange = maxLng - minLng;

        // 根据范围动态调整缩放级别
        let scale;
        if (lngRange > latRange) {
            if (lngRange > 1) {
                scale = 8;
            } else if (lngRange > 0.5) {
                scale = 9;
            } else if (lngRange > 0.1) {
                scale = 10;
            } else if (lngRange > 0.05) {
                scale = 11;
            } else if (lngRange > 0.01) {
                scale = 12;
            } else if (lngRange > 0.005) {
                scale = 13;
            } else if (lngRange > 0.001) {
                scale = 14;
            } else {
                scale = 15;
            }
        } else {
            if (latRange > 1) {
                scale = 8;
            } else if (latRange > 0.5) {
                scale = 9;
            } else if (latRange > 0.1) {
                scale = 10;
            } else if (latRange > 0.05) {
                scale = 11;
            } else if (latRange > 0.01) {
                scale = 12;
            } else if (latRange > 0.005) {
                scale = 13;
            } else if (latRange > 0.001) {
                scale = 14;
            } else {
                scale = 15;
            }
        }

        return { centerLatitude, centerLongitude, scale };
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
    }
});