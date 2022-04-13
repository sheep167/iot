import time
from xmlrpc.client import Boolean
import requests
import random
import json
from iot import app, mongo
from iot.models.telemetry import Telemetry
from iot.exception import *
from flask import request
from bson import ObjectId


@app.route("/api/v1/device/<device_id>/telemetry", methods=["GET"])
def get_telemetry(device_id):

    try:
        if not device_id:
            raise RequiredFieldError

        start = request.args.get("start", default=0, type=int)
        end = request.args.get("end", default=int(time.time()*1000), type=int)
        limit = request.args.get("limit", default=100, type=int)
        sort = request.args.get("sort", default=-1, type=int)

        query = mongo.db.telemetry.aggregate(
            [
                {"$match": {"$and": [{"ts": {"$gte": start, "$lte": end}}, {"own_by_device": ObjectId(device_id)}]}},
                {"$project": {"_id": 0, "telemetry": 1, "ts": 1}},
                {"$sort": {"ts": sort}},
                {"$limit": int(limit)}
            ])

        return {"data": list(query)}, 200
    
    except RequiredFieldError:
        return "Required Field Error", 400

@app.route("/api/v1/device/<device_id>/telemetry", methods=["POST"])
def post_telemetry(device_id):

    try:
        if not device_id:
            raise RequiredFieldError
        data = request.get_json()

        is_random = request.args.get("random", default=0, type=int)
        if is_random:

            ts = int(time.time() * 1000)
            telemetry = {
                "temp": round(random.gauss(25, 5), 1),
                "hum": round(random.gauss(80, 8), 1)
            }

        else:
            telemetry = data.get("telemetry")

            if not telemetry:
                raise RequiredFieldError

            if not data.get("ts"):
                ts = int(time.time() * 1000)
            else:
                ts = data.get("ts")

        t = Telemetry(ts, telemetry, ObjectId(device_id))

        mongo.db.telemetry.insert_one(t.to_json())
        mongo.db.device.update_one({'_id': ObjectId(device_id)}, {'$set': {'latest_telemetry': {'ts': ts, 'telemetry': telemetry}}})

        return "", 204

    except RequiredFieldError:
        return "Required Field Error", 400
