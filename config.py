from pymongo import MongoClient
import os
from flask import Flask


app = Flask(__name__)

app.config.from_pyfile("dev_config.cfg")

mc = MongoClient(app.config['MONGODB_URI'])
db = mc.passtheturing

print(">>> Development configuration file loaded.")