import datetime
import time

from flask import Flask
datetime1 = '1635055002.1371543'
dt = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(float(datetime1)))
print(dt)