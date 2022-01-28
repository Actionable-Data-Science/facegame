import os
import sys
import json
import base64
from random import choice
from pathlib import Path
from flask import jsonify
from audetection.au_detection import calculate_action_units

# TODO: Make this a environment variable
FACES_PATH = "static/faces/"

manual_image_aus_json_str = open("static/faces/manual_au_data.json").read()
manual_image_aus = json.loads(manual_image_aus_json_str)
automatic_image_aus_json_str = open("static/faces/automatic_au_data.json").read()
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
        random_image_base64 = "," + image_to_base64(random_filename)
        automatic_image_aus[random_filename] = calculate_action_units(random_image_base64)
        random_image_aus = automatic_image_aus[random_filename]
        save_automatic_aus()
    return random_filename, random_image_aus

def image_to_base64(filename):
    with open(FACES_PATH + filename, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

def save_automatic_aus():
    with open("static/faces/automatic_au_data.json", "w") as json_file:
        json.dump(automatic_image_aus, json_file)


get_random_image()