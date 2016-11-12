from pymongo import MongoClient
import os
from flask import Flask

app = Flask(__name__)

try:
	app.config.from_pyfile("dev_config.cfg")

	mc = MongoClient(app.config['MONGODB_URI'])
	db = mc.passtheturing

	print(">>> Development configuration file loaded.")
except:
    #======================================
    # Try to get amazon ec2 container tags
    #======================================
    MONGO_URL = os.environ.get('MONGODB_URI')

    mc = MongoClient(MONGO_URL)
    db = mc.passtheturing

    print(">>> Production configuration file loaded.")