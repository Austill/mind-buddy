from flask_bcrypt import Bcrypt
from flask_cors import CORS
from pymongo import MongoClient

bcrypt = Bcrypt()
cors = CORS()
mongo = MongoClient()
