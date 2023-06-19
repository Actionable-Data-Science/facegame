from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json


db = SQLAlchemy()

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tos_accept_history = db.Column(db.Text(), nullable=False, default="")
    data_sharing_allowed_history = db.Column(db.Text(), nullable=False, default="")
    username = db.Column(db.String(12), nullable=False, unique=True)
    email = db.Column(db.String(50), unique=True)
    tos_accepted_date = db.Column(db.DateTime, nullable=False, default=False)
    data_sharing_allowed_status = db.Column(db.Boolean, nullable=False, default=False)
    data_sharing_allowed_date = db.Column(db.DateTime, nullable=True)   
    password_hash = db.Column(db.String(256))
    anonymous = db.Column(db.Boolean, nullable=False)
    gameplays = db.relationship("Gameplays", backref="user")
    is_admin = db.Column(db.Boolean, nullable=False, default=False)

    @property
    def password(self):
        raise AttributeError("Password attribute can never be read.")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password, "sha256")

    @property
    def tos_accepted(self):
        return self.tos_accepted_date is not None

    @tos_accepted.setter
    def tos_accepted(self, accepted):
        if (self.tos_accept_history == None):
            self.tos_accept_history = ""
        if accepted and not self.tos_accepted:
            self.tos_accepted_date = datetime.now()
            self.tos_accept_history += f"\nAccepted: {self.tos_accepted_date}"
        elif not accepted and self.tos_accepted:
            self.tos_accepted_date = None
            self.tos_accept_history += f"\nRevoked: {datetime.now()}"

    @property
    def data_sharing_allowed(self):
        return self.data_sharing_allowed_status

    @data_sharing_allowed.setter
    def data_sharing_allowed(self, allowed):
        if (self.data_sharing_allowed_history == None):
            self.data_sharing_allowed_history = ""
        if allowed and not self.data_sharing_allowed_status:
            self.data_sharing_allowed_status = True
            self.data_sharing_allowed_date = datetime.now()
            self.data_sharing_allowed_history += f"\nAllowed: {self.data_sharing_allowed_date}"
            print(self)
        elif not allowed and self.data_sharing_allowed_status:
            self.data_sharing_allowed_status = False
            self.data_sharing_allowed_history += f"\nRevoked: {datetime.now()}"
            print(self)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        if self.is_admin:
            return f"<ADMIN USER> user_id: {self.id}, username: {self.username}, data_sharing_allowed_status: {self.data_sharing_allowed_status}, pw: {self.password_hash}"
        else:
            return f"<USER> user_id: {self.id}, username: {self.username}, data_sharing_allowed_status: {self.data_sharing_allowed_status}, pw: {self.password_hash}"

class Gameplays(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

class TargetImages(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    image = db.Column(db.LargeBinary, nullable=False)
    action_units = db.Column(db.JSON, nullable=False)

    def __init__(self, user_id, image, action_units):
        self.user_id = user_id
        self.image = image
        self.action_units = json.dumps(action_units)
    
class GameplayImages(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    target_image_id = db.Column(db.Integer, db.ForeignKey('target_images.id'), nullable=False)
    image = db.Column(db.LargeBinary, nullable=False)
    cropped_masked_image = db.Column(db.LargeBinary, nullable=False)
    action_units = db.Column(db.JSON, nullable=False)
    # emotions = db.Column(db.JSON, nullable=False)

    # def __init__(self, user_id, target_image_id, image, cropped_image, cropped_masked_image, action_units):
    #     self.user_id = user_id
    #     self.target_image_id = target_image_id
    #     self.image = image
    #     self.cropped_image = cropped_image
    #     self.cropped_masked_image = cropped_masked_image
    #     self.action_units = json.dumps(action_units)
    