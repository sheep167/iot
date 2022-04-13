import json
from bson import ObjectId
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from iot import app, db
from iot.models.user import User
from iot.models.device import Device
from iot.exception import *


@app.route("/api/v1/device", methods=["POST"])
@jwt_required()
def create_device():
    data = request.get_json()
    try:
        name = data.get("name")
        _type = data.get("type")

        if not (name or _type):
            raise RequiredFieldError

        _id = db.device.insert_one(
            Device(name, _type, ObjectId(get_jwt_identity()))
            .to_json()
        )

        return {'_id': str(_id.inserted_id)}, 200
        
    except RequiredFieldError:
        return "Missing Required Fields", 400


@app.route("/api/v1/device/<device_id>", methods=["GET"])
@jwt_required()
def get_device_by_id(device_id):
    try:
        if not device_id:
            raise RequiredFieldError

        device_requested = Device.get_device_by_id(device_id)
        if not device_requested:
            return "No such device or not owned by you", 404

        if device_requested.is_owned_by_current_user():
            return json.dumps({"data": device_requested.to_json()}, default=str), 200
        return "No such device or not owned by you", 404
    
    except RequiredFieldError:
        return "Device id not found", 400


@app.route("/api/v1/device/<device_id>/telemetry_attributes", methods=["GET"])
@jwt_required()
def get_device_telemetry_attribute(device_id):
    try:
        if not device_id:
            raise RequiredFieldError

        device_requested = Device.get_device_by_id(device_id)
        if not device_requested:
            return "No such device or not owned by you", 404
        
        if device_requested.is_owned_by_current_user():
            telemetry = db.telemetry.find({"own_by_device": ObjectId(device_id)}, {"telemetry": 1, "_id": 0})
            telemetry = [t.get("telemetry") for t in telemetry]
            attributes = list(set().union(*(d.keys() for d in telemetry)))
            return {"attributes": attributes}, 200
        return "No such device or not owned by you", 404
    
    except RequiredFieldError:
        return "Device id not found", 400


@app.route("/api/v1/device/<device_id>/latest_telemetry", methods=["GET"])
@jwt_required()
def get_device_latest_telemetry(device_id):
    try:
        if not device_id:
            raise RequiredFieldError

        device_requested = Device.get_device_by_id(device_id)
        if not device_requested:
            return "No such device or not owned by you", 404
        
        if device_requested.is_owned_by_current_user():
            d = db.device.find_one({'_id': ObjectId(device_id)})
            return {'latest_telemetry': d.get('latest_telemetry')}
        return "No such device or not owned by you", 404
    
    except RequiredFieldError:
        return "Device id not found", 400
