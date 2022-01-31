from flask import Flask, request, send_from_directory, render_template, redirect, jsonify, url_for
from au_detection import calculate_action_units_from_base_64_image
from base64 import b64encode, b64decode
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import helpers
import logging
import os

app = Flask(__name__, static_folder="static")

gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.DEBUG)
app.logger.debug('Server started')

load_dotenv()

FACES_FOLDER_PATH = os.environ["FACES_FOLDER_PATH"]

@app.route('/')
def send_home():
    if request.cookies and request.cookies["facegameconsent"] == "True":
        return redirect(url_for("send_game"))
    else:
        return redirect(url_for("send_consent"))

@app.route('/consent')
def send_consent():
    return render_template("consent.html")

@app.route('/game')
def send_game():
    if request.cookies and request.cookies["facegameconsent"] == "True":
        return render_template("game.html")
    else:
        return redirect(url_for("send_consent"))

@app.route("/admin")
def send_admin():
    return render_template("admin-panel.html")

@app.route('/api/getRandomImage', methods=["GET"])
def get_random_image():
    random_filename, random_image_aus = helpers.get_random_image()
    return jsonify(imageName= random_filename, actionUnits= random_image_aus)

@app.route('/api/getActionUnits', methods=["POST"])
def get_action_units():
    image = request.json["image"]["base64image"]
    app.logger.debug("Rec JSON: ", request.json)
    return jsonify(actionUnits = calculate_action_units_from_base_64_image(image))

@app.route('/api/uploadImage', methods=["POST"])
def upload_image():
    user = request.form.get('user')
    password = request.form.get('pass')
    if helpers.check_admin_credentials(user, password):
        imagefile = request.files['imagefile']
        imagepath = os.path.join(FACES_FOLDER_PATH, secure_filename(imagefile.filename))
        imagefile.save(imagepath)
        helpers.generate_data(imagepath)
        return "Success!"
    else:
        return "Error!"

if __name__ == "__main__":
    app.run()

#rint(calculate_action_units("./bg_0_neutral.jpg"))