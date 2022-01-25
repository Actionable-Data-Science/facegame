from flask import Flask, request, send_from_directory, render_template, redirect, jsonify, url_for
from audetection.au_detection import calculate_action_units
from base64 import b64encode, b64decode
import helpers
import logging

app = Flask(__name__, static_folder="static")

gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.DEBUG)
app.logger.debug('Server started')

@app.route('/')
def route_home():
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

@app.route('/api/getRandomImage', methods=["GET"])
def get_random_image():
    random_filename, random_image_aus = helpers.get_random_image()
    return jsonify(imageName= random_filename, actionUnits= random_image_aus)

@app.route('/api/getActionUnits', methods=["POST"])
def get_action_units():
    image = request.json["image"]["base64image"]
    app.logger.debug("Rec JSON: ", request.json)
    return jsonify(actionUnits = calculate_action_units(image))

if __name__ == "__main__":
    app.run()

#rint(calculate_action_units("./bg_0_neutral.jpg"))