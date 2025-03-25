const QQMapWX = require('qqmap-wx-jssdk.js');
const app = getApp();

// 实例化 API 核心类，替换为你自己的 key
const qqmapsdk = new QQMapWX({
  key: 'UBDBZ-QR5WJ-XNYFL-KC3T7-Z6RB2-ZIB3S'
});
function calculateCenterAndScale(markers,mapWidth,mapHeight) {
 
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
    const distance = calculateDistance(centerLng, centerLat, marker.longitude, marker.latitude);
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
  const scale = getScale(lngDelta, latDelta, mapWidth, mapHeight);



  // 创建中心点的 marker
  const centerMarker = {
    id: markers.length + 1,
    longitude: centerLng,
    latitude: centerLat,
    iconPath: '/images/center_marker.png',
    width: 30,
    height: 30
  };


  return {
    longitude: centerLng,
    latitude: centerLat,
    scale: scale,
  };
}
function calculateDistance(lng1, lat1, lng2, lat2) {
  // 简单的距离计算，实际应用中可使用更精确的算法
  return Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2));
}
function getScale(lngDelta, latDelta, mapWidth, mapHeight) {
  // 经纬度一度对应的像素值（近似值）
  const lngDegreeToPixel = mapWidth / 360;
  const latDegreeToPixel = mapHeight / 180;

  // 计算经纬度跨度对应的像素跨度
  const lngPixelSpan = lngDelta * 2 * lngDegreeToPixel;
  const latPixelSpan = latDelta * 2 * latDegreeToPixel;

  // 根据像素跨度确定缩放比例
  let scale;

  scale = calculateZoomLevel(mapWidth-50, mapHeight-10, lngDelta, latDelta)
  console.log("ds给的缩放")
  console.log(scale)
  return scale;
}

function calculateZoomLevel(width, height, maxΔlng, maxΔlat) {
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
}
// 生成路线
function generateRoute(allPoints,that) {

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
        width: 40,
        height: 40,
        iconPath: 'icon_start.png',
        callout:{
          content: `起点: ${allPoints[0].name}`,
          color: '#000',
          fontSize: 12,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#ccc',
          bgColor: '#fff',
          padding: 10,
          display: "ALWAYS",
          textAlign: 'center',
        }
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
            width: 30,
            height: 30,
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
        width: 40,
        height: 40,
        iconPath: 'icon_end.png',
        callout:{
          content: `终点: ${allPoints[allPoints.length - 1].name}`,
          color: '#000',
          fontSize: 12,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#ccc',
          bgColor: '#fff',
          padding: 10,
          display: "ALWAYS",
          textAlign: 'center',
        }
       /** customField: {
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

     that.setData({
        //longitude: centerLongitude,
        //latitude: centerLatitude,
        markers: markers,
        all_markers:markers,
        polyline: polyline,
        //scale: scale,
        //routeInfos: routeInfos
      });
      return;
    }

    const origin = `${allPoints[index].latitude},${allPoints[index].longitude}`;
    const destination = `${allPoints[index + 1].latitude},${allPoints[index + 1].longitude}`;
    const transportMode = 'walking';

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
  //return polyline,markers;
}
exports.calculateCenterAndScale = calculateCenterAndScale
exports.generateRoute = generateRoute

