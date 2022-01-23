# encoding:utf-8
# !/usr/bin/env python
import json

from flask import Flask, render_template, request
from flask_socketio import SocketIO,join_room
import random
from werkzeug.middleware.proxy_fix import ProxyFix

from flask_sqlalchemy import SQLAlchemy
import pymysql
import datetime
from flask import Flask, render_template
import requests
import time, base64
from config import Config
from exts import db,socket_io,app
from models import Createinfo,Activitychatmsg,user
#from socketmodel import *
import socketmodel
import flaskmodel

pymysql.install_as_MySQLdb()

async_mode = None
#app = Flask(__name__)

# 读取配置
app.config.from_object(Config)
# 加入wsgi中间件

app.wsgi_app = ProxyFix(app.wsgi_app)

#socket_io = SocketIO(app, cors_allowed_origins="*")
socket_io.init_app(app)

# 创建数据库sqlalchemy工具对象
#db = SQLAlchemy(app)
# db绑定app
db.init_app(app)



def random_int_list(start, stop, length):
    start, stop = (int(start), int(stop)) if start <= stop else (int(stop), int(start))
    length = int(abs(length)) if length else 0
    random_list = []
    for i in range(length):
        random_list.append(random.randint(start, stop))
    return random_list



if __name__ == '__main__':
    #ssl_context=('2week.club.pem','2week.club.key')
    socket_io.run(app, debug=True, port=5000, host="10.206.0.4",certfile='2week.club.pem',keyfile='2week.club.key')
    #socket_io.run(app, debug=True, port=5000, host="10.206.0.4",keyfile='2week.club.key', certfile='2week.club.pems')
    #socket_io.run(app, debug=True, port=5000, host="10.206.0.4")