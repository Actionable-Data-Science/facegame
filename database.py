import sqlite3
from au_detection import calculate_action_units_from_image_url
from datetime import datetime

AU_MODEL_ID = "1" # make this an environment variable

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
  	session_id VARCHAR(10),
    image_url VARCHAR(50),
  	au_list_predicted VARCHAR(200),
  	face_landmark_list_predicted VARCHAR(420),
  	hog_values_list_predicted VARCHAR(38000),
  	gender_predicted CHAR(1),
  	age_predicted INTEGER,
  	au_model_id VARCHAR(10),
    date DATE,
    FOREIGN KEY (gold_id) REFERENCES TBL_IMAGES_GOLD (gold_id)
    );"""
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

def add_gameplay(gold_id, session_id, image_url, 
    au_list_predicted, face_landmark_list_predicted, 
    hog_values_list_predicted, gender_predicted,
    age_predicted):
    sql_command = """
    INSERT INTO TBL_GAMEPLAY (gold_id, session_id, image_url, 
        au_list_predicted, face_landmark_list_predicted, 
        hog_values_list_predicted, gender_predicted, age_predicted,
        au_model_id, date) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """
    time = datetime.now().strftime("%B %d, %Y %I:%M%p")
    new_gameplay = (gold_id, session_id, image_url, 
        str(au_list_predicted), str(face_landmark_list_predicted),
        str(hog_values_list_predicted), gender_predicted,
        age_predicted, AU_MODEL_ID, time)
    cursor.execute(sql_command, new_gameplay)
    connection.commit()
    return cursor.lastrowid


create_tables_if_not_exist()

