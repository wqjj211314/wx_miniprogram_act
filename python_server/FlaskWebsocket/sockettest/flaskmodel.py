# encoding:utf-8
# !/usr/bin/env python
import os

from PIL import Image
from flask import Flask, render_template, request
from flask_socketio import SocketIO,join_room
from exts import db,socket_io,app
from models import Createinfo,Activitychatmsg,user,Activitymember
from databaseutil import new_user,new_activity,get_ten_chatmsg,get_user,new_actmember
import json
import requests
import time, base64


"""
flask app路由的函数
与启动py分离，方便查看
"""

@app.route('/getopenid')
def getopenid():
    code = request.values.get("code")
    print(code)
    secret = "7fa0d0b779feeeb9769445cdaddb4957"
    api = "https://api.weixin.qq.com/sns/jscode2session?appid=wx341d0dd2e062358e&secret=" + secret + "&js_code=" + code + "&grant_type=authorization_code";

    r = requests.get(api)
    str = r.json()
    print(r.json())
    # return str["openid"]
    return str

@app.route('/create_activity')
def create_activity():
    # result = createinfo.query.first()
    # print(result)

    return "create_activity"

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/upload", methods=["POST"])
def uploadFile():
    print("上传文件中... ")
    try:
        f = request.files['file']
        activity_id = request.values.get("activity_id")
        act_bg_img_tmp = 'static/tmp'+activity_id+'.jpg'
        act_bg_img = 'static/' + activity_id + '.jpg'
        f.save(act_bg_img_tmp)
        img_size = os.path.getsize(act_bg_img_tmp)/1024
        print("上传文件大小：")
        print(img_size)
        quality = 80
        step = 10
        while img_size > 200:
            im = Image.open(act_bg_img_tmp)
            im.save(act_bg_img, quality=quality)
            if quality - step < 0:
                break
            quality -= step
            img_size = os.path.getsize(act_bg_img)/1024

        if os.path.exists(act_bg_img_tmp):  # 如果文件存在
            # 删除文件，可使用以下两种方法。
            os.remove(act_bg_img_tmp)
        value = request.values.get("user")  # formData里面携带的参数
        print(value)
    except Exception as e:
        print(e)
    return "OK"

@app.route("/sendMsgtest")
def sendMsgtest():
    print("测试发送")
    #MTYxNjI0NjMyNi42MzM1NTQyoyhbt4nFpV-VgIi3zscNdwByooPw
    join_room("MTYxNjI0NjMyNi42MzM1NTQyoyhbt4nFpV-VgIi3zscNdwByooPw")
    socket_io.emit('server_response', {'chatmsg': "inputmsg"},room="MTYxNjI0NjMyNi42MzM1NTQyoyhbt4nFpV-VgIi3zscNdwByooPw")
    return "OK"

@app.route("/sendMsg")
def sendMsg():
    inputmsg = request.values.get("msg")
    activity_id = request.values.get("activity_id")
    print("发送消息")
    print(inputmsg)
    print(activity_id)
    #socket_io.emit('server_response', {'chatmsg': inputmsg},room="roomtest")
    return "OK"

@app.route("/createactivity")
def createactivity():
    # 个人信息
    openid = request.values.get("openid")
    nickName = request.values.get("nickName")
    avatarUrl = request.values.get("avatarUrl")
    gender = request.values.get("gender")
    # 创建用户
    new_user(openid, nickName, avatarUrl, gender)

    # 活动信息
    title = request.values.get("title")
    detail = request.values.get("detail")
    location = request.values.get("location")
    location = json.loads(location)
    latitude = location["latitude"]
    longitude = location["longitude"]
    address = location["address"]

    timelist = request.values.get("time")
    timelist = json.loads(timelist)
    activity_date = timelist["date"]
    begintime = timelist["begintime"]
    endtime = timelist["endtime"]
    addendtime = timelist["addendtime"]
    partinfo = request.values.get("partinfo")


    b = str(time.time())
    print("时间：" + b)
    a = bytes(str(time.time()), encoding="utf8")
    #c = base64.b64encode(bytes(str(time.time()), encoding="utf8"))
    #d = str(time.time(), encoding="utf-8")
    d = str(time.time())

    activity_id = d + openid
    print("活动" + activity_id)

    new_activity(openid, activity_id, title, detail,
                 activity_date, begintime, endtime,
                 addendtime, latitude, longitude,
                 address, str(partinfo))

    return activity_id

@app.route("/newuser")
def newuser():
    # 个人信息
    openid = request.values.get("openid")
    nickName = request.values.get("nickName")
    avatarUrl = request.values.get("avatarUrl")
    gender = request.values.get("gender")
    # 创建用户
    new_user(openid, nickName, avatarUrl, gender)

    return "OK"


@app.route("/get_activity_list")
def get_activity_list():
    list = []
    id = request.values.get("activity_id")
    #id = "MTYxNjI0NjMyNi42MzM1NTQyoyhbt4nFpV-VgIi3zscNdwByooPw"

    act_date = time.strftime("%Y-%m-%d", time.localtime())

    if id != "" and id != None:
        print("查询活动列表" + id)
        act = Createinfo.query.filter_by(activity_id=id).all()
        if len(act) != 0:
            act_date = act[0].activity_date
            first = act[0].to_json()
            first["createuser"] = act[0].createuser.to_json()
            list.append(first)
            act_list = Createinfo.query.filter(Createinfo.activity_date >= act_date,Createinfo.activity_id != id).\
                order_by(Createinfo.activity_date.desc()).all()
            print(act_list)
            for item in act_list:
                print("if活动创建用户信息：")
                print(item.createuser)

                print(item.to_json())
                itemjson = item.to_json()
                itemjson["createuser"] = item.createuser.to_json()
                list.append(itemjson)
    else:
        act_list = Createinfo.query.filter(Createinfo.activity_id != id).\
            order_by(Createinfo.activity_date.desc()).all()
        print(act_list)
        for item in act_list:
            print("else活动创建用户信息：")
            print(item.createuser)

            print(item.to_json())
            itemjson = item.to_json()
            itemjson["createuser"] = item.createuser.to_json()
            """
            itemjson["create_user_id"] = item.createuser.user_id
            itemjson["create_nickName"] = item.createuser.user_name
            itemjson["create_avatarUrl"] = item.createuser.user_faceid
            """
            list.append(itemjson)
    print("打印列表")
    print(list)
    #return list
    return json.dumps(list)

@app.route("/show_activity")
def show_activity():
    id = request.values.get("activity_id")
    print("show_activity = "+id)
    if id != "":
        act = Createinfo.query.filter_by(activity_id=id).all()
        if len(act)!=0:
            return act[0].to_json()

    return "fail"

@app.route("/get_init_msg")
def get_init_msg():
    activity_id = request.values.get("activity_id")
    print("获取消息,id= "+activity_id)
    #activity_id = "MTYxNjI0NjMyNi42MzM1NTQyoyhbt4nFpV-VgIi3zscNdwByooPw"
    if activity_id!= "" and activity_id != None and activity_id != "undefined":
        print("获取消息中....")
        list = get_ten_chatmsg(activity_id)

        return list
    return "fail"


@app.route("/getuser")
def getuser():
    user_id = request.values.get("user_id")

    if user_id !=None:
        print("获取用户,id= " + user_id)
        u = get_user(user_id)
        print(u)
        if u != None:
            return u.to_json()
    return "fail"


@app.route("/get_create_actlist")
def get_create_actlist():
    user_id = request.values.get("user_id")
    list = []
    if user_id != None and user_id != "":
        actlist = Createinfo.query.filter(Createinfo.user_id == user_id).order_by(
            Createinfo.activity_date.desc()).all()
        for item in actlist:
            print(item.to_json())
            list.append(item.to_json())
    return json.dumps(list)


@app.route("/get_memberlist")
def get_memberlist():
    print("参与的成员")
    activity_id = request.values.get("activity_id")
    #最终要传给前台
    #1.头像url集合
    #2.参加信息的表头集合，作为列表的表头
    #3.按照表头的顺序，参与信息的集合，按照时间顺序进行排列
    list = {}
    avatarUrl_list = []
    partinfo_dict = {}
    partinfo_keys = []
    partinfo_values = []
    if activity_id != None and activity_id != "":
        acts = db.session.query(Activitymember).filter(Activitymember.activity_id == activity_id)
        partinfo_flag = False
        for act in acts:
            userinfo = act.user
            #应该把参加的信息也加上
            user_dict = userinfo.to_json()
            actinfo = act.to_json()
            #user_dict["partinfo"] = actinfo["partinfo"]
            #user_dict["parttime"] = actinfo["parttime"]

            #头像集合
            avatarUrl_list.append(user_dict["avatarUrl"])
            #提取参与信息的表头
            if not partinfo_flag:
                partinfo_dict = eval(actinfo["partinfo"])
                for key in partinfo_dict:
                    partinfo_keys.append(key)
                partinfo_keys.append("报名时间")
                #partinfo_keys = partinfo_keys.keys()
            #提取参与信息,加入参与时间
            if len(partinfo_keys) > 0 and len(partinfo_dict) > 0:
                parinfo_value = []
                for key in partinfo_keys:
                    if key == "报名时间":
                        continue
                    parinfo_value.append(partinfo_dict[key])
                dt = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(float(actinfo["parttime"])))
                parinfo_value.append(dt)
                partinfo_values.append(parinfo_value)

            #print("获取get_memberlist")
            #print(user_dict)
            """
            {'user_id': 'o2QXs5XL_7sbn0-XYrEhdV0DR3UA', 'nickName': '王强',
             'avatarUrl': 'https://thirdwx.qlogo.cn/mmopen/vi_32/HDZF5RIPAgmQzVxvhwYY1RYLKCjPia5v5tXq7dotwu4qxicRxsO77baUhJ9LzSSt3ibEt1UQ1cGXRLEs5g4kjSN3A/132', 
            'partinfo': '{"性别":"男"}', 'parttime': '1635055002.1371543'}
            """


            #list.append(userinfo.to_json())
            #list.append(user_dict)


    list["avatarUrl_list"] = avatarUrl_list
    list["partinfo_keys"] = partinfo_keys
    list["partinfo_values"] = partinfo_values
    print(list)

    return json.dumps(list)

@app.route("/get_partactlist")
def get_partactlist():
    print("参与的活动")
    user_id = request.values.get("user_id")
    list = []
    if user_id != None and user_id != "":
        users = db.session.query(Activitymember).filter(Activitymember.user_id == user_id).order_by(Activitymember.parttime.desc())
        for user in users:
            print(user.to_json())
            act = user.partact
            list.append(act.to_json())
    return json.dumps(list)