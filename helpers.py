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

def get_random_filename(file_ext, folder):
    file_list = list(Path(folder).glob(f"**/*.{file_ext}"))
    return choice(file_list).name

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

