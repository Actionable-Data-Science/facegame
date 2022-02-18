import os
import sys
import json
import base64
import ast
import au_detection
import threading
import concurrent.futures
from time import sleep
from random import choice
from pathlib import Path
from flask import jsonify
from database import add_gold_image, check_all_images_in_database
from dotenv import load_dotenv
from base64 import urlsafe_b64decode, b64encode
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

def load_mini_deniz():
    with open("./static/mini_deniz.png") as file:
        b64image = b64encode(file.read())
    return b64image

def save_b64_to_png(image_url, image):
    with open(image_url, "wb") as file:
        file.write(urlsafe_b64decode(image.split(",")[1]))

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

def batch_generate_aus(path_list, user):
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        for imagepath in path_list:
            executor.submit(calculate_gold_aus, imagepath, user)

def preheat_au_detection():
    print("Preheating AU detection")
    return au_detection.calculate_action_units_from_base_64_image(mini_deniz_b64)


def save_automatic_aus():
    with open("static/faces/automatic_au_data.json", "w") as json_file:
        json.dump(automatic_image_aus, json_file)

# generate_missing()
# mini_deniz_b64 = load_mini_deniz()