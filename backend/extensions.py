from flask_bcrypt import Bcrypt
from flask_cors import CORS

bcrypt = Bcrypt()
cors = CORS()

# MongoDB client will be initialized in __init__.py
mongo = None
