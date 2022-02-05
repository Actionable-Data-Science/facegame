from flask import Flask, request, send_from_directory, render_template, redirect, jsonify, url_for
from au_detection import calculate_action_units_from_base_64_image
from database import get_random_image_data, add_gameplay, update_gameplay_image_and_offline_aus, update_gameplay_online_results
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from base64 import urlsafe_b64decode
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
GAMEPLAY_IMAGE_FOLDER_PATH = os.environ["GAMEPLAY_IMAGE_FOLDER_PATH"]

@app.route('/')
def send_home():
    if request.cookies and request.cookies.get("facegameconsent") == "True":
        return redirect(url_for("send_game"))
    else:
        return redirect(url_for("send_consent"))

@app.route('/consent')
def send_consent():
    return render_template("consent.html")

@app.route('/attributions')
def send_attributions():
    return render_template("attributions.html")

@app.route('/game')
def send_game():
    if request.cookies and request.cookies["facegameconsent"] == "True":
        return render_template("game.html")
    else:
        return redirect(url_for("send_consent"))

@app.route("/admin")
def send_admin():
    return render_template("admin-panel.html")

@app.route('/api/getGameplayData', methods=["GET"])
def get_gameplay_data():
    random_image_data = get_random_image_data()
    random_image_id = random_image_data[0]
    random_filename = random_image_data[1].split("/")[-1]
    random_image_aus = random_image_data[2]
    gameplay_id = add_gameplay(random_image_id)
    return jsonify(imageId=random_image_id, imageName= random_filename, actionUnits= random_image_aus, gameplayId = gameplay_id)

@app.route('/api/getActionUnits', methods=["POST"])
def get_action_units():
    req = request.json
    image = req["base64image"]
    gameplay_id = req["gameplayId"]
    action_units = calculate_action_units_from_base_64_image(image)
    image_url = imagepath = os.path.join(GAMEPLAY_IMAGE_FOLDER_PATH, f"gameplay_img_{gameplay_id}")
    with open(image_url, "wb") as file:
        file.write(urlsafe_b64decode(image.split(",")[1]))
    update_gameplay_image_and_offline_aus(gameplay_id, image_url, action_units)
    return jsonify(actionUnits = action_units)

@app.route('/api/uploadOnlineResults', methods=["POST"])
def upload_online_results():
    req = request.json
    status_vector = req["statusVector"]
    gameplay_id = req["gameplayId"]
    update_gameplay_online_results(gameplay_id, status_vector["landmarks"], 
    status_vector["hogs"], status_vector["gender"],
    status_vector["age"], status_vector["emotions"])
    return "Success"


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

