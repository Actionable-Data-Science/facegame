import os
import sys
import json
import base64
import ast
import au_detection
import threading
from random import choice
from pathlib import Path
from flask import jsonify
from database import add_gold_image, check_all_images_in_database
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

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

def calculate_gold_aus(imagepath, uploaded_by):
    print("Calculating AU's for", imagepath)
    add_gold_image(imagepath, uploaded_by)

def calculate_jaccard_index(arr1, arr2):
    intersect = len([x for x in arr1 if x in arr2])
    return intersect / (len(arr1) + len(arr2) - intersect)       

def generate_missing():
    missing_list = check_all_images_in_database()
    for filename in missing_list:
        imagepath = os.path.join(FACES_FOLDER_PATH, secure_filename(filename))
        thread = threading.Thread(target=calculate_gold_aus, args=(imagepath, "folder"))
        thread.start()

def save_automatic_aus():
    with open("static/faces/automatic_au_data.json", "w") as json_file:
        json.dump(automatic_image_aus, json_file)

generate_missing()