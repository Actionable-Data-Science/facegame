import os
import sys
import json
import base64
import ast
import au_detection
from random import choice
from pathlib import Path
from flask import jsonify
from database import add_gold_image
from dotenv import load_dotenv

load_dotenv()


FACES_FOLDER_PATH = os.environ["FACES_FOLDER_PATH"]
USERS = ast.literal_eval(os.environ["USERS"]) 

manual_image_aus_json_str = open("./static/faces/manual_au_data.json").read()
manual_image_aus = json.loads(manual_image_aus_json_str)
automatic_image_aus_json_str = open("./static/faces/automatic_au_data.json").read()
automatic_image_aus = json.loads(automatic_image_aus_json_str)

def get_random_filename(file_ext, folder):
    file_list = list(Path(folder).glob(f"**/*.{file_ext}"))
    return choice(file_list).name

def get_random_image():
    random_filename = get_random_filename("jpg", "static/faces")
    if random_filename in manual_image_aus:
        random_image_aus = manual_image_aus[random_filename]
    elif random_filename in automatic_image_aus:
        random_image_aus = automatic_image_aus[random_filename]
    else:
        automatic_image_aus[random_filename] = au_detection.calculate_action_units_from_image_url(random_filename)
        random_image_aus = automatic_image_aus[random_filename]
        save_automatic_aus()
    return random_filename, random_image_aus

def check_admin_credentials(user, password):
    print("Users:", USERS)
    if [user, password] in USERS:
        return True
    else:
        return False

def generate_data(path_to_image):
    add_gold_image(path_to_image)

def save_automatic_aus():
    with open("static/faces/automatic_au_data.json", "w") as json_file:
        json.dump(automatic_image_aus, json_file)