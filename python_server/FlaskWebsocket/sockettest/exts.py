# encoding:utf-8
# !/usr/bin/env python

from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO,join_room
from flask import Flask, render_template, request

"""
定义所需要的部分对象
db 数据库操作对象
socket_io websocket对象，监听事件，推送消息
app flask web对象，http路由
"""

db = SQLAlchemy()
socket_io = SocketIO(cors_allowed_origins="*")
app = Flask(__name__)

