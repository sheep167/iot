from iot import db
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity
from iot.models.user import User

class Device:
    def __init__(self, name, _type, own_by_user):
        self.name = name
        self.type = _type
        self.own_by_user = own_by_user

    def to_json(self):
        return self.__dict__
    
    @staticmethod
    def get_device_by_id(_id):
        d = db.device.find_one({"_id": ObjectId(_id)}, {"_id": 0})
        if not d:
            return None
        return Device(d.get("name"), d.get("type"), d.get("own_by_user"))

    def is_owned_by_current_user(self):
        return self.own_by_user == ObjectId(get_jwt_identity())
    
