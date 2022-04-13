from iot import mongo
import bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId

class Telemetry:
    def __init__(self, ts, telemetry, own_by_device):
        self.ts = ts
        self.telemetry = telemetry
        self.own_by_device = own_by_device

    def to_json(self):
        return self.__dict__