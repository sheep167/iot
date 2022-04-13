from iot import db
import bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId

class User:
    def __init__(self, username, password, auth=2):
        self.username = username
        self.password = password
        self.auth = auth

    def to_json(self):
        return self.__dict__

    @staticmethod
    def get_user_by_username(username):
        u = db.user.find_one({"username": username})
        if not u:
            return None
        return User(u.get("username"), u.get("password"), u.get("auth"))
    
    def get_user_id(self):
        return db.user.find_one({"username": self.username}).get("_id")
    
    def is_valid_password(self, input_password):
        return bcrypt.checkpw(input_password.encode("utf-8"), self.password)
    
    def update_password(self, new_password):
        db.user.update_one({"username": self.username}, {"$set": {"password": new_password}})

    @staticmethod
    def get_user_by_token():
        token_holder_id = get_jwt_identity()
        u = db.user.find_one({"_id": ObjectId(token_holder_id)})
        return User(u.get("username"), u.get("password"), u.get("auth"))
       
    @staticmethod
    def list_all_devices():
        result = db.device.find(
            {"own_by_user": ObjectId(get_jwt_identity())}, 
            {"own_by_user": 0}
        )
        return list(result)
