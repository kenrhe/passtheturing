# import os
# from pymongo import MongoClient

# # MONGO_URL = os.environ.get('MONGOLAB_URI')
# # client = MongoClient(MONGO_URL)
# # db = client.heroku_app32741467

# STATUS_CONVERSION = {0 : 'PENDING', 1 : 'COMPLETED'}
# PENDING = 0
# COMPLETED = 1
# CLOSED = 2

from pymongo import MongoClient
import os
from flask import Flask

app = Flask(__name__)