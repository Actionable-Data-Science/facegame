from flask import Flask, request, send_from_directory, render_template, redirect, jsonify, url_for
from au_detection import calculate_action_units_from_base_64_image
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import threading
import ast
import helpers
import logging
import os
import database
import base64
import datetime

# import faulthandler; faulthandler.enable()

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

@app.route('/aus')
def send_aus():
    if request.cookies and request.cookies["facegameconsent"] == "True":
        return render_template("aumirror.html")
    else:
        return redirect(url_for("send_consent"))

@app.route("/admin")
def send_admin():
    return render_template("admin-panel.html")

@app.route('/bugreport')
def send_bug_report():
    return render_template("report-error.html")


@app.route('/api/getGameplayData', methods=["GET"])
def get_gameplay_data():
    # helpers.preheat_au_detection()
    session_id = request.args.get("sessionId")
    random_image_data = database.get_random_image_data(session_id, True)
    random_image_id = random_image_data[0]
    random_filename = random_image_data[1].split("/")[-1]
    random_image_aus = ast.literal_eval(random_image_data[2])
    gameplay_id = database.add_gameplay(random_image_id)
    print(random_image_id, random_filename, random_image_aus)
    return jsonify(imageId=random_image_id, imageName= random_filename, actionUnits= random_image_aus, gameplayId = gameplay_id)

@app.route('/api/getNewGameplayId', methods=["GET"])
def get_new_gameplay_id():
    # helpers.preheat_au_detection()
    image_id = request.args.get("imageId")
    print("Retry for: ", image_id)
    gameplay_id = database.add_gameplay(image_id)
    return jsonify(gameplayId=gameplay_id)

@app.route('/api/getSessionId', methods=["GET"])
def get_session_id():
    session_id = database.add_session(request.remote_addr)
    print(f"Session ID {session_id} assigned to user at {request.remote_addr}")
    return jsonify(sessionId= session_id)

@app.route('/api/getActionUnits', methods=["POST"])
def get_action_units():
    is_game = request.json["isGame"]
    if is_game:
        is_preheat = request.json["isPreheat"]
        gameplay_id = request.json["gameplayId"]
        session_id = request.json["sessionId"]
        gold_id = request.json["goldId"]
        success, action_units, error = calculate_action_units_from_base_64_image(request.json["base64image"])
        if not is_preheat:
            image_url = os.path.join(GAMEPLAY_IMAGE_FOLDER_PATH, f"gameplay_img_{gameplay_id}.png")
            save_image_thread = threading.Thread(target=helpers.save_b64_to_png, args=(image_url,request.json["base64image"]))
            save_image_thread.start()
            jaccard_index = helpers.calculate_jaccard_index(database.get_action_units_for_gold(gold_id), action_units)
            db_thread = threading.Thread(target=database.update_gameplay_image_and_offline_aus, args=(gameplay_id, image_url, action_units, jaccard_index, session_id))
            db_thread.start()
            return jsonify(actionUnits = action_units, jaccardIndex = jaccard_index, success=success, errorMessage=error)
        else:
            print("AU Detection pre-heated")

            return jsonify(success = True)
    else:
        success, action_units, error = calculate_action_units_from_base_64_image(request.json["base64image"])
        print("AUs", success, action_units, error)
        return jsonify(actionUnits = action_units, success=success, errorMessage=error)


@app.route('/api/uploadOnlineResults', methods=["POST"])
def upload_online_results():
    req = request.json
    status_vector = req["statusVector"]
    gameplay_id = req["gameplayId"]
    database.update_gameplay_online_results(gameplay_id, status_vector["landmarks"],
    status_vector["hogs"], status_vector["gender"],
    status_vector["age"], status_vector["emotions"], status_vector["faceBbox"], status_vector["imageDims"])
    return "Success"

@app.route('/api/uploadImage', methods=["POST"])
def upload_image():
    user = request.form.get('user')
    password = request.form.get('pass')
    if helpers.check_admin_credentials(user, password):
        imagefiles = request.files.getlist("imagefiles")
        path_list = []
        for imagefile in imagefiles:
            imagepath = os.path.join(FACES_FOLDER_PATH, secure_filename(imagefile.filename))
            imagefile.save(imagepath)
            path_list.append(imagepath)
        b_thread = threading.Thread(target=helpers.batch_generate_aus, args=(path_list,user))
        b_thread.start()
        return "Success!"
    else:
        return "Wrong user credentials"

@app.route('/api/sendBugReport', methods=["POST"])
def upload_bug_report():
    user_agent = request.json["userAgent"]
    time = datetime.datetime.now()
    bug_description = request.json["bugDescription"]
    bug_id = database.add_bugreport(bug_description, user_agent)
    with open("logs/bugs.txt", "a") as bug_file:
        bug_file.write(f"{bug_id}   {bug_description}   {user_agent}    {time}\n")
    return jsonify(bugId = bug_id)

@app.route('/api/getNewTargetImage', methods=["GET"]) # for the facegame app
def get_new_target_image():
    random_image_data = database.get_random_image_data(77777, False)
    random_filename = random_image_data[1].split("/")[-1]
    random_image_aus = ast.literal_eval(random_image_data[2])
    with open("static/faces/" + random_filename, "rb") as image:
        random_image = base64.b64encode(image.read()).decode('ascii')
    return jsonify(targetAUs = random_image_aus, image = random_image)


if __name__ == "__main__":
    app.run()
