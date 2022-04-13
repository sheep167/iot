import bcrypt
import json
from flask import request, make_response
from flask_jwt_extended import jwt_required, create_access_token, set_access_cookies, unset_access_cookies
from iot import app, db
from iot.models import User
from iot.exception import *


@app.route("/api/v1/user/register", methods=["POST"])
def register():

    try:
        data = request.get_json()
        print(data)
        username = data.get("username")
        password = data.get("password")

        if not (username and password):
            raise RequiredFieldError
        
        user_requested = User.get_user_by_username(username)
        if user_requested:
            raise DuplicatedKeyError
        
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        data["password"] = hashed_password
        db.user.insert_one(
            User(**data)
            .to_json()
        )
        return "User successfully created", 200

    except RequiredFieldError:
        return "Missing some fields", 400
    except DuplicatedKeyError:
        return "User already registered", 400


@app.route("/api/v1/user/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            raise RequiredFieldError
        
        user_requested = User.get_user_by_username(username)
        if user_requested:
            if user_requested.is_valid_password(password):
                r = make_response()
                access_token = create_access_token(identity=str(user_requested.get_user_id()))
                set_access_cookies(r, access_token)
                r.set_cookie("loggedIn", "1")
                r.set_data("Success")
                return r, 200
        raise CredentialsValidationError
    
    except RequiredFieldError:
        return "Missing some fields", 400
    except CredentialsValidationError:
        return "Wrong combination", 400


@app.route("/api/v1/user/change_password", methods=["POST"])
@jwt_required()
def change_password():

    try:
        data = request.get_json()
        old_password = data.get("old_password")
        new_password = data.get("new_password")

        if not old_password or not new_password:
            raise RequiredFieldError

        user_requested = User.get_user_by_token()

        if user_requested.is_valid_password(old_password):
            new_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
            user_requested.update_password(new_password)
            return "Password Changed", 200
        raise CredentialsValidationError
    
    except RequiredFieldError:
        return "Missing some fields", 400
    except CredentialsValidationError:
        return "Wrong combination", 400


@app.route("/api/v1/user/all_devices", methods=["GET"])
@jwt_required()
def all_devices():
    return json.dumps({"data": User.list_all_devices()}, default=str)


@app.route('/api/v1/user/logout', methods=['POST'])
def logout():
    r = make_response()
    unset_access_cookies(r)
    return r, 200