import sqlite3
import os
from os.path import exists
from au_detection import calculate_action_units_from_image_url
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

AU_MODEL_ID = os.environ["AU_MODEL_ID"]
FACES_FOLDER_PATH = os.environ["FACES_FOLDER_PATH"]

connection = sqlite3.connect("database/facegame.db", check_same_thread=False)
cursor = connection.cursor()

def create_tables_if_not_exist():
    sql_command = """
    CREATE TABLE IF NOT EXISTS TBL_IMAGES_GOLD (
    gold_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    image_url VARCHAR(50),
  	au_list_predicted VARCHAR(200),
  	gender_predicted CHAR(1),
  	age_predicted INTEGER,
  	label_lcas VARCHAR(20),
  	au_model_id VARCHAR(10),
    date DATE
    );"""
    cursor.execute(sql_command)

    sql_command = """
    CREATE TABLE IF NOT EXISTS TBL_GAMEPLAY (
    gameplay_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    gold_id INTEGER,
    session_id INTEGER,
    image_url VARCHAR(50),
  	au_list_predicted VARCHAR(200),
  	face_landmark_list_predicted VARCHAR(420),
  	hog_values_list_predicted VARCHAR(38000),
  	gender_predicted CHAR(1),
  	age_predicted INTEGER,
    emotions_predicted VARCHAR(200),
  	au_model_id VARCHAR(10),
    date DATE,
    FOREIGN KEY (session_id) REFERENCES TBL_SESSION (session_id)
    FOREIGN KEY (gold_id) REFERENCES TBL_IMAGES_GOLD (gold_id)
    );"""
    cursor.execute(sql_command)

    sql_command = """
    CREATE TABLE IF NOT EXISTS TBL_SESSION (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address VARCHAR(50),
    date DATE
    )
    """
    cursor.execute(sql_command)

def add_gold_image(image_url):
    sql_command = """
    INSERT INTO TBL_IMAGES_GOLD (image_url, au_list_predicted, au_model_id, date) 
    VALUES (?, ?, ?, ?);
    """
    time = datetime.now().strftime("%B %d, %Y %I:%M%p")
    new_gold_image = (image_url, str(calculate_action_units_from_image_url(image_url)), AU_MODEL_ID, time)
    cursor.execute(sql_command, new_gold_image)
    connection.commit()
    return cursor.lastrowid

def add_gameplay(gold_id):
    sql_command = """ 
    INSERT INTO TBL_GAMEPLAY (gold_id, date) 
    VALUES (?, ?);
    """
    time = datetime.now().strftime("%B %d, %Y %I:%M%p")
    new_data = (gold_id, time)
    cursor.execute(sql_command, new_data)
    connection.commit()
    return cursor.lastrowid

def add_session(ip_address):
    sql_command = """
    INSERT INTO TBL_SESSION (ip_address, date)
    VALUES (?, ?);
    """
    time = datetime.now().strftime("%B %d, %Y %I:%M%p")
    new_data = (ip_address, time)
    cursor.execute(sql_command, new_data)
    connection.commit()
    return cursor.lastrowid

# secure this with a secret key / ip adress etc. so that attackers can't change database
def update_gameplay_image_and_offline_aus(gameplay_id, image_url, au_list_predicted, session_id):
    sql_command = """
    UPDATE TBL_GAMEPLAY SET
    image_url=?, au_list_predicted=?, au_model_id=?, session_id=?
    WHERE gameplay_id = ?
    """
    update_data = (image_url, str(au_list_predicted), AU_MODEL_ID, session_id, gameplay_id)
    cursor.execute(sql_command, update_data)
    connection.commit()
    return gameplay_id

# secure this with a secret key / ip adress etc. so that attackers can't change database
def update_gameplay_online_results(gameplay_id, face_landmark_list_predicted, 
    hog_values_list_predicted, gender_predicted,
    age_predicted, emotions_predicted):
    sql_command = """
    UPDATE TBL_GAMEPLAY SET
    face_landmark_list_predicted=?, hog_values_list_predicted=?, 
    gender_predicted=?, age_predicted=?, emotions_predicted=?
    WHERE gameplay_id = ?
    """
    update_data = (str(face_landmark_list_predicted), str(hog_values_list_predicted), gender_predicted,
                  age_predicted, str(emotions_predicted), gameplay_id)
    cursor.execute(sql_command, update_data)
    connection.commit()
    return gameplay_id

def get_random_image_data():
    sql_command = """
      SELECT * FROM TBL_IMAGES_GOLD ORDER BY RANDOM() LIMIT 1
    """
    cursor.execute(sql_command)
    row = cursor.fetchall()[0]
    connection.commit()
    gold_id, random_filename, gold_action_units = row[0], row[1], row[2]
    return gold_id, random_filename, gold_action_units

def check_all_images_present():
    sql_command = "SELECT image_url from TBL_IMAGES_GOLD" 
    cursor.execute(sql_command)
    output = cursor.fetchall()
    for filename in output:
        if not exists(filename[0]):
            print(f"{filename[0]} does not exist, but is in database!")

def check_all_images_in_database():
    output = os.listdir(FACES_FOLDER_PATH)
    for filename in output:
        sql_command = "SELECT * FROM TBL_IMAGES_GOLD WHERE image_url = (?)"
        cursor.execute(sql_command, (os.path.join(FACES_FOLDER_PATH, filename),))
        output = cursor.fetchone()
        if not output:
            print(f"{filename} does exist, but is not in database!")



create_tables_if_not_exist()
check_all_images_present()
check_all_images_in_database()