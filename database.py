import sqlite3
import os
import ast
import threading
from uuid import uuid1
from os.path import exists
from au_detection import calculate_action_units_from_image_url
from datetime import datetime
from dotenv import load_dotenv
from threading import Lock
from werkzeug.utils import secure_filename
from time import sleep

load_dotenv("facegame_data/.env")
lock = Lock()

AU_MODEL_ID = os.environ["AU_MODEL_ID"]
FACES_FOLDER_PATH = os.environ["FACES_FOLDER_PATH"]

DATABASE_PATH = os.environ["DATABASE_PATH"]

print(f"Database: ${DATABASE_PATH}")

connection = sqlite3.connect(DATABASE_PATH, check_same_thread=False, timeout=2500)
cursor = connection.cursor()

def create_tables_if_not_exist():
    """Creates all tables for the database if they don't already exists"""
    sql_command = """
    CREATE TABLE IF NOT EXISTS TBL_IMAGES_GOLD (
    gold_id VARCHAR(32) PRIMARY KEY, 
    uploaded_by VARCHAR(20),
    image_url VARCHAR(50),
  	au_list_predicted VARCHAR(200),
  	gender_predicted CHAR(1),
  	age_predicted INTEGER,
  	label_lcas VARCHAR(20),
  	au_model_id VARCHAR(10),
    date DATE
    );"""

    try: 
        lock.acquire(True)
        cursor.execute(sql_command)
    finally:
        lock.release()

    sql_command = """
    CREATE TABLE IF NOT EXISTS TBL_GAMEPLAY (
    gameplay_id VARCHAR(32) PRIMARY KEY, 
    gold_id VARCHAR(32),
    session_id VARCHAR(32),
    image_url VARCHAR(50),
  	au_list_predicted VARCHAR(200),
  	face_landmark_list_predicted VARCHAR(420),
  	hog_values_list_predicted VARCHAR(38000),
  	gender_predicted CHAR(1),
  	age_predicted INTEGER,
    emotions_predicted VARCHAR(200),
    jaccard_index REAL,
  	au_model_id VARCHAR(10),
    face_bbox VARCHAR(20),
    image_dims VARCHAR(20),
    date DATE,
    FOREIGN KEY (session_id) REFERENCES TBL_SESSION (session_id)
    FOREIGN KEY (gold_id) REFERENCES TBL_IMAGES_GOLD (gold_id)
    );"""

    try: 
        lock.acquire(True)
        cursor.execute(sql_command)
    finally:
        lock.release()

    sql_command = """
    CREATE TABLE IF NOT EXISTS TBL_SESSION (
    session_id VARCHAR(32) PRIMARY KEY,
    ip_address VARCHAR(50),
    date DATE
    )"""
    try: 
        lock.acquire(True)
        cursor.execute(sql_command)
    finally:
        lock.release()

    sql_command = """
    CREATE TABLE IF NOT EXISTS TBL_BUG_REPORTS (
    bug_id VARCHAR(32) PRIMARY KEY, 
    bug_text VARCHAR(200),
    user_agent VARCHAR(300),
    date DATE
    );"""

    try: 
        lock.acquire(True)
        cursor.execute(sql_command)
    finally:
        lock.release()

def add_gold_image(image_url, uploaded_by):
    """Adds gold image to TBL_IMAGES_GOLD, creating AU data for it automatically"""
    sql_command = """
    INSERT INTO TBL_IMAGES_GOLD (image_url, au_list_predicted, au_model_id, date, gold_id, uploaded_by) 
    VALUES (?, ?, ?, ?, ?, ?);
    """
    gold_id = uuid1().hex
    time = datetime.now().strftime("%B %d, %Y %I:%M%p")
    new_gold_image = (image_url, str(calculate_action_units_from_image_url(image_url)[1]), AU_MODEL_ID, time, gold_id, uploaded_by)
    try: 
        lock.acquire(True)
        cursor.execute(sql_command, new_gold_image)
    finally:
        lock.release()
    connection.commit()
    return gold_id

def add_gameplay(gold_id):
    """Adds gameplay (1 round) to TBL_GAMEPLAY"""
    sql_command = """ 
    INSERT INTO TBL_GAMEPLAY (gold_id, date, gameplay_id) 
    VALUES (?, ?, ?);
    """
    time = datetime.now().strftime("%B %d, %Y %I:%M%p")
    gameplay_id = uuid1().hex
    new_data = (gold_id, time, gameplay_id)
    try:
        lock.acquire(True)
        cursor.execute(sql_command, new_data)
    finally:
        lock.release()
    connection.commit()
    return gameplay_id

def add_session(ip_address):
    """Adds a new session to TBL_SESSION, logging date and origin ip"""
    sql_command = """
    INSERT INTO TBL_SESSION (ip_address, date, session_id)
    VALUES (?, ?, ?);
    """
    session_id = uuid1().hex
    print("New session with UUID", session_id)
    time = datetime.now().strftime("%B %d, %Y %I:%M%p")
    new_data = (ip_address, time, session_id)
    try:
        lock.acquire(True)
        cursor.execute(sql_command, new_data)
    finally:
        lock.release()
    connection.commit()
    return session_id

# secure this with a secret key / ip adress etc. so that attackers can't change database
def update_gameplay_image_and_offline_aus(gameplay_id, image_url, au_list_predicted, jaccard_index, session_id):
    """Adds player image, predicted au's and session id to TBL_GAMEPLAY"""
    sql_command = """
    UPDATE TBL_GAMEPLAY SET
    image_url=?, au_list_predicted=?, au_model_id=?, jaccard_index=?, session_id=?
    WHERE gameplay_id = ?
    """
    update_data = (image_url, str(au_list_predicted), AU_MODEL_ID, jaccard_index, session_id, gameplay_id)
    try:
        lock.acquire(True)
        cursor.execute(sql_command, update_data)
    finally:
        lock.release()
    connection.commit()
    return gameplay_id

# secure this with a secret key / ip adress etc. so that attackers can't change database
def update_gameplay_online_results(gameplay_id, face_landmark_list_predicted, 
    hog_values_list_predicted, gender_predicted,
    age_predicted, emotions_predicted, face_bbox, image_dims):
    """Adds data generated by web application to TBL_GAMEPLAY"""
    sql_command = """
    UPDATE TBL_GAMEPLAY SET
    face_landmark_list_predicted=?, hog_values_list_predicted=?, 
    gender_predicted=?, age_predicted=?, emotions_predicted=?,
    face_bbox=?, image_dims=?
    WHERE gameplay_id = ?
    """
    update_data = (str(face_landmark_list_predicted), str(hog_values_list_predicted), gender_predicted,
                  age_predicted, str(emotions_predicted), face_bbox, image_dims, gameplay_id)
    
    try:
        lock.acquire(True)
        cursor.execute(sql_command, update_data)
    finally:
        lock.release()
    connection.commit()
    return gameplay_id

def get_random_image_data(session_id, check_previous):
    """Returns data for a random image that was not played in session with id session_id"""
    # SELECT TBL_IMAGES_GOLD.gold_id from TBL_IMAGES_GOLD WHERE (COUNT (*) SELECT TBL_GAMEPLAY.gold_id, TBL_GAMEPLAY.session_id FROM TBL_GAMEPLAY WHERE (TBL_GAMEPLAY.gold_id=TBL_IMAGES_GOLD.gold_id AND TBL_GAMEPLAY.session_id="X"))
    sql_command = """
    SELECT GOLD.gold_id, GOLD.image_url, GOLD.au_list_predicted
    from TBL_IMAGES_GOLD as GOLD WHERE
    (SELECT COUNT(*) FROM TBL_GAMEPLAY as GAME WHERE
    (GAME.gold_id=GOLD.gold_id AND GAME.session_id=(?)) LIMIT 1)=0
    ORDER BY RANDOM() LIMIT 1
    """
    if check_previous: # will prevent infinite recursion in case selected image does not exist
        try:
            lock.acquire(True)
            cursor.execute(sql_command, (session_id,))
            output = cursor.fetchone()
        finally:
            lock.release()  
    else:
        output = False
    if not output:
        sql_command = """
            SELECT GOLD.gold_id, GOLD.image_url, GOLD.au_list_predicted
            from TBL_IMAGES_GOLD AS GOLD ORDER BY RANDOM() LIMIT 1
            """
        try:
            lock.acquire(True)
            cursor.execute(sql_command)
            output = cursor.fetchone()
        finally:
            lock.release()
    print(output)
    if check_image_present(output[1]):
        return output[0], output[1], output[2]
    else:
        return get_random_image_data(session_id, False)


def check_image_present(image_url):
    """Check if image with image url image_url is present in gold faces folder"""
    return os.path.exists(image_url)

    
def check_all_images_present():
    """Prints gold images that are in the database but not in the image folder"""
    sql_command = "SELECT image_url from TBL_IMAGES_GOLD" 
    try:
        lock.acquire(True)
        cursor.execute(sql_command)
        output = cursor.fetchall()
    finally:
        lock.release()
    for filename in output:
        if not exists(filename[0]):
            print(f"{filename[0]} does not exist, but is in database!")

def check_all_images_in_database():
    """Generates data for gold images that are in the image folder, but not in the database"""
    output = os.listdir(FACES_FOLDER_PATH)
    missing_list = []
    for filename in output:
        sql_command = "SELECT * FROM TBL_IMAGES_GOLD WHERE image_url = (?)"
        try:
            lock.acquire(True)
            imagepath = os.path.join(FACES_FOLDER_PATH, secure_filename(filename))
            cursor.execute(sql_command, (imagepath,))
            output = cursor.fetchone()
        finally: 
            lock.release()
        if not output:
            print(f"{filename} does exist, but is not in database! Adding to DB!")
            missing_list.append(filename)
    return missing_list

def get_action_units_for_gold(gold_id):
    """Returns action units for gold image with id gold_id"""
    sql_command = "SELECT au_list_predicted from TBL_IMAGES_GOLD where gold_id = (?)"
    try:
        lock.acquire(True)
        cursor.execute(sql_command, (gold_id,))
        output = cursor.fetchone()[0]
    finally:
        lock.release()
    return ast.literal_eval(output)

def add_bugreport(bug_text, user_agent):
    """Adds bug report to TBL_BUG_REPORTS"""
    sql_command = """ 
    INSERT INTO TBL_BUG_REPORTS (bug_id, bug_text, user_agent, date) 
    VALUES (?, ?, ?, ?);
    """
    time = datetime.now().strftime("%B %d, %Y %I:%M%p")
    bug_id = uuid1().hex
    new_data = (bug_id, bug_text, user_agent, time)
    try:
        lock.acquire(True)
        cursor.execute(sql_command, new_data)
    finally:
        lock.release()
    connection.commit()
    return bug_id

# def update_jaccard_score(gameplay_id, score):
#     """Updates the jaccard score for gameplay with id gameplay_id to score"""
#     sql_command = "UPDATE TBL_GAMEPLAY SET jaccard_index = (?) WHERE gameplay_id = (?)"
#     cursor.execute(sql_command, (score, gameplay_id))
#     return True

create_tables_if_not_exist()
check_all_images_present()