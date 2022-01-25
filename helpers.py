import os
import sys
import json
from random import choice
from pathlib import Path
from flask import jsonify

image_aus_json_str = open("static/faces/au_data.json").read()
image_aus = json.loads(image_aus_json_str)

def get_random_filename(file_ext, folder):
    file_list = list(Path(folder).glob(f"**/*.{file_ext}"))
    return choice(file_list).name

def get_random_image():
    random_filename = get_random_filename("jpg", "static/faces")
    random_image_aus = image_aus[random_filename]
    return random_filename, random_image_aus

get_random_image()