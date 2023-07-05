from flask import Flask, render_template, flash, request, redirect, url_for, abort, send_file, jsonify
from flask_wtf import FlaskForm
from flask_migrate import Migrate
from datetime import datetime, date
from database import db, Users, Gameplays, TargetImages, GameplayImages
from werkzeug.security import generate_password_hash, check_password_hash
from webforms import RegistrationForm, LoginForm, PreferencesForm
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from werkzeug.utils import secure_filename
from random import choice, choices
from functools import wraps
import uuid as uuid
import os
from PIL import Image
from io import BytesIO
import base64
import zipfile
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
import string
from sqlalchemy.sql import func
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="static/")
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///facegame.db"

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

db.init_app(app)
migrate = Migrate(app, db)

# Flask Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
	return Users.query.get(int(user_id))

def create_tables():
    with app.app_context():
        db.create_all()
        print("All tables created")

def require_registered():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if current_user.is_authenticated and current_user.anonymous == False:
                return func(*args, **kwargs)
            else:
                return redirect(url_for("no_access"))
                abort(403)  # Access forbidden
        return wrapper
    return decorator

def require_datasharing_enabled():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if current_user.data_sharing_allowed_status:
                return func(*args, **kwargs)
            else:
                return redirect(url_for("no_access"))
                abort(403)  # Access forbidden
        return wrapper
    return decorator

def require_admin():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if current_user.is_admin:
                return func(*args, **kwargs)
            else:
                return redirect(url_for("no_access"))
                abort(403)  # Access forbidden
        return wrapper
    return decorator

@app.route("/")
def home():
    return render_template("home.html")

# @app.route("/test")
# def test():
#     return render_template("test.html")

@login_required
@app.route("/facegame_classic")
def facegame_classic():
    return render_template("facegame_classic.html")

@app.route("/mirror")
def mirror():
    return render_template("mirror.html")

@app.route("/no_access")
def no_access():
    return render_template("no_access.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        user_by_mail = Users.query.filter_by(email=form.email.data).first()
        if user is None and user_by_mail is None:
            user = Users(username=form.username.data, password=form.password.data, email=form.email.data, tos_accepted=form.terms_of_service_accepted.data, data_sharing_allowed=form.data_sharing_allowed.data, anonymous=False)
            db.session.add(user)
            db.session.commit()
            print(f"New user signed up: {user}")
            login_user(user)
            return redirect(url_for("home"))
        elif user:
            flash("A user with this username already exists. If it's you, try to log in instead.")
        elif user_by_mail:
            flash("A user with this email adress already exists. If it's you, try to log in instead.")
        else:
            flash("User could not be added. Try again later.")
    else:
        print(form.errors)
    return render_template("register.html", form=form)

@app.route("/register_admin", methods=["GET", "POST"])
@require_admin()
def register_admin():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        user_by_mail = Users.query.filter_by(email=form.email.data).first()
        if user is None and user_by_mail is None:
            user = Users(username=form.username.data, password=form.password.data, email=form.email.data, tos_accepted=form.terms_of_service_accepted.data, data_sharing_allowed=form.data_sharing_allowed.data, anonymous=False, is_admin=True)
            db.session.add(user)
            db.session.commit()
            print(f"New user signed up: {user}")
            login_user(user)
            return redirect(url_for("home"))
        elif user:
            flash("A user with this username already exists. If it's you, try to log in instead.")
        elif user_by_mail:
            flash("A user with this email adress already exists. If it's you, try to log in instead.")
        else:
            flash("User could not be added. Try again later.")
    else:
        print(form.errors)
    return render_template("register.html", form=form)

@app.route("/anonymous", methods=["GET", "POST"])
def anonymous():
    if (not current_user.is_authenticated):
        username = "Anonymous" + choice(["Panda", "Koala", "Sloth", "Cat", "Dragon", "Lion", "Shark", "Monkey"]) + str(Users.query.count())
        user = Users(username=username, tos_accepted=True, data_sharing_allowed=False, anonymous=True)
        db.session.add(user)
        db.session.commit()
        print(f"New anonymous user: {user}")
        login_user(user)
    return redirect(url_for("facegame_classic"))

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        if user:
            if user.verify_password(form.password.data):
                login_user(user)
                return redirect(url_for("home"))
            else:
                print(form.errors)
                flash(f"Password is incorrect!")
        else:
            flash(f"The user {form.username.data} does not exist!")
    return render_template("login.html", form=form)

@app.route("/admin")
@require_admin()
def admin():
    users_count = Users.query.count()
    target_images_count = TargetImages.query.count()
    return render_template("admin.html", users_count=users_count, target_images_count=target_images_count)

@app.route("/manage_users")
@require_admin()
def manage_users():
    users = Users.query.all()
    return render_template("manage_users.html", users=users)

@app.route("/manage_target_images")
@require_admin()
def manage_target_images():
    target_images = TargetImages.query.all()
    return render_template("manage_target_images.html", target_images=target_images)

@app.route("/my_data")
@login_required
def my_data():
    images = GameplayImages.query.filter_by(user_id=current_user.id)
    return render_template("my_data.html", images=images)


@app.route("/api/delete_user/<user_id>", methods=["POST"])
@require_admin()
def delete_user(user_id):
    print(user_id)
    user = Users.query.get_or_404(user_id)
    if user is None:
        return {"success": False}
    else:   
        db.session.delete(user)
        db.session.commit()
        return {"success": True} 

@app.route("/api/delete_target_image/<target_image_id>", methods=["GET", "POST"])
@require_admin()
def delete_target_image(target_image_id):
    print(target_image_id)
    target_image = TargetImages.query.get_or_404(target_image_id)
    if target_image is None:
        return {"success": False}
    else:   
        db.session.delete(target_image)
        db.session.commit()
        return {"success": True} 
        
@app.route("/api/delete_my_image/<image_id>", methods=["DELETE"])
@login_required
def delete_my_image(image_id):
    my_image = GameplayImages.query.get_or_404(image_id)
    if my_image is None:
        return {"success": False, "error": "not found"}
    elif current_user.id != my_image.user_id:   
        return {"success": False, "error": "not authorized"}
    else:
        db.session.delete(my_image)
        db.session.commit()
        return {"success": True} 

@app.route("/api/get_current_user_id", methods=["GET"])
def get_current_user_id():
    if current_user.is_authenticated:
        return {"success": True, "id": current_user.id}
    else:   
        return {"success": False}

@app.route("/api/get_data_collection_allowed", methods=["GET"])
def get_data_collection_allowed():
    if current_user.is_authenticated:
        return {"success": True, "allowed": current_user.data_sharing_allowed_status}
    else:   
        return {"success": False}

@app.route("/add_target_image/", methods=["GET"])
@require_admin()
def add_target_image_interface():
    return render_template("add_target_image.html")

@app.route("/api/add_target_image/", methods=["POST"])
@require_admin()
def add_target_image():
    try:
        file = request.files['image']
        image_data = file.read()
        checkbox_values = request.form.getlist('checkbox')
        print(checkbox_values)
        aus = [int(value) for value in checkbox_values]
        print("Action Units for new TargetImage:", aus)
        target_image = TargetImages(user_id=current_user.id, image=image_data, action_units=aus)
        db.session.add(target_image)
        db.session.commit()
        return {"success": True, "id": target_image.id}
    except Exception as e:
        print(f"Error: Target Image not added: {e}")
        return {"success": False}

@app.route("/api/add_gameplay_image/<user_id>", methods=["POST"])
@login_required
@require_datasharing_enabled()
def add_gameplay_image(user_id):
    if int(user_id) == current_user.id:
        try:
            action_units = request.form.get('actionUnits')
            target_image_id = request.form.get('targetImageId')
            image = request.form.get('image')
            image_encoded_data = image.split(",", 1)[1]
            image_binary_data = base64.b64decode(image_encoded_data)
            image_cropped_masked = request.form.get('imageCroppedMasked')
            image_cropped_masked_encoded_data = image_cropped_masked.split(",", 1)[1]
            image_cropped_masked_binary_data = base64.b64decode(image_cropped_masked_encoded_data)
            gameplay_image = GameplayImages(user_id=user_id, target_image_id=target_image_id, image=image_binary_data, cropped_masked_image=image_cropped_masked_binary_data, action_units=action_units)
            db.session.add(gameplay_image)
            db.session.commit()
            return {"success": True}
        except Exception as e:
            print(f"Error: Target Image not added: {e}")
            return {"success": False}
    else:
        return {"success": False, "error": "unauthorized"}

@app.route("/api/get_target_image/<target_image_id>", methods=["GET"])
@login_required
def get_target_image(target_image_id):
    image = TargetImages.query.filter_by(id=target_image_id).first()
    if image is None:
        return {"success": False}
    else:
        image_stream = BytesIO()
        image_stream.write(image.image)
        image_stream.seek(0)
        return send_file(image_stream, mimetype="image/jpeg")

@app.route("/api/get_random_target_image", methods=["GET"])
@login_required
def get_random_target():
    random_image = TargetImages.query.order_by(func.random()).first()
    if random_image is None:
        return {"success": False}
    else:
        target_image_id = random_image.id
        action_units = random_image.action_units
        return jsonify({
            "success": True,
            "image": target_image_id,
            "action_units": action_units
        })

@app.route("/api/get_my_image/<image_id>", methods=["GET"])
@login_required
def get_my_image(image_id):
    image = GameplayImages.query.filter_by(id=image_id).first()
    if (image is None):
        return {"success": False, "error": "not found"}
    elif (image.user_id != current_user.id):
        return {"success": False, "error": "not authorized"}
    
    else:
        image_stream = BytesIO()
        image_stream.write(image.image)
        image_stream.seek(0)
        return send_file(image_stream, mimetype="image/jpeg")

@app.route("/api/download_my_data", methods=["GET"])
@login_required
def download_my_data():
    current_user_id = current_user.id
    user = Users.query.get(current_user_id)
    images = GameplayImages.query.filter_by(user_id=current_user_id).all()
    zip_filename = f"facegame_data_export_id{current_user_id}_{current_user.username}_{datetime.utcnow().strftime('%Y-%m-%d_%H-%M-%S')}.zip"
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
        engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
        metadata = MetaData(bind=engine)
        metadata.reflect()

        # Write user information to a CSV file in the zip
        user_data_filename = f"user_{current_user_id}_data.csv"
        user_table = metadata.tables[Users.__tablename__]
        user_columns = user_table.c.keys()
        user_data = [f"{column}: {getattr(user, column)}" for column in user_columns]
        zip_file.writestr(user_data_filename, '\n'.join(user_data))

        # Write gameplay images information to a CSV file in the zip
        gameplay_images_filename = f"gameplay_images_{current_user_id}_data.csv"
        gameplay_images_table = metadata.tables[GameplayImages.__tablename__]
        gameplay_images_columns = gameplay_images_table.c.keys()
        gameplay_images_data = []
        for image in images:
            image_data = [f"{column}: {getattr(image, column)}" for column in gameplay_images_columns]
            gameplay_images_data.append(','.join(image_data))
        zip_file.writestr(gameplay_images_filename, '\n'.join(gameplay_images_data))

        # Write gameplay images to a directory in the zip
        gameplay_images_directory = f"user_{current_user_id}_images/"
        for image in images:
            # Convert the blob image to PIL Image object
            img = Image.open(BytesIO(image.image))
            image_filename = f"{gameplay_images_directory}{image.id}.png"
            image_bytes = BytesIO()
            img.save(image_bytes, format='PNG')

            # Add the image file to the zip
            zip_file.writestr(image_filename, image_bytes.getvalue())

    # Seek to the beginning of the buffer
    zip_buffer.seek(0)

    # Return the zip file as a response
    return send_file(zip_buffer, as_attachment=True, attachment_filename=zip_filename, mimetype='application/zip')

@app.route("/api/delete_my_data", methods=["DELETE"])
@login_required
def delete_user_data():
    try:
        current_user_id = current_user.id
        Users.query.filter_by(id=current_user_id).delete()
        GameplayImages.query.filter_by(user_id=current_user_id).delete()
        db.session.commit()
        # ADD THE USER ID AND A DELETION DATE TO THE TABLE FOR FUTURE REFERENCE
        return {"success": True}
    except:
        # LOG THE ERROR FOR DEBUGGING
        return {"success": False, "error": "Your data could not be deleted. Please contact us directly. Sorry for the inconvenience."}

        

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("home"))

@app.route("/goodbye")
def goodbye():
    return render_template("goodbye.html")


@app.route("/account", methods=["GET", "POST"])
@require_registered()
@login_required
def account():
    form = PreferencesForm()
    form.data_sharing_allowed.data = current_user.data_sharing_allowed_status
    if request.method == "POST":
        form.process(request.form)
    if form.validate_on_submit():
        current_user.data_sharing_allowed = form.data_sharing_allowed.data
        try:
            db.session.commit()
            flash("Your settings were updated")
        except:
            flash("There was an error. Please try again. If the problem persists, please send us an email.")
    return render_template("account.html", form=form)


@app.route("/terms_of_service")
def terms_of_service():
    return render_template("terms_of_service.html")

@app.route("/informed_consent")
def informed_consent():
    return render_template("informed_consent.html")



if __name__ == "__main__":
    
    create_tables()
    app.run(host="localhost", debug=False)
    # app.run(host="localhost", debug=True)
    

