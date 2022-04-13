from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta

config_object = 'iot.settings'
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config["MONGO_URI"] = "mongodb://localhost:27017/iot"
mongo = PyMongo(app)
db = mongo.db
jwt = JWTManager()
app.config['JWT_SECRET_KEY'] = 'dQw4w9WgXcQ'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config['PROPAGATE_EXCEPTIONS'] = True
jwt.init_app(app)

from iot.api import *
